import React from "react";
import "./CheckBox.scss";

export interface CheckBoxData{
    text: string
    handleOnChange: () => void
    state: boolean
}

export default function Checkbox (props: CheckBoxData) {
    return(
        <div className="CheckBox-container">
            <label className="CheckBox-text">
                <input className="CheckBox-input" type="checkbox" onChange={props.handleOnChange} />
                <span className="CheckBox-checkmark"></span>
                {props.text}
            </label>
        </div>
        
    )
}