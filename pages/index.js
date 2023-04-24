import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";
const web3Utils = require("web3-utils");

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
    organizerAddress,
  } = useContext(VotingContext);

  useEffect(() => {
    checkIfWalletIsConnected();
    getNewCandidate();
    getAllVoterData();
  }, []);
  const [winnerPresent, setWinnerPresent] = useState("");
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const isWinnerPresent = localStorage.getItem("winneraddress");
    setWinnerPresent(isWinnerPresent);
  }, []);

  useEffect(() => {
    if (!currentAccount || !organizerAddress) return;
    if (
      web3Utils.toChecksumAddress(currentAccount) ==
      web3Utils.toChecksumAddress(organizerAddress)
    ) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [currentAccount, organizerAddress]);

  useEffect(() => {
    if (!winningAddress) return;
    localStorage.setItem("winneraddress", winningAddress);
    setWinnerPresent(winningAddress);
  }, [winningAddress]);
  return (
    <div className={Style.home}>
      {!winnerPresent ? (
        <>
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
              {/* <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000000} />
            </small>
          </div> */}
            </div>
          )}
          {winningAddress ? (
            <p className={Style.winnerText}>
              {winningAddress}{" "}
              <span style={{ color: "green" }}>won the voting.</span>
            </p>
          ) : (
            admin && (
              <button onClick={findWinner} className={Style.winnerButton}>
                Get winner
              </button>
            )
          )}

          <Card candidateArray={candidateArray} giveVote={giveVote} />
        </>
      ) : (
        <p className={Style.winnerText}>
          {winnerPresent}{" "}
          <span style={{ color: "green" }}>won the voting.</span>
          <p style={{ color: "red" }}>Voting has ended.</p>
        </p>
      )}
    </div>
  );
};

export default index;
