import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
// import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAddressABI } from "./constants";
import { all } from "axios";

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

  //end of candidate data

  const [error, setError] = useState("");
  const highestVote = [];

  //voter section

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

  //connecting to wallet 

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
      const added = await client.add({ content: file });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
      // const formData = new FormData();
      // formData.append("file", file);
      // const url = await pinataPost(formData);
      // return url;
    } catch (error) {
      // console.log(error);
      // toast("Error uploading file to IPFS");
      setError("Error uploading file to ipfs");
    }
  };
  //create voter
  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;
      // console.log(name, address, position, fileUrl);

      // check inputs
      if (!name || !address || !position || !fileUrl) return setError("Please fill all fields");

      // connecting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // console.log(contract);
      const data = JSON.stringify({ name, address, position, image: fileUrl });
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      const voter = await contract.voterRight(address, name, url, fileUrl);
      voter.wait();
      router.push("/voterList")

    } catch (error) {
      setError("Error creating voter")
    }
  }
  //get voter data
  const getAllVoterData = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    //voter list 
    const voterListData = await contract.getVoterList();
    setVoterAddress(voterListData);
    voterListData.map(async (el) => {
      const singleVoterData = await contract.voterData(el);
      pushCandidate.push(singleVoterData);
    })
    const voterLength = await contract.getVoterLength();

  }
  useEffect(() => {
    getAllVoterData();
  }, []);
  const giveVote = async (id) => {
    try {

    }
    catch (error) {
      setError("Error giving vote")
    }
  }
  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;
    if (!name || !address || !age || !fileUrl) return setError("Please fill all fields");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({ name, address, image: fileUrl, age });
    const added = await client.add(data);
    const ipfs = `https://ipfs.infura.io/ipfs/${added.path}`;
    const voter = await contract.setCandidate(address, age, name, fileUrl, ipfs);
    voter.wait();
    router.push("/");

  }
  const getNewCandidate = async () => {
    try {
      //connexcting smart contract
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const allCandidate = await contract.getCandidate();
      allCandidate.map(async (el) => {
        const singleCandidateData = await contract.getCandidateData(el);
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
      })
      const allCandidateLength = await contract.getCandidateLength();
      setCandidateLength(allCandidateLength.toNumber());

    } catch (error) {
      setError("Error getting new candidate")
    }
  }
  return (
    <VotingContext.Provider value={
      {
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray
      }
    }
    >
      {children}
    </VotingContext.Provider>
  );
};
