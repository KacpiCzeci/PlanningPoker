import React from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import "./LoadingPage.scss";

const styles = {
    width: "75px",
    height: "75px",
    color: "#3993ff"
}

export default function LoadingPage() {
    return(
        <div className="LoadingPage-container">
            <div className="LoadingPage-subcontainer">
                <div className="LoadingPage-CircularProgress">
                    <CircularProgress style={styles}/>
                </div>
                <div className="LoadingPage-text">
                    <p className="LoadingPage-p">Waiting...</p>
                </div>
            </div>
        </div>
    )
}
