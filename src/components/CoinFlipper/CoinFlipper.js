// import React, { Component } from "react";
import "./CoinFlipper.css";

// import Coin from "../Coin/Coin";
// import { useState } from 'react';
// import Gamble from '../../artifacts/contracts/Gamble.sol/Gamble.json'

// const gambleAddress = "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"

// const [betValue, setPlaceBettingValue] = useState()   //setEtherValue
// const [etherValue, setEtherValue] = useState() 
// const [poolValue, setPoolValue] = useState()
// const [settleNumber, setSettleNumber] = useState(0)
// const [winCount, setWinCount] = useState(0)
// const [loseCount, setLostCount] = useState(0)
// const [winAmount, setWinAmount] = useState(0)


class CoinFlipper  extends Component {
  // constructor(props) {
  //   super(props);
    // define state
  //   this.state = {
  //     side: "tail",
  //     flipping: false,
  //     total: { totalCount: 0, totalTail: 0, totalHead: 0 },
  //   };
  // }
  
  // handleClick_settle = () => {
  //   // eslint-disable-next-line
  //   this.state.total.totalCount++;
  //   var oneOrZero = Math.random();
  //   if (oneOrZero < 0.5) {
  //     oneOrZero = 0;
  //     this.setState({ side: "head" });
  //     // eslint-disable-next-line
  //     this.state.total.totalHead++;
  //   } else {
  //     oneOrZero = 1;
  //     this.setState({ side: "tail" });
  //     // eslint-disable-next-line
  //     this.state.total.totalTail++;
  //   }
  //   this.setState({ flipping: true });
  //   setTimeout(() => this.setState({ flipping: false }), 1000);
  // };

  // handleClick_flip = () => {
  //   // eslint-disable-next-line
  //   this.state.total.totalCount++;
  //   if (this.state.side === "tail") {
  //     this.setState({ side: "head" });
  //   } else {
  //     this.setState({ side: "tail" });
  //   }
  // };

  // handleClick_bet = () => {
  //   // eslint-disable-next-line
  //   this.state.total.totalCount++;
  //   if (this.state.side === "tail") {
  //     this.setState({ side: "head" });
  //   } else {
  //     this.setState({ side: "tail" });
  //   }
  // };


  render() {
    return (
    //   <div className="CoinFlipper">
    //     <h1>Select Heads or Tails 1</h1>
    //     <h1>  </h1>
    //     <Coin side={this.state.side} flipping={this.state.flipping} />
    //     <h5> . </h5>

    //     <button0 onClick={this.handleClick_flip}>FLIP !</button0>
    //     {this.state.total.totalCount > 0 && (
    //       <p>
    //         You Have Selected :
    //         <strong> {this.state.side} </strong>
    //         <br />
    //         Place your bet now !<br /><br />
    //       </p>
          
    //     )}
    //     <br />________________________________<br />
    //     <br />
    //     <button1 onClick={this.handleClick_bet}>BET ?</button1>
    //     {this.state.total.totalCount > 0 && (
    //       <p>
    //         Submitting to Contract...<br /><br />
    //         {/* Total number of Bets :
    //         <strong> {this.state.total.totalCount} </strong>
    //         <br /> */}
    //         Number of heads:
    //         <strong> {this.state.total.totalHead} </strong>
    //         <br />
    //         Number of tails:
    //         <strong> {this.state.total.totalTail} </strong>
    //       </p>
    //     )}
    //     <h5> . </h5>

    //     <button2 onClick={this.handleClick_settle}>SETTLE !</button2>
    //     {this.state.total.totalCount > 0 && (
    //       <p>
    //         Total number of Bets:
    //         <strong> {this.state.total.totalCount} </strong>
    //         <br />
    //         Wons :
    //         <strong> {this.state.total.totalHead} </strong>
    //         <br />
    //         Losses :
    //         <strong> {this.state.total.totalTail} </strong>
    //       </p>
    //     )}

      // </div>
      
    );
  }
}

export default CoinFlipper;

