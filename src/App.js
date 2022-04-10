import './App.css';
import React from "react";
import {useState } from 'react';
import { ethers } from 'ethers';
import Coin from "./components/Coin/Coin";
import "./components/CoinFlipper/CoinFlipper.css";

import Gamble from './artifacts/contracts/Gamble.sol/Gamble.json'

const gambleAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  // Ether - 1, Bitcoin - 0
  const [betValue, setPlaceBettingValue] = useState(0)
  var [betValueArray] = useState([])
  var [etherValue] = useState(0) 
  const [settleNumber, setSettleNumber] = useState(0)
  const [winCount, setWinCount] = useState(0)
  const [loseCount, setLostCount] = useState(0)
  const [winAmount, setWinAmount] = useState(0)
  // Total betting count
  const [totalCount, setTotalCount] = useState(0)
  const [side, setSide] = useState("Bitcoin")
  const [flipping] = useState(false)
  const [totalWinCount, setTotalWinCount] = useState(0)
  const [totalLoseCount, setTotalLoseCount] = useState(0)
  const [totalWinAmount, setTotalWinAmount] = useState(0)

  var [roundArray] = useState([])
  var [etherArray] = useState([])

  // let textInput = React.createRef();
  // let etherInput = React.createRef();
  let etherInputSingleBet = React.createRef();

  let etherInputFuture = React.createRef();
  let roundInputFuture = React.createRef();
  let valueInputFuture = React.createRef();


  async function handleClick_flip() {
    if (side === "Bitcoin") {
      setSide("Ether");
      setPlaceBettingValue(1);
    } else {
      setSide("Bitcoin");
      setPlaceBettingValue(0);
    }
  }

  async function handleClick_bet() {
    etherValue = etherInputSingleBet.current.value;
    console.log(etherValue);
    placeBetting();
    setTotalCount(totalCount+1);
  }

  async function batchBetHandler(inputs) {
    var returnArray = [];
    var array = inputs.split(" ");
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== " ") {
        returnArray.push(array[i]);
      }
    }
    return returnArray;
    // console.log(betValueArray);
  }

  // async function handleClick_batchBet() {
  //   console.log(betValueArray);
  //   betValueArray = await batchBetHandler(textInput.current.value);
  //   etherValue = etherInput.current.value;
  //   console.log(betValueArray);
  //   placeBatchBet();
  // }

  async function handleClick_batchBetFuture() {
    // console.log(betValueArray);
    betValueArray = await batchBetHandler(valueInputFuture.current.value);
    etherArray = await batchBetHandler(etherInputFuture.current.value);
    roundArray = await batchBetHandler(roundInputFuture.current.value);
    console.log(betValueArray);
    console.log(etherArray);
    console.log(roundArray);
    // etherValue = etherInput.current.value;
    // console.log(betValueArray);
    // console.log(textInput.current.value);
    // console.log(etherInput.current.value);
    placeBatchBetFuture();
  }

  async function handleClick_settle() {
    settleBet();
    // setTotalWinCount(parseInt(totalWinCount+winCount));
    // setTotalLoseCount(parseInt(totalLoseCount+loseCount));
    // setTotalWinAmount(parseFloat(totalWinAmount+winAmount));
  }

  // Following is from App.js
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function placeBetting() {
    console.info("placeBetting is clicked... ")
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(gambleAddress, Gamble.abi, signer)
  
        const transaction = await contract.placeBet(betValue, {value: ethers.utils.parseEther(etherValue)})
        await transaction.wait()
  
        alert("Bet is placed");
      } catch (err) {
        alert("No bet is placed!");
      }
    }
  }
  


  // 2 heads - 0.5 ether each, 2 tails - 0.5 ether each
  // in total, you paid 2 ether, (1 ether for Ether, 1 ether for Bitcoin)
  // you win either 2 heads or 2 tails
  // then you win (2 reward rates(1:2) * (0.5 ether * 2 bets) for Ether/Bitcoin = 2 ether).

  // This function is placing the batch bets on the same round (in the same transaction)
  // async function placeBatchBet() {
  //   console.info("placeBatchBet is clicked... ")
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     console.log({ provider })
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(gambleAddress, Gamble.abi, signer)

  //     const transaction = await contract.batchBet(betValueArray, {value: ethers.utils.parseEther(etherValue)})
  //     await transaction.wait()

  //     alert("Batch bets are placed");
  //   }
  // }

  async function sum(etherArray) {
    var sumOfEther = parseFloat("0.0");
    for (var i = 0; i < etherArray.length; i++) {
      sumOfEther += parseFloat(etherArray[i]);
    }
    return sumOfEther;
  }

  async function convert(etherArray) {
    var returnArray = [];
    for (var i = 0; i < etherArray.length; i++) {
      returnArray.push(ethers.utils.parseEther(etherArray[i]));
    }
    return returnArray;
  }

  async function placeBatchBetFuture() {
    console.info("placeBatchBetFuture is clicked... ")
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(gambleAddress, Gamble.abi, signer)

        const sumOfEther = await sum(etherArray);

        etherArray = await convert(etherArray);
        console.log(etherArray);

        if (roundArray[0] === '') {
          console.log(roundArray);
          roundArray.pop();
          for (let i = 0; i < etherArray.length; i++) {
            roundArray.push(0);
          }
          console.log(roundArray);
        }

        const transaction = await contract.batchBetForFuture(betValueArray, etherArray, roundArray, 
          {value: ethers.utils.parseEther(sumOfEther+"")})
        // const transaction = await contract.batchBetForFuture(betValueArray, etherArray, roundArray)
        await transaction.wait();
        setTotalCount(totalCount+betValueArray.length);

        alert("Batch bets are placed");
      } catch (err) {
        alert("No bet is placed!");
      }
    }
  }

  async function settleBet() {
    console.log("settleBet is clicked... ")
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(gambleAddress, Gamble.abi, signer)

      try {
        const transaction = await contract.settleBet(); 
        const rx = await transaction.wait();
        // Capture the event arguments
        const event = rx.events.find(event => event.event === 'Settled');
        // Parse the arguments
        const [winCount, loseCount, winAmount] = event.args;
        console.log(winCount, loseCount, ethers.utils.formatEther(winAmount));
        const data = await contract.getSettledBetNumber();
        console.log('data: ', data);
        // BigNumber.toNumber()
        setSettleNumber(data.toNumber());
        setWinCount(winCount.toNumber());
        setLostCount(loseCount.toNumber());
        // From Wei to Ether: ethers.utils.formatEther(wei)
        setWinAmount(ethers.utils.formatEther(winAmount));

        
        const summary = await contract.summary();
        console.log(summary);
        console.log(summary.sumOfWinAmount);
        setTotalWinAmount(ethers.utils.formatEther(summary.sumOfWinAmount));
        console.log(summary.winCount);
        setTotalWinCount(summary.winCount.toNumber());
        console.log(summary.loseCount);
        setTotalLoseCount(summary.loseCount.toNumber());
      } catch (err) {
        console.log("Error: ", err)
        alert("No bet is settled!")
      }

    }
  }

  // async function handleClick_settleNumber() {
  //   await requestAccount()
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(gambleAddress, Gamble.abi, signer);
  //   const data = await contract.getSettledBetNumber();
  //   alert(data);
  // }


  return (
    <div className="CoinFlipper">
      <header className="App-header">
        <h1>Place your Bet  (Bitcoin or Ether) </h1>
        <h1>  </h1>
        <Coin side={side} flipping={flipping} />
        <button0 onClick={handleClick_flip}>FLIP !</button0> <br /> <br />
        {(
          <p>
            You Have Selected :
            <strong> {side} </strong>
            <br />
            <br />
            {/* Place your bet now !<br /> */}
          </p>
        )}
        <input ref={etherInputSingleBet} placeholder="Ether value to be placed" /> <button1 onClick={handleClick_bet}>Make One Bet?</button1>
        
        {/* _________________________________________________________________________<br /><br /> */}

        {/* 2 textbox: 1 for value */}
        {/* 1,1,0,0,1 */}
        {/* <input onChange={e => setEtherValue(e.target.value)} placeholder="Ether value to be placed" /> */}
        {/* <div> */}
        {/* <label>Ether value to be placed<br /><input ref={etherInput} placeholder="e.g. 5" /></label> */}
        {/* <br /><br /> */}
        {/* <input onChange={e => batchBetHandler(e.target.value)} placeholder="Value for bets, 0,1..." /> <button1 onClick={handleClick_batchBet}>Batch Bet?</button1> */}
        {/* <label>Desired outcome for bet (Ether=1, Bitcoin=0) <br /><input ref={textInput} placeholder="e.g. 0 1 0 1" /></label> */}
        {/* <br /><p>* Any length of input is accepted.</p> */}
        {/* </div> */}
        {/* <button1 onClick={handleClick_batchBet}>Batch Bet?</button1> */}
        
        _________________________________________________________________________<br /><br />
        {/* {(
          <p>
            Total number of Bets :
            <strong> {this.state.total.totalCount} </strong>
            <br /> 
            Number of heads:
            <strong> {totalHead} </strong>
            <br />
            Number of tails:
            <strong> {totalTail} </strong>
          </p>
        )} */}
        <div> 
        <label>Ether value for each bet<br /><input ref={etherInputFuture} placeholder="e.g. 1 2 3 4" /></label>
        <br /><br />
        <label>Desired outcome for each bet <br/>
        (Ether=1, Bitcoin=0)
        <br /><input ref={valueInputFuture} placeholder="e.g. 0 0 1 0" /></label>
        <br /><br />
        <label>Round offset from starting round <br/>
        (Leave blank for current round)
        <br /><input ref={roundInputFuture} placeholder="e.g. 0 0 1 2"/></label>
        </div>
        <button1 onClick={handleClick_batchBetFuture}>Batch Bet For Future?</button1>
        {/* <p>Note: enter 0 for Bitcoin and 1 for Ether. Any length of input is accepted.</p> */}
        _________________________________________________________________________<br />
        <button2 onClick={handleClick_settle}>SETTLE !</button2>
        {(
          <p>
            Total bets placed: 
            <strong> {totalCount} </strong>
            <br />
            Total settled count:
            <strong> {settleNumber} </strong>
            <br />
            Current win count:
            <strong> {winCount} </strong>
            <br />
            Current lose count:
            <strong> {loseCount} </strong>
            <br />
            Current total win amount :
            <strong> {winAmount} </strong>
            <br /><br />
            Total win count:
            <strong> {totalWinCount} </strong>
            <br />
            Total lose count:
            <strong> {totalLoseCount} </strong>
            <br />
            Total win amount :
            <strong> {totalWinAmount} </strong>
          </p>
        )}

        {/* <button2 onClick={handleClick_settleNumber}>SETTLE number!</button2> */}
      </header>
    </div>
    
  );
}

export default App;
