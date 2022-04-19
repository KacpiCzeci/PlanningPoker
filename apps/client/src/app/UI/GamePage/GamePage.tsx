import React, { useState } from "react";
import TextField from "../Componets/TextField/TextField"
import CardDeck from "../Componets/CardDeck/CardDeck";
import "./GamePage.scss"

export default function GamePage(){
    const [val, setVal] = useState("");
    return(
        <div className="GamePage-container">
            <div className="GamePage-userinfobar">
                <div className="GamePage-gamegsers">
                </div>
                <div className="GamePage-username">
                </div>
            </div>
            <div className="GamePage-gameinfo">
                <div className="GamePage-gamename">
                    <TextField  placeholder="Name of vote" 
                    value={val}
                    onChange={setVal} />   
                </div>
                <div className="GamePage-vote">
                </div>
                <div className="GamePage-votingresults">
                </div>
            </div>
            <div className="GamePage-voteinfo">
                <div className="GamePage-voteoptions">
                    <CardDeck/>
                </div>
                <div className="GamePage-newvote">
                </div>
            </div>
        </div>
    )
}