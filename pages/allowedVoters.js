import React, { useContext, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
// import images from "../assets";
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

  const { getRootProps } = useDropzone({
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
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default allowedVoters;
