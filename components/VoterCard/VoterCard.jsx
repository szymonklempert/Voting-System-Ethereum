import React, { useEffect, useState } from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import voterCardStyle from "./voterCard.module.css";

const voterCard = ({ voterArray }) => {
  return (
    <>
      <div className={Style.card}>
        {voterArray.map((el, i) => (
          <div className={Style.card_box}>
            <div className={Style.image}>
              <img src={el[7] ? el[4] : el[2]} alt="Profile photo" />
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
