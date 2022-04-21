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
    destiny ?: 'name-of-vote'| 'average';

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

    const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
        setState((prevSt) => ({...prevSt, ...data}));
      }    

    function checkDestiny (){
        if(props.destiny==="name-of-vote")
        {return 1;}
        if(props.destiny==="average")
        {return 2;}else{return 0;}
    };
    function changeHandler(e: { target: { value: string; }; }) {
        props.onChange(e.target.value);
        changeGlobalState({gameName:e.target.value});
    }
    if(checkDestiny()===1){
        return (
            <form> 
                <p>
                    <label className="text-field-label-leftcornel" htmlFor="input">{props.name}</label>
                </p>
                <input className="text-field-input-standard"
                    id="input"
                    placeholder="Game Name"
                    onChange={changeHandler} />
            </form>
    )
    }
    if(checkDestiny()===2){
        return (
            <form> 
                <label className ="text-field-label-left" htmlFor="input">{props.name}: </label>
                <input className="text-field-input-result" disabled
                    id="input"
                    placeholder={props.placeholder}
                    onChange={changeHandler} />
            </form>
    )
    }

    return(<p>Here shoud be a textfield <p className="error">{props.name}</p></p>)
}
export default TextField;
