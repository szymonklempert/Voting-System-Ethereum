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
    voterArray,
    winningAddressAfterEnd,
    isVoteEnd,
    voteEndAddress,
    getCandidateData,
  } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
    checkIfWalletIsConnected();
    getNewCandidate();
  }, []);

  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [votedVotersPresent, setVotedVotersPresent] = useState(false);
  const [winningData, setWinningData] = useState();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!isVoteEnd) return;
    winningAddressAfterEnd();
  }, [isVoteEnd]);
  useEffect(() => {
    if (!voteEndAddress) return;
    console.log(voteEndAddress);
    getCandidateData(voteEndAddress).then((val) => {
      setWinningData(val);
      console.log(val);
    });
  }, [voteEndAddress]);
  useEffect(() => {
    setTimeout(() => {
      console.log(voterArray);
      voterArray.map((voters) => {
        if (voters[6] == true) {
          setVotedVotersPresent(true);
        }
        if (
          web3Utils.toChecksumAddress(currentAccount) ==
            web3Utils.toChecksumAddress(voters[3]) &&
          voters[6] == true
        ) {
          setAlreadyVoted(true);
        }
      });
    }, [500]);
  }, [voterArray]);

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
          {/* <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000000} />
            </small>
          </div> */}
        </div>
      )}
      {admin && votedVotersPresent && candidateLength > 0 && !isVoteEnd && (
        <button onClick={findWinner} className={Style.winnerButton}>
          End Voting
        </button>
      )}
      {isVoteEnd && voteEndAddress != "" && winningData && (
        // <>
        //   {winningData[6] == "0x0000000000000000000000000000000000000000" ? (
        //     <p className={Style.winnerText}>
        //       Nobody <span style={{ color: "green" }}>won the voting.</span>
        //     </p>
        //   ) : (
        //     <p className={Style.winnerText}>
        //       {winningData[1]}{" "}
        //       <span style={{ color: "green" }}>won the voting.</span>
        //     </p>
        //   )}
        // </>
        <p className={Style.winnerText}>
          {winningData[1]}{" "}
          <span style={{ color: "green" }}>won the voting.</span>
        </p>
      )}

      <Card
        candidateArray={candidateArray}
        giveVote={giveVote}
        admin={admin}
        alreadyVoted={alreadyVoted}
        isVoteEnd={isVoteEnd}
      />
    </div>
  );
};

export default index;
