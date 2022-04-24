import React, { useState } from "react";
import "./User.scss";
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
export interface UserProps{
value?:number;
userName:string;
}
    
export default function User(props: UserProps){
    const { state, setState } = useGlobalState();
    if(state.cardPicked!==undefined){
        if (props.value!==undefined){
            return(
                <div className="User-container">
                    <div className={"User-subcontainer-show"}>
                        <div className="User-value">
                            <p className={"User-userValue-show"}>{props.value}</p>
                        </div>
                    </div>
                    <div className="User-name">
                        <p className="User-p">{props.userName}</p>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="User-container">
                    <div className={"User-subcontainer-noshow"}>
                    </div>
                    <div className="User-name">
                        <p className="User-p">{props.userName}</p>
                    </div>
                </div>
            )
        }
    } 
    else{
        if (props.value!==undefined){
            return(
                <div className="User-container">
                    <div className={"User-subcontainer-voted"}>
                    </div>
                    <div className="User-name">
                        <p className="User-p">{props.userName}</p>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="User-container">
                    <div className={"User-subcontainer-novoted"}>
                    </div>
                    <div className="User-name">
                        <p className="User-p">{props.userName}</p>
                    </div>
                </div>
            )
        }
        }
    }
    
   
