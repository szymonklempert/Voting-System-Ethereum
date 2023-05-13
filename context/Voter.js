import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAddressABI } from "./constants";
import { toast } from "react-toastify";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "my first smart contract";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const [winningAddress, setWinningAddress] = useState("");
  const [organizerAddress, setOrganizerAddress] = useState("");
  const [isVoteEnd, setIsVoteEnd] = useState(false);
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState([]);

  const [error, setError] = useState("");
  const highestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState([]);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  //connecting wallet metamask

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

  const pinataPost = async (formdata) => {
    const data = formdata;
    const res = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: data,
      headers: {
        pinata_api_key: "a82fe6fb8d74e65ebc84",
        pinata_secret_api_key:
          "7ff5a45db9a4c5ffbbf70104a83cb4ad5a06517b581e4b452430e63ecc5ff3f3",
        "Content-Type": "multipart/form-data",
      },
    });
    const ipfsHash = res.data.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log(url);
    return url;
  };

  //upload to ipfs voter image
  const uploadToIPFS = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await pinataPost(formData);
      return url;
    } catch (error) {
      console.log(error);
      toast("Error uploading file to IPFS");
    }
  };
  const uploadToIPFSCandidate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await pinataPost(formData);
      return url;
    } catch (error) {
      console.log(error);
      toast("Error uploading file to IPFS");
    }
  };

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, age } = formInput;
      if (!name || !address || !age) return toast("Input data is missing");
      if (age < 18) return toast("You are not eligible to vote.");

      //connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const dataString = JSON.stringify({
        name,
        address,
        age,
        image: fileUrl,
      });
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([dataString], { type: "application/json" }),
        "myData.json"
      );
      const url = await pinataPost(formData);
      const voter = await contract.voterRight(address, name, url, fileUrl);
      await voter.wait(); //wait until it gets registered in blockchain
      window.location.href = "/";
    } catch (error) {
      toast("Error in creating voter");
    }
  };

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //VOTR LIST
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        console.log("singlevoterdata", singleVoterData);
        pushVoter.push(singleVoterData);
      });
      setVoterArray(pushVoter);

      //VOTER LENGTH
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());
    } catch (error) {
      // setError("Couldnot fetch voters data");
      toast("Couldnot fetch voters data");
    }
  };

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      console.log(voterAddress, voterId);
      const voteredList = await contract.vote(voterAddress, voterId);
      await voteredList.wait();
      window.location.href = "/";
    } catch (error) {
      // setError("Sorry!, You have already voted, Reload Browser");
      toast("Error!");
    }
  };

  //Candidate section
  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) return toast("Input data is missing");
      if (age < 18) return toast("You are not eligible to become a candidate.");
      //connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const dataString = JSON.stringify({
        name,
        address,
        image: fileUrl,
        age,
      });
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([dataString], { type: "application/json" }),
        "myData.json"
      );
      const ipfs = await pinataPost(formData);
      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileUrl,
        ipfs
      );
      await candidate.wait(); //wait until it gets registered in blockchain
      window.location.href = "/";
    } catch (error) {
      // setError("Error in creating candidate");
      toast("Error in creating candidate");
    }
  };

  //get candidate data
  const getCandidateData = async (address) => {
    try {
      //connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      return await contract.getCandidateData(address);
    } catch (error) {
      console.log(error);
    }
  };

  const getNewCandidate = async () => {
    try {
      //connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      //all candidate
      const allCandidate = await contract.getCandidate();

      allCandidate.map(async (el) => {
        const singleCandidateData = await contract.getCandidateData(el);
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
      });

      setCandidateArray(pushCandidate);

      //length of candidate
      const allCandidateLength = await contract.getCandidateLength();
      setCandidateLength(allCandidateLength.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const findWinner = async () => {
    try {
      //connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const winnerAddress = await contract.getWinner();
      setWinningAddress(winnerAddress);
      setIsVoteEnd(true);
      await winnerAddress.wait();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const getOrganizerAddress = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const organizerAddress = await contract.getOrganizerAddress();
    setOrganizerAddress(organizerAddress);
  };

  const [voteEndAddress, setVoteEndAddress] = useState();

  const isVotingEndedFunc = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const val = await contract.isVotingEnded();
    setIsVoteEnd(val);
  };

  const winningAddressAfterEnd = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const val = await contract.getWinningAddressAfterVoteComplete();
    setVoteEndAddress(val);
  };

  getOrganizerAddress();
  isVotingEndedFunc();

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        getCandidateData,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
        uploadToIPFSCandidate,
        findWinner,
        winningAddress,
        organizerAddress,
        isVoteEnd,
        winningAddressAfterEnd,
        voteEndAddress,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
