// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const Gamble = await hre.ethers.getContractFactory("Gamble");
  // modulo: number of outcomes
  // 2 - coin
  // 6 - dice
  // 33 - roulette
  // 52/54 - poker cards (without/with jokers)
  const modulo = 2;
  const gamble = await Gamble.deploy(modulo, {value: hre.ethers.utils.parseEther("1000")});

  await gamble.deployed();
  console.log("Gamble deployed to:", gamble.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });