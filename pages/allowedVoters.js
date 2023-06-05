import React, { useContext, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const { uploadToIPFS } = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name:<span>&nbsp; {formInput.name}</span>
              </p>
              <p>
                Address:<span>&nbsp; {formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Position:<span>&nbsp; {formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {
          !fileUrl && (
            <div className={Style.sideInfo}>
              <div className={Style.sideInfo_box}>
                <h4>Create candidate for voting</h4>
                <p>
                  Blockchain voting organization, provide ethereum
                </p>
                <p className={Style.sideInfo_para}> Contract Candidate</p>
              </div>
              <div className={Style.car}>
                {/* {voterArray.map((el, i) => (
                  <div key={i + i} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src="" alt="Profile photo">                      </img>
                      <div className={Style.card_info}>
                        <p>
                          Name
                        </p>
                        <p>
                          Address
                        </p>
                        <p>
                          Details
                        </p>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          )
        }
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create new voter</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()}>
                </input>
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload file
                  </p>
                  <div className={Style.Style.voter_container_box_div_image}>
                    <Image src={images.creator} width={150} height={150} objectFit="contain" alt="File upload"></Image>
                  </div>
                  <p>Drag and drop</p>
                  <p>or browse media on your device</p>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className={Style.input_container}>
          <Input inputType="text" title="Name" placeHolder="Voter Name" handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}></Input>
          <Input inputType="text" title="Address" placeHolder="Voter Address" handleClick={(e) => setFormInput({ ...formInput, address: e.target.value })}></Input>
          <Input inputType="text" title="Position" placeHolder="Position" handleClick={(e) => setFormInput({ ...formInput, position: e.target.value })}></Input>
          <div className={Style.Button}>
            <Button btnName="Authorize Voter" handleClick={() => { }} />
          </div>
        </div>
      </div>
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image src={images.creator} alt="Voter Image"></Image>
          <p> Notice for user</p>
          <p>Organizer</p>
          <p>Only organiser of the voting contract can create voting </p>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
