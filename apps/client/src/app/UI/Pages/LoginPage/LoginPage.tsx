import React from "react";
import TextField from "../../Componets/TextField/TextField";
import "./LoginPage.scss";

export default function LoginPage(){
    return(
        <div className="LoginPage-container">
            <div className="LoginPage-subcontainer">
                <div className="LoginPage-logo-container">
                    <div className="LoginPage-image-container">
                        <img className="LoginPage-image-img" src="../../../../assets/poker.png" alt="Logo.png"></img>
                    </div>
                    <div className="LoginPage-text-container">
                        <p className="LoginPage-text-txt">Plannning Poker</p>
                    </div>
                </div>
                <div className="LoginInput-container">
                    <div className="LoginInput-container">
                        <TextField value={""} onChange={()=>{}} placeholder={"User1"} destiny="name-of-vote"/>
                    </div>
                </div>
                <div className="LoginPage-button-container">
                    <div className="LoginPage-button-subcontainer">
                        Button will be here
                    </div>
                </div>
            </div>
        </div>
    )
}