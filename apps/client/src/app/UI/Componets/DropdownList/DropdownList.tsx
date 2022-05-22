import "./DropdownList.scss"
import Issue from '../Issue/Issue';
import React, { useState, useEffect, useCallback, useMemo} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import NavItem from "../NavItem/NavItem";
import Button from "../Button/Button";
import { TextField } from "@mui/material";

import { ReactComponent as ArrowIcon } from '../../../../assets/icons/arrow.svg';
import { ReactComponent as BoltIcon } from '../../../../assets/icons/bolt.svg';
import { ReactComponent as UploadIcon } from '../../../../assets/icons/upload.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/icons/delete.svg';
import { type } from "os";


export default function DropdownList(){

    // UseState - issue data
    const [issueTitleHandler,setIssueTitleHandler]=useState("");
    const [issueDescriptionHandler,setIssueDescriptionHandler]=useState("");
    const [issueStoryPointsHandler,setIssueStoryPointsHandler]=useState("");
    const [selectedIssueIndexHandler,setSelectedIssueIndexHandler] =useState(-1);
        //Seclected Issue color helpers
    const [selectedIssueColorHandler,setSelectedIssueColorHandler]=useState(["",""]);
    const [colorHandler, setColorHandler] = useState(false);
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
    //UseState - import/export
   // const [importFile , setImporter] = useState<object>(null);
   // const [exportFile, setExporter] = useState(null);
   const [csvArray, setCsvArray] = useState<any>([]);
    // Function onClick
    const SelectedIssue = (props:any)=>{

        // console.log(issues.indexOf(props))
        // console.log(props)
        setSelectedIssueIndexHandler(issues.indexOf(props))
        //Set handlers variable
        setIssueTitleHandler(props.title)
        setIssueDescriptionHandler(props.description)
        setIssueStoryPointsHandler(props.storyPoints)

        //Set view variable
        setViewIssueDetails(true);
    }
    const SaveChanges=()=>{
        const newObj={"title" : issueTitleHandler , "description" : issueDescriptionHandler, "storyPoints" : issueStoryPointsHandler};
        // console.log(newObj);
        issues[selectedIssueIndexHandler]=newObj;
        setViewList(true); 
        setViewIssueDetails(false)
    }
    const AddNewIssue = ()=>{
        setIssues([...issues,{"title" : issueTitleHandler , "description" : issueDescriptionHandler, "storyPoints" : "0"}])
        setViewList(true)
    }

    const DeleteThisIssue =(e:any) => {
        console.log(e.title);
        const name = e.title;
        setIssues(issues.filter(item => item.title !== name));

    }

    const GoToAddView = () =>{
        setIssueTitleHandler("")
        setIssueDescriptionHandler("")
        setViewList(false)
    }
    /**
     * Change color of selected issue and set name 
     * @param e Issue Object
     */
    const SetVotingNameToThisIssue=(e:any)=>{
        // console.log(issues.indexOf(e));
        if(!colorHandler){
            const index=issues.indexOf(e);
            const issueColorArray = [];
            for(let i = 0; i < issues.length; i++) {
                issueColorArray.push("");
            }
            issueColorArray[index]="#1976D2";
            setSelectedIssueColorHandler(issueColorArray);
            setColorHandler(true);
        }else{
            const issueColorArray = [];
            for(let i = 0; i < issues.length; i++) {
                issueColorArray.push("");
            }
            setSelectedIssueColorHandler(issueColorArray);
            setColorHandler(false);
        }
    }

    /**
     * Function for adding file from Jira
     * @param props 
     */
    const UploadJiraList = (props:any )=>{
    if(props!=null){
        //setImporter(props.target.files[0]);
        const reader = new FileReader();
        reader.onload = function(event) {
    // The file's text will be printed here
    if(event.target!=null){
    if(event.target.result!=null){
    const rawcsv=event.target.result.toString();
    const csvsplits = rawcsv.split("\n");
    const csvheader= csvsplits[0].split(",");
    let sum=-1;
    let desc=-1;
    let spts=-1;
    for(let i=0;i<csvheader.length;i++){
        if(csvheader[i]=="Podsumowanie" || csvheader[i]=="title" ){
            sum=i;
        }
        else if (csvheader[i]=="Pole niestandardowe (Story point estimate)" || csvheader[i]=="storyPoints" ){
            spts=i;
        }
        else if (csvheader[i]=="Opis" || csvheader[i]=="description" ){
            desc=i;
        }
    }
    
    const importedissues=issues;
    for (let i=1;i<csvsplits.length;i++)
    {
        console.log(csvsplits[i])
        const linesplit= csvsplits[i].split(",");
        let temptitle= "";
        let tempdescription= "";
        let tempstoryPoints= "0";
        if(sum>=0){
            temptitle=linesplit[sum];
        }
        if(desc>=0){
            tempdescription=linesplit[desc];
        }
        if(spts>=0){
            if(linesplit[spts]!=""){
                tempstoryPoints=linesplit[spts];
            }

        }
        const newObj={"title" : temptitle , "description" : tempdescription, "storyPoints" : tempstoryPoints};
        importedissues.push(newObj);
        console.log(newObj);
        console.log(issues);
        setCsvArray(importedissues);
        setIssues(importedissues)
        console.log(issues);
    //console.log(csvArray);
    }

    }
}
  };

  reader.readAsText(props.target.files[0]);
    }
    else{console.log("null import");}
    }

    const DownloadJiraList = () =>{
        console.log("no implementaion")
    }
  
    /**
     * Component for items in DropDown compontent
     * @param props 
     * @returns DropdownItem
     */
    function DropdownItem(props: { onClick1: (arg0: any) => void; onClick2?: (arg0: any) => void;onClick3?: (arg0: any) => void; leftIcon?: any; leftIconColorOnClick?:any; rightIcon?:any; rightRightIcon?:any; children: any; })
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
        function changeHandler3(e:any){
            if(props.onClick3) props.onClick3(e.target.value); // test if onClick3 exist
            onlyOneInTheSameTime=true;
        }

        return(
            <div className="menu-item" onClick={changeHandler1}>
            {props.rightIcon && <div style={{background: props.leftIconColorOnClick}} onClick={changeHandler2} className="icon-button-dropdown-item">{props.leftIcon}</div>}

            {!props.rightIcon &&<div onClick={changeHandler2} className="icon-button-dropdown-item">{props.leftIcon}</div>}
            {props.children}
            {props.rightIcon && <div className="icon-right">{props.rightIcon}</div>}
            {props.onClick3 && <div onClick={changeHandler3} className="icon-right-2">{props.rightRightIcon}</div>}
          </div>
        );
    }

    /**
     * Created issue list
     */
    const issueList = issues.map((val)=>{
        return(
            <DropdownItem
            leftIcon={<BoltIcon />}
            leftIconColorOnClick={selectedIssueColorHandler[issues.indexOf(val)]}
            rightIcon={val.storyPoints}
            key={val.title.toString()} 
            onClick1={()=>{SelectedIssue(val)}}
            onClick2={()=>{SetVotingNameToThisIssue(val)}}
            onClick3={()=>{DeleteThisIssue(val)}}
            rightRightIcon={<DeleteIcon/>}
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
            {/* LIST VIEW */}
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
            {/* ADD VIEW */}
            <div className={"dropdown-issue-"+addNewView}>
            <DropdownItem 
            leftIcon={<ArrowIcon/>}
            onClick1={()=>{setViewList(true); setViewIssueDetails(false) }}
            onClick2={()=>{setViewList(true); setViewIssueDetails(false) }}>
                Back
            </DropdownItem>
                <div className="dropdown-issue-add-view-row1">
                    <div>
                    <TextField
                        placeholder="Issue Name"
                        value={issueTitleHandler}
                        onChange={e=>setIssueTitleHandler(e.target.value)}
                        name="New Issue name"
                    />
                    </div>
                </div>
                <div className="dropdown-issue-add-view-row2">
                    <div>
                        <textarea
                        placeholder="Issue Description..."
                        className="dropdown-issue-details-textarea"
                        value={issueDescriptionHandler}
                        onChange={e=>setIssueDescriptionHandler(e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <div className="dropdown-issue-button">
                <Button 
                    name="Add New Issue"
                    value={0}
                    onClick={() => { AddNewIssue(); } } />
                </div>
            </div>
            {/* Details View */}
            <div className={"dropdown-issue-"+detailsView}>
                <DropdownItem 
                leftIcon={<ArrowIcon/>}
                onClick1={()=>{setViewList(true); setViewIssueDetails(false) }}
                onClick2={()=>{setViewList(true); setViewIssueDetails(false) }}>
                    Back
                </DropdownItem>
                <div className="dropdown-issue-details-row1">
                    <div className="dropdown-issue-details-text">
                        <TextField
                            value={issueTitleHandler}
                            onChange={e=>setIssueTitleHandler(e.target.value)} 
                        />
                        
                    </div>
                    <div className="dropdown-issue-details-storypoints">
                            <TextField
                                value={issueStoryPointsHandler}
                                onChange={e=>setIssueStoryPointsHandler(e.target.value)}
                            />
                    </div>
                </div>
                <div className="dropdown-issue-details-row2">
                    <textarea 
                        className="dropdown-issue-details-textarea"
                        value={issueDescriptionHandler}
                        onChange={e=>setIssueDescriptionHandler(e.target.value)}>
                    </textarea>
                </div>
                <div className="dropdown-issue-details-row3">
                    <div className="dropdown-issue-button">
                        <Button 
                            name="Save changes"
                            value={0}
                            onClick={() => { SaveChanges(); } } />
                    </div>
                </div>
            </div>
        </div>
    );
}