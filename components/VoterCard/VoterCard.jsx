import React, { useEffect, useState } from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import voterCardStyle from "./voterCard.module.css";

const voterCard = ({ voterArray }) => {
  const [images, setImages] = useState([]);
  function checkIfUrlReturnsImage(url) {
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType.startsWith("image/")) {
            console.log("true");
            return true;
          } else {
            console.log("false");
            return false;
          }
        }
        throw new Error("Network response was not OK");
      })
      .catch((error) => {
        console.error("Error checking if URL returns image:", error);
        return false;
      });
  }

  useEffect(() => {
    if (voterArray.length == 0) return;
    async function run() {
      const images = await Promise.all(
        voterArray.map(async (el) => {
          const urlReturnsImage = await checkIfUrlReturnsImage(el[4]);
          return urlReturnsImage ? el[4] : el[2];
        })
      );
      console.log(images);
      setImages(images);
    }

    run();
  }, [voterArray]);

  return (
    <>
      <div className={Style.card}>
        {voterArray.map((el, i) => (
          <div className={Style.card_box}>
            <div className={Style.image}>
              <img src={images[i]} alt="Profile photo" />
            </div>

            <div className={Style.card_info}>
              <h2>
                {el[1]} #{el[0].toNumber()}
              </h2>
              <p>Address: {el[3].slice(0, 30)}..</p>
              <p>
                Over the years, I have acquired relevant skills and experience.
              </p>

              {el[6] == true ? (
                <p className={voterCardStyle.vote_Status}>You Already Voted</p>
              ) : (
                <p className={voterCardStyle.vote_Status_no}> Not Voted</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default voterCard;
