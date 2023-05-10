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

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const {
    uploadToIPFS,
    createVoter,
    voterArray,
    getAllVoterData,
    organizerAddress,
  } = useContext(VotingContext);

  //voters image drop

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  });

  const { getRootProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getAllVoterData();
  }, []);

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
                Age:<span>&nbsp; {formInput.age}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              {/* <h4>Create candidate for voting</h4>
              <p>Blockchain voting organization, provide ethereum</p> */}
              <p className={Style.sideInfo_para}>All Voters</p>

              <div className={Style.car}>
                {voterArray.map((el, i) => (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[7] ? el[4] : el[2]} alt="Profile Photo" />
                    </div>
                    <div className={Style.card_info}>
                      <p>{el[1]}</p>
                      <p>Address: {el[3].slice(0, 10)} ..</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <h1>Create new voter</h1>
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
            title="Name"
            placeholder="Voter Name"
            handleClick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Voter Age"
            handleClick={(e) =>
              setFormInput({ ...formInput, age: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorize Voter"
              handleClick={() => createVoter(formInput, fileUrl, router)}
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
            <b>Notice for user:</b>
          </p>
          <p>Only organizer of voting contract can create voter for election</p>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
