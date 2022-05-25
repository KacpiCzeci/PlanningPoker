import React, { useState } from "react";
import "./User.scss";
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
import {PlayerDto} from "@planning-poker/shared/backend-api-client"
import { useGameHook } from '../../Pages/GamePage/useGameHook';
export interface UserProps{
value?:number;
userName?:string;
players?:PlayerDto[];
}
    
export default function User(props: UserProps){
    const game = useGameHook();
    const { state, setState } = useGlobalState();
    let allvoted=0;
    if(props.players !== undefined) {
        for(let i =0;i<props.players.length;i++)
        {
            if(props.players[i].score!==null)
            allvoted++;
        }
    }
    if((game.data.finished!==undefined&&game.data.finished!==false) || allvoted===props.players?.length){
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
    
   
