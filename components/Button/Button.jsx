import React from "react";

import Style from './Button.module.css'
const Button = ({ btnName, handleClick, classStyle }) => (
    <button className={Style.button} onClick={handleClick} type="button">{btnName}</button>
)
export default Button;