import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";

const index = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength,
    getAllVoterData,
    currentAccount,
    voterLength,
    findWinner,
    winningAddress,
  } = useContext(VotingContext);

  useEffect(() => {
    checkIfWalletIsConnected();
    getNewCandidate();
    getAllVoterData();
  }, []);
  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                Candidates:<span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                Voters:<span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000000} />
            </small>
          </div>
        </div>
      )}
      {winningAddress ? (
        <p>{winningAddress} won the voting.</p>
      ) : (
        <button onClick={findWinner}>Get winner</button>
      )}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

export default index;
