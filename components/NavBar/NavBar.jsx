import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const web3Utils = require("web3-utils");

//INTERNAL IMPORT/
import { VotingContext } from "../../context/Voter";
import Style from "./NavBar.module.css";
// import loding from "../../loding.gif";

const NavBar = () => {
  const {
    connectWallet,
    error,
    currentAccount,
    organizerAddress,
    winningAddress,
  } = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [winnerPresent, setWinnerPresent] = useState("");

  const openNaviagtion = () => {
    if (openNav) {
      setOpenNav(false);
    } else if (!openNav) {
      setOpenNav(true);
    }
  };

  // useEffect(() => {
  //   const isWinnerPresent = localStorage.getItem("winneraddress");
  //   setWinnerPresent(isWinnerPresent);
  // }, []);

  // useEffect(() => {
  //   if (!winningAddress) return;
  //   localStorage.setItem("winneraddress", winningAddress);
  //   setWinnerPresent(winningAddress);
  // }, [winningAddress]);

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
    <div className={Style.navbar}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {error === "" ? "" : toast(error)}
      <div className={Style.navbar_box}>
        <p style={{ fontSize: "24px", fontWeight: "800" }}>
          Welcome To Online Voting System
        </p>
        <div className={Style.title}>
          <Link href={{ pathname: "/" }}>
            {/* <Image src="{loding}" alt="logo" width={80} height={80} /> */}
          </Link>
        </div>
        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={() => openNaviagtion()}>
                  {currentAccount}
                </button>
                {currentAccount && (
                  <span>
                    {openNav ? (
                      <AiOutlineClose onClick={() => openNaviagtion()} />
                    ) : (
                      <AiOutlineMenu onClick={() => openNaviagtion()} />
                    )}
                  </span>
                )}
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link href={{ pathname: "/" }} exact="true">
                      Home
                    </Link>
                  </p>
                  {admin && (
                    <p>
                      <Link href={{ pathname: "candidateRegistration" }}>
                        Candidate Registration
                      </Link>
                    </p>
                  )}
                  {admin && (
                    <p>
                      <Link href={{ pathname: "allowedVoters" }}>
                        Voter Registration
                      </Link>
                    </p>
                  )}

                  <p>
                    <Link href={{ pathname: "voterList" }}>Voter List</Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connectWallet()}>Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
