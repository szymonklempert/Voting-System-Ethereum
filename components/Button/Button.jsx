import React from "react";

import Style from './Button.module.css'
const Button = ({ btnName, handleClick, classStyle }) => (
    <button className={Style.classStyle} onClick={handleClick} type="button">{btnName}</button>
)
export default Button;