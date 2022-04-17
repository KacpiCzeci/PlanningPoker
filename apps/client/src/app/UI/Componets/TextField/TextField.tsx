import React, { Component, useState } from "react";
import "./TextField.scss"


interface TextFieldProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    name?: string;
    type?: 'email' | 'password' | 'text';

}
function TextField( props : TextFieldProps) {


    const changeHandler = (e: { target: { value: string; }; }) => {
        props.onChange(e.target.value);
    }


    return (
        <form className="test">
            <p>
            <label className="text-field-label-v" htmlFor="input">{props.placeholder}</label>
            </p>

            <input className="text-field-input"
                id="input"
                onChange={changeHandler}
            />
            
        </form>
    );
}
export default TextField;
