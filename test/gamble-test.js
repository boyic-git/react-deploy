const { expect , assert} = require("chai");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");


describe("Gamble contract", function () {
    it("Contract deployment check", async function () {
        const [owner] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});
        const gamblePool = await gamble.getPool();
        expect(gamblePool).to.equal(ethers.utils.parseEther("10"));
    });

    it("Contract should have correct amount of ether after a bet is placed by a better", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        const gamblePool = await gamble.getPool();
        expect(gamblePool).to.equal(ethers.utils.parseEther("10.5"));
    });

    it("Contract should have correct amount of ether after multiple bets are placed by a better", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("1.2")});
        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.7")});
        const gamblePool = await gamble.getPool();
        
        expect(gamblePool).to.equal(ethers.utils.parseEther("12.4"));
    });

    it("Contract should have correct number of committed bets after a bet/bets are made by a better", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        var betNumber = await gamble.connect(better).getCommittedBetsNumber();
        expect(betNumber).to.equal(1);

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("1.2")});
        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.7")});
        betNumber = await gamble.connect(better).getCommittedBetsNumber();
        
        expect(betNumber).to.equal(3);
    });

    it("Contract should have correct amount after a bet is settled", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        const gamblePoolBefore = await gamble.getPool();
        await gamble.connect(better).settleBet();
        var result = await gamble.connect(better).getSettledBetResult(1);
        const gamblePoolAfter = await gamble.getPool();
        if (result) {
            expect(gamblePoolBefore.sub(ethers.utils.parseEther("0.5").mul(2))).to.equal(gamblePoolAfter);
        } else {
            expect(gamblePoolBefore).to.equal(gamblePoolAfter);
        }
    });

    it("Contract should have correct amount after bets are settled", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        const gamblePoolBefore = await gamble.getPool();
        await gamble.connect(better).batchBet([0,1], {value: ethers.utils.parseEther("1")});
        await gamble.connect(better).settleBet();
        var result = await gamble.connect(better).getSettledBetResult(1);
        const gamblePoolAfter = await gamble.getPool();
        expect(gamblePoolBefore).to.equal(gamblePoolAfter);
    });

    it("Contract should have placed bets before calling settle bets", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("123")});
        try {
            await gamble.connect(better).settleBet();
        } catch(error) {
            if(error.message.search("revert") >= 0) {
                assert.equal(error.message.search("revert") >=0, true);
                assert.include(error.message, "No bets made!", "Can not find expected message");
            } else {
                throw error;
            }
        }
        const gamblePool = await gamble.getPool();
        // expect(gamblePool).equal(ethers.utils.parseEther("23"));    // does not fail
        expect(gamblePool).to.equal(ethers.utils.parseEther("123"));    //replace with "to.equal"
    });

    it("Contract should have correct number of committed bets after a bet/bets/batchBets are made", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        var betNumber = await gamble.connect(better).getCommittedBetsNumber();
        expect(betNumber).to.equal(1);

        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("1.2")});
        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.7")});
        betNumber = await gamble.connect(better).getCommittedBetsNumber();
        expect(betNumber).to.equal(3);

        await gamble.connect(better).batchBet([0,1,2], {value: ethers.utils.parseEther("1")});
        betNumber = await gamble.connect(better).getCommittedBetsNumber();
        expect(betNumber).to.equal(6);
    });

    it("Contract should have correct amount of ether after a bet is placed by a owner", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(owner).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        const gamblePool = await gamble.getPool();
        expect(gamblePool).to.equal(ethers.utils.parseEther("10.5"));
    });
    
    it("Contract should have correct amount of ether after a bet is placed by both owner and better", async function () {
        const [owner, better] = await ethers.getSigners();
        const Gamble = await ethers.getContractFactory("Gamble");
        const gamble = await Gamble.connect(owner).deploy(2, {value: ethers.utils.parseEther("10")});

        await gamble.connect(owner).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        await gamble.connect(better).placeBet(1, {value: ethers.utils.parseEther("0.5")});
        const gamblePool = await gamble.getPool();
        expect(gamblePool).to.equal(ethers.utils.parseEther("11"));
    });

})
