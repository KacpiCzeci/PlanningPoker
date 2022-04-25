import React, { Component, useState, useEffect  } from "react";
import "./TextArea.scss"
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";


interface TextAreaProps {
    label?:string|undefined;
    value?: string|number|undefined;
    onChange?: (val: string) => void|undefined;
    placeholder?: string;
    autoFocus?: boolean;
    name?: string;
    type?: 'email' | 'password' | 'text';

}

/**
 * Function to get storage param
 * @param key 
 * @param defaultValue 
 * @returns store
 */

function getSessionStorageOrDefault(key: string, defaultValue: string) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }
    return stored;
}


function TextArea( props : TextAreaProps) {
    const { state, setState } = useGlobalState();

    const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
        setState((prevSt) => ({...prevSt, ...data}));
      }    
    return(
        <div className="TextArea-container">
            <p>
        <label className="TextArea-label" htmlFor="text">{props.label}</label>
        <input id="text" className="TextArea-input" placeholder={"0"} value={props.value}/>
        </p>
        </div>
    )
    // return(<p>Here shoud be a textarea <p className="error">{props.name}</p></p>)
}
export default TextArea;
