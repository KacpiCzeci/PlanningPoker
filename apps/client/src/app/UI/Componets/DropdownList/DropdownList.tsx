import "./DropdownList.scss"
import Issue from '../Issue/Issue';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NavItem from "../NavItem/NavItem";
import Button from "../Button/Button";
import { TextField } from "@mui/material";

import { ReactComponent as ArrowIcon } from '../../../../assets/icons/arrow.svg';
import { ReactComponent as BoltIcon } from '../../../../assets/icons/bolt.svg';
import { ReactComponent as UploadIcon } from '../../../../assets/icons/upload.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download.svg';
export default function DropdownList(){

    // UseState - issue data
    const [issueTitleHandler,setIssueTitleHandler]=useState("");
    const [issueDescriptionHandler,setIssueDescriptionHandler]=useState("");
    const [issueStoryPointsHandler,setIssueStoryPointsHandler]=useState("");
    const [selectedIssueIndexHandler,setSelectedIssueIndexHandler] =useState(-1);
    // UseState - issue list
    const [issues, setIssues] = useState([{"title" : "Issue1" , "description" : "undefined","storyPoints":"0"},
    {"title" : "Issue2" , "description" : "2","storyPoints":"0"}]);

    // UseState - view data
    const [viewList, setViewList] = useState(true);
    const [viewIssueDetails, setViewIssueDetails] = useState(false);

    //UseState - css data
    const [listView, setListView] = useState('list-enter');
    const [addNewView, setAddNewView] = useState('add-view-exit');
    const [detailsView, setDetailsView] = useState('details-exit');

    // Function onClick
    const SeleceIssue = (props:any)=>{

        // console.log(issues.indexOf(props))
        // console.log(props)
        setSelectedIssueIndexHandler(issues.indexOf(props))
        //Set handlers variable
        setIssueTitleHandler(props.title)
        setIssueDescriptionHandler(props.description)

        //Set view variable
        setViewIssueDetails(true);
    }
    const SaveChanges=()=>{
        const newObj={"title" : issueTitleHandler , "description" : issueDescriptionHandler, "storyPoints" : issueStoryPointsHandler}
        issues[selectedIssueIndexHandler]=newObj;
    }
    const AddNewIssue = ()=>{
        setIssues([...issues,{"title" : issueTitleHandler , "description" : issueDescriptionHandler, "storyPoints" : issueStoryPointsHandler}])
        console.log(issues)
        setViewList(true)
    }

    const GoToAddView = () =>{
        setIssueTitleHandler("")
        setIssueDescriptionHandler("")
        setViewList(false)
    }

    const test=()=>{
        console.log("test")
    }

    /**
     * Function for adding file from Jira
     * @param props 
     */
    const UploadJiraList = (props:any)=>{
        console.log("no implementaion")
        console.log(props.target.file)
    }

    const DownloadJiraList = () =>{
        console.log("no implementaion")
    }
  
    /**
     * Component for items in DropDown compontent
     * @param props 
     * @returns DropdownItem
     */
    function DropdownItem(props: { onClick1: (arg0: any) => void; onClick2?: (arg0: any) => void; leftIcon?: any; rightIcon?:any; children: any; })
    {
        let onlyOneInTheSameTime=false; // if you click "changeHandler2" you block functionality of "changeHandler1"
        function changeHandler1(e:any) {
            if(!onlyOneInTheSameTime){
            props.onClick1(e.target.value);
            }
            onlyOneInTheSameTime=false;
        }
        function changeHandler2(e:any) {
            if(props.onClick2) props.onClick2(e.target.value); // test if onClick2 exist
            onlyOneInTheSameTime=true;
        }

        return(
            <div className="menu-item" onClick={changeHandler1}>
            <div onClick={changeHandler2} className="icon-button-dropdown-item">{props.leftIcon}</div>
            {props.children}
            <div className="icon-right">{props.rightIcon}</div>
          </div>
        );
    }
    /**
     *  Componets for Issue list only
     */

     // Create issue list
    const issueList = issues.map((val)=>{
        return(
            <DropdownItem
            leftIcon={<BoltIcon />}
            rightIcon={"0"}
            key={val.title.toString()} 
            onClick1={()=>{SeleceIssue(val)}}
            onClick2={()=>{test()}}
            >
                <Issue title={val.title} description={val.description} storyPoints={val.storyPoints}/>
            </DropdownItem>
        );
    })

    useEffect(() => {
        if(viewList===false){
            setListView('list-exit')
            setAddNewView('add-view-enter')
            setDetailsView('details-exit')
        }
        if(viewList===true){
            setListView('list-enter')
            setAddNewView('add-view-exit')
            setDetailsView('details-exit')
        }
        if(viewIssueDetails===true && viewList){
            setListView('list-exit')
            setAddNewView('add-view-exit')
            setDetailsView('details-enter')
        }
    }, [viewList, viewIssueDetails])

    return(
        <div className="dropdown">
            <div className={"dropdown-issue-"+listView}>
                <div className="dropdown-issue-list">
                    {issueList}
                </div>
                <div className="dropdown-issue-add">
                        <div className="dropdown-issue-add-button">
                            <Button 
                                name="New Issue"
                                value={0}
                                onClick={() => { GoToAddView(); } } />
                        </div>
                        <div className="dropdown-issue-add-jira">
                        <div className="dropdown-issue-add-jira-col1">
                            <div className="dropdown-issue-add-jira-upload">
                            <input 
                                    id="inputJira"
                                    className="dropdown-issue-add-jira-upload-input" 
                                    type='file' 
                                    onChange={e=>UploadJiraList(e)}/>
                                <label htmlFor="inputJira" className="dropdown-issue-add-jira-upload-label">
                                    <UploadIcon/>
                                </label>
                            </div>
                        </div>
                        <div className="dropdown-issue-add-jira-col2">
                            <div onClick={DownloadJiraList} className="dropdown-issue-add-jira-download">
                                <DownloadIcon/>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
            <div className={"dropdown-issue-"+addNewView}>
            <DropdownItem 
            leftIcon={<ArrowIcon/>}
            onClick1={()=>{setViewList(true); setViewIssueDetails(false) }}
            onClick2={()=>{setViewList(true); setViewIssueDetails(false) }}>
                Back
            </DropdownItem>
                <div className="dropdown-issue-add-view-textfield">
                <TextField
                    placeholder="Issue Name"
                    value={issueTitleHandler}
                    onChange={e=>setIssueTitleHandler(e.target.value)}
                    name="New Issue name"
                />
                <TextField
                    placeholder="Issue Description"
                    value={issueDescriptionHandler}
                    onChange={e=>setIssueDescriptionHandler(e.target.value)}
                    name="New Issue description"
                />
                </div>
                <div className="dropdown-issue-add-view-button">
                <Button 
                    name="Add New Issue"
                    value={0}
                    onClick={() => { AddNewIssue(); } } />
                </div>
            </div>
            <div className={"dropdown-issue-"+detailsView}>
                <DropdownItem 
                leftIcon={<ArrowIcon/>}
                onClick1={()=>{setViewList(true); setViewIssueDetails(false) }}
                onClick2={()=>{setViewList(true); setViewIssueDetails(false) }}>
                    Back
                </DropdownItem>
                <div className="dropdown-issue-details-text">
                <TextField
                    value={issueTitleHandler}
                    onChange={e=>setIssueTitleHandler(e.target.value)} 
                />
                <textarea 
                className="dropdown-issue-textarea-details"
                value={issueDescriptionHandler}
                onChange={e=>setIssueDescriptionHandler(e.target.value)}>
                </textarea>
                </div>
                <div className="dropdown-issue-add-view-button">
                <Button 
                    name="Save changes"
                    value={0}
                    onClick={() => { SaveChanges(); } } />
                </div>
            </div>
        </div>
    );
}