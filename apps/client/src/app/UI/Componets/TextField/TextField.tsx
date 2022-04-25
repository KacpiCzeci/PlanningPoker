import React, { Component, useState, useEffect  } from "react";
import "./TextField.scss"
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";


interface TextFieldProps {
    value?: string|number|undefined;
    onChange: (val: string) => void|undefined;
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
/**
 * 
 * @param props 
 * @returns 
 */



function TextField( props : TextFieldProps) {
    const { state, setState } = useGlobalState();
    const [val, setVal]=useState("")

    useEffect(()=> setVal(`${props.value}`),[props.value])
    
    const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
        setState((prevSt) => ({...prevSt, ...data}));
    }    

    function changeHandler(e: { target: { value: string; }; }) {
        props.onChange(e.target.value);
        changeGlobalState({gameName:e.target.value});
        setVal(e.target.value);
    }

    return (
        <div className="TextField-container">
            <form> 
                <label className ="TextField-label" htmlFor="input">{props.name} </label>
                <input className="TextField-input"
                    id="input"
                    placeholder={props.placeholder}
                    onChange={changeHandler} 
                    value={val}
                    />
                    
                </form>
        </div>
    )
}
export default TextField;
