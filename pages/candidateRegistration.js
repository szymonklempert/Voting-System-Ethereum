import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import candidateImage from "../assets/candidate1.png";
import uploadImage from "../assets/upload.png";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import { candidatesList } from "../candidatesAndVoters";
const web3Utils = require("web3-utils");

const candidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [availableCand, setAvailableCand] = useState([]);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const {
    uploadToIPFSCandidate,
    setCandidate,
    getNewCandidate,
    candidateArray,
    organizerAddress,
  } = useContext(VotingContext);

  //voters image drop

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFSCandidate(acceptedFile[0]);
    setFileUrl(url);
  });

  const { getRootProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAvailableCand(candidatesList);
      if (candidateArray.length == 0) return;
      candidateArray.map((regCand) => {
        candidatesList.map((cand, index) => {
          if (
            web3Utils.toChecksumAddress(cand) ==
            web3Utils.toChecksumAddress(regCand[6])
          ) {
            console.log(regCand[6], index);
            candidatesList.splice(index, 1);
          }
        });
      });
      setAvailableCand(candidatesList);
    }, [500]);
  }, [candidateArray]);

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name:<span>&nbsp; {candidateForm.name}</span>
              </p>
              <p>
                Address:<span>&nbsp; {candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                Age:<span>&nbsp; {candidateForm.age}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              {/* <h4>Create candidate for voting</h4>
              <p>Blockchain voting organization, provide ethereum</p> */}
              <p className={Style.sideInfo_para}>All Candidates</p>

              <div className={Style.car}>
                {candidateArray.map((el, i) => (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[3]} alt="Profile Photo" />
                    </div>
                    <div className={Style.card_info}>
                      <p>
                        <b>Name: </b>
                        {el[1]} #{el[2].toNumber()}
                      </p>
                      <p>
                        <b>Age: </b>
                        {el[0]}
                      </p>
                      <p>
                        <b>Address: </b>
                        {el[6].slice(0, 10)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <h1>Create new candiate</h1>
        <div className={Style.voter__container}>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getRootProps()} />

                <div className={Style.voter__container__box__div__info}>
                  <p>Upload file: jpg,png, gif, webm max 10mb</p>

                  <div className={Style.voter__container__box__div__image}>
                    <Image
                      src={uploadImage}
                      width={150}
                      height={150}
                      objectFit="content"
                      alt="File upload"
                    />
                  </div>
                  <p>Drag & Drop file</p>
                  <p>or Browse media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Name: "
            placeholder="Candidate Name"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address: "
            placeholder="Candidate Address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age: "
            placeholder="Candidate Age"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorize Candidate"
              handleClick={() => setCandidate(candidateForm, fileUrl, router)}
            />
          </div>
        </div>
      </div>

      <div className={Style.createVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={candidateImage} alt="userProfile" />
          <p>
            <b>Organizer:</b> <span>{organizerAddress}</span>
          </p>
          <p>
            <b>
              <u>Notice for user:</u>
            </b>
          </p>
          <pre>
            Only organizer of voting contract can create candidate for election
          </pre>
          <br />
          <p>
            <b>
              <u>Candidates left to create:</u>
            </b>
          </p>
          {availableCand.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default candidateRegistration;
