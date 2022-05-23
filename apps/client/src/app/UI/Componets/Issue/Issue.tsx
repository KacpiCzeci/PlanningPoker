import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from "react";
// import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
import "./Issue.scss";

// Properties of Issue object
export interface IssueProps{
    title: string;
    description: string;
    storyPoints: string|undefined;
}

export default function Issue(props:IssueProps){
    return(
        <div>
            <div>
            {props.title}
            </div>
            <div>

            </div>
        </div>
    );
}