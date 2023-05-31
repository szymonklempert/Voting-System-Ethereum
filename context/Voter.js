import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
// import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAddressABI } from "./constants";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "My first";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  const [error, setError] = useState("");
  const highestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  // Connecting Metamask
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return toast("Please Install Metamask");
    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      toast("Please Install Metamask and connect and reload");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return toast("Please Install Metamask");
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
  };

    //upload to ipfs voter image
    const uploadToIPFS = async (file) => {
        try {
            const added = await client.add({content: file});

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            return url;
            // const formData = new FormData();
            // formData.append("file", file);
            // const url = await pinataPost(formData);
            // return url;
        } catch (error) {
            // console.log(error);
            // toast("Error uploading file to IPFS");
            setError("Erro uploading file to ipfs");
        }
        };

  return (
    <VotingContext.Provider value={{ votingTitle, checkIfWalletIsConnected }}>
      {children}
    </VotingContext.Provider>
  );
};
