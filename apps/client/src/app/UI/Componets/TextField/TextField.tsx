import React, { Component, useState } from "react";
import "./TextField.scss"


interface TextFieldProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    name?: string;
    type?: 'email' | 'password' | 'text';
    destiny ?: 'name-of-vote'| 'average';

}
function TextField( props : TextFieldProps) {
    function checkDestiny (){
        if(props.destiny==="name-of-vote")
        {return 1;}
        if(props.destiny==="average")
        {return 2;}else{return 0;}
    };
    function changeHandler(e: { target: { value: string; }; }) {
        props.onChange(e.target.value);
    }

    if(checkDestiny()===1){
        return (
            <form> 
                <p>
                    <label className="text-field-label-leftcornel" htmlFor="input">{props.placeholder}</label>
                </p>
                <input className="text-field-input-standard"
                    id="input"
                    onChange={changeHandler} />
            </form>
    )
    }
    if(checkDestiny()===2){
        return (
            <form> 
                <label className ="text-field-label-left" htmlFor="input">{props.placeholder}: </label>
                <input className="text-field-input-result" disabled
                    id="input"
                    value={props.value}
                    onChange={changeHandler} />
            </form>
    )
    }

    return(<p>Here shoud be a textfield <p className="error">{props.name}</p></p>)
}
export default TextField;
