import React, { useState } from "react";
import TextField from "../Componets/TextField/TextField"
import "./GamePage.scss"

export default function GamePage(){
    const [val, setVal] = useState("");
    const [val2, setVal2] = useState("2");
    return(
        <div className="GamePage-container">
            <div className="GamePage-header">
                <h1>Planning Poker</h1>
            </div>
            <div className="GamePage-userinfobar">
                <div className="GamePage-gameusers">
                    Game Users
                </div>
                <div className="GamePage-username">
                    Game user nama
                </div>
            </div>
            <div className="GamePage-gameinfo">
                <div className="GamePage-gamename">
                    <TextField  placeholder="Name of vote" 
                    value={val}
                    onChange={setVal}
                    name="name of vote"
                    destiny="name-of-vote"/>   
                </div>
                <div className="GamePage-vote">
                </div>
                <div className="GamePage-voting-results">
                <TextField  placeholder="Average" 
                    value={val}
                    onChange={setVal2}
                    name="avr1"
                    destiny="average"/> 

                     <TextField  placeholder="Average 2" 
                    value={val}
                    onChange={setVal2}
                    name="avr2"
                    destiny="average"/>   
                </div>

                
            </div>
            <div className="GamePage-voteinfo">
                <div className="GamePage-voteoptions">
                </div>
                <div className="GamePage-newvote">
                    NewVote
                </div>
            </div>
        </div>
    )
}