import React from "react";
import "./Coin.css";
import CoinHead from "../../Assets/ether-head.png";
import CoinTail from "../../Assets/bitcoin-tail.png";

const Coin = (props) => {
  return (
    <div className="Coin-container" >
      <div className={`Coin ${props.flipping ? "Coin-rotate" : ""}`}>
        <img
          src={CoinHead}
          className={props.side === "Bitcoin" ? "Coin-back" : "Coin-front"}
        />
        <img
          src={CoinTail}
          className={props.side === "Bitcoin" ? "Coin-front" : "Coin-back"}
        />
      </div>
    </div>
  );
};

export default Coin;