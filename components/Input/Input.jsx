import React, { useContext } from "react";

import Style from "./Input.module.css";
const Input = ({ inputType, title, placeholder, handleClick }) => {
  return (
    <div className={Style.input}>
      <p style={{ marginRight: "1rem", width: "4rem", fontWeight: "600" }}>
        {title}
      </p>
      {inputType == "text" ? (
        <div className={Style.input__box}>
          <input
            type="text"
            className={Style.input__box__form}
            placeholder={placeholder}
            onChange={handleClick}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Input;
