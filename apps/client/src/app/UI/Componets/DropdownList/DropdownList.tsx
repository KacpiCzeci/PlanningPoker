import './DropdownList.scss';
import Issue from '../Issue/Issue';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import NavItem from "../NavItem/NavItem";
import Button from '../Button/Button';
import { TextField } from '@mui/material';

import { ReactComponent as ArrowIcon } from '../../../../assets/icons/arrow.svg';
import { ReactComponent as BoltIcon } from '../../../../assets/icons/bolt.svg';
import { ReactComponent as UploadIcon } from '../../../../assets/icons/upload.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/icons/delete.svg';
import { type } from 'os';
import {
  GlobalStateInterface,
  useGlobalState,
} from '../../../GlobalStateProvider';
import { Issue as IssueType } from '@planning-poker/shared/interfaces';

const getIssueId = () => new Date().toString()+Math.random()

export type IssuesListItem = {
  active?: boolean;
  id: string;
  title: string;
  description: string;
  storyPoints: string;
};

export type DropdownListProps = {
  issues: IssuesListItem[];
  onAdd: (item: IssuesListItem) => void;
  onRemove?: (item: IssuesListItem) => void;
  onSelectActive: (item: IssuesListItem) => void;
};

export default function DropdownList({ issues, ...props }: DropdownListProps) {
  //global store
  const { state: globalStore, setState: setGlobalStore } = useGlobalState();
  const changeGlobalState = useCallback(
    (data: Partial<GlobalStateInterface>) => {
      setGlobalStore((prevSt) => ({ ...prevSt, ...data }));
    },
    [setGlobalStore]
  );

  //session storage
  function getSessionStorageOrDefault(key: string, defaultValue: any) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      return JSON.parse(defaultValue);
    }
    return JSON.parse(stored);
  }

  // UseState - issue data handlers
  const [issueTitleHandler, setIssueTitleHandler] = useState('');
  const [issueDescriptionHandler, setIssueDescriptionHandler] = useState('');
  const [issueStoryPointsHandler, setIssueStoryPointsHandler] = useState('');
  const [selectedIssueIndexHandler, setSelectedIssueIndexHandler] =
    useState(-1);
  const [colorHandler, setColorHandler] = useState(false);
  const [colorHandlerDeleteOperation, setColorHandlerDeleteOperation] =
    useState(false);
  const [globalStoreHandlerSaveOperation, setGlobalStoreHandlerSaveOperation] =
    useState(false);

  //UseState - store
  //---issue list
  const [issuesSessionStorage, setIssuesSessionStorage] =
    useState<IssuesListItem[]>(issues);
  //---Seclected Issue color helpers
  const [
    selectedIssueColorHandlerSessionStorage,
    setSelectedIssueColorHandlerSessionStorage,
  ] = useState(getSessionStorageOrDefault('selectedIssue', '[]'));

  // UseState - view data
  const [viewList, setViewList] = useState(true);
  const [viewIssueDetails, setViewIssueDetails] = useState(false);

  //UseState - css data
  const [listView, setListView] = useState('list-enter');
  const [addNewView, setAddNewView] = useState('add-view-exit');
  const [detailsView, setDetailsView] = useState('details-exit');

  const GoToAddView = () => {
    setIssueTitleHandler('');
    setIssueDescriptionHandler('');
    setViewList(false);
  };

  /**
   * Function for adding file from Jira
   * @param props
   */
  const UploadJiraList = (props: any) => {
    console.log(props);
    if (props != null) {
      //setImporter(props.target.files[0]);
      const reader = new FileReader();
      reader.onload = function (event) {
        // The file's text will be printed here
        if (event.target != null) {
          if (event.target.result != null) {
            const rawcsv = event.target.result.toString();
            const csvsplits = rawcsv.split('\n');
            const csvheader = csvsplits[0].split(',');
            let sum = -1;
            let desc = -1;
            let spts = -1;
            for (let i = 0; i < csvheader.length; i++) {
              if (csvheader[i] == 'Podsumowanie' || csvheader[i] == 'title') {
                sum = i;
              } else if (
                csvheader[i] == 'Pole niestandardowe (Story point estimate)' ||
                csvheader[i] == 'storyPoints'
              ) {
                spts = i;
              } else if (
                csvheader[i] == 'Opis' ||
                csvheader[i] == 'description'
              ) {
                desc = i;
              }
            }
            for (let i = 1; i < csvsplits.length; i++) {
              console.log(i);
              // console.log(csvsplits[i])
              const linesplit = csvsplits[i].split(',');
              let temptitle = '';
              let tempdescription = '';
              let tempstoryPoints = '0';
              if (sum >= 0) {
                temptitle = linesplit[sum];
              }
              if (desc >= 0) {
                tempdescription = linesplit[desc];
              }
              if (spts >= 0) {
                if (linesplit[spts] !== '') {
                  tempstoryPoints = linesplit[spts];
                }
              }
              const newObj = {
                title: temptitle,
                description: tempdescription,
                storyPoints: tempstoryPoints,
                id: getIssueId()
              };
              issuesSessionStorage.push(newObj);
            }
            setIssuesSessionStorage([...issuesSessionStorage]);
          }
        }
      };
      reader.readAsText(props.target.files[0]);
    } else {
      console.log('null import');
    }
  };

  /**
   * Download list of issue in csv
   */
  const DownloadJiraList = () => {
    const csvString = [
      ['title', 'description', 'storyPoints'],
      ...issuesSessionStorage.map(
        (item: { title: any; description: any; storyPoints: any }) => [
          item.title,
          item.description,
          item.storyPoints,
        ]
      ),
    ]
      .map((e) => e.join(','))
      .join('\n');
    // console.log(csvString);
    const blob = new Blob([csvString]);
    const fileName = `exportedissues.csv`;
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Component for items in DropDown compontent
   * @param props
   * @returns DropdownItem
   */
  function DropdownItem(props: {
    onClick1?: (arg0: any) => void;
    onClick2?: (arg0: any) => void;
    onClick3?: (arg0: any) => void;
    leftIcon?: any;
    leftIconColorOnClick?: any;
    rightIcon?: any;
    rightRightIcon?: any;
    children?: any;
  }) {
    let onlyOneInTheSameTime = false; // if you click "changeHandler2" you block functionality of "changeHandler1"
    function changeHandler1(e: any) {
      if (!onlyOneInTheSameTime) {
        if (props.onClick1) props.onClick1(e.target.value);
      }
      onlyOneInTheSameTime = false;
    }
    function changeHandler2(e: any) {
      if (props.onClick2) props.onClick2(e.target.value); // test if onClick2 exist
      onlyOneInTheSameTime = true;
    }
    function changeHandler3(e: any) {
      if (props.onClick3) props.onClick3(e.target.value); // test if onClick3 exist
      onlyOneInTheSameTime = true;
    }

    return (
      <div className="menu-item" onClick={changeHandler1}>
        {props.rightIcon && (
          <div
            style={{ background: props.leftIconColorOnClick }}
            onClick={changeHandler2}
            className="icon-button-dropdown-item"
          >
            {props.leftIcon}
          </div>
        )}

        {!props.rightIcon && (
          <div onClick={changeHandler2} className="icon-button-dropdown-item">
            {props.leftIcon}
          </div>
        )}
        {props.children}
        {props.rightIcon && <div className="icon-right">{props.rightIcon}</div>}
        {props.onClick3 && (
          <div onClick={changeHandler3} className="icon-right-2">
            {props.rightRightIcon}
          </div>
        )}
      </div>
    );
  }

  /**
   * Created issue list
   */
  const issueList = issuesSessionStorage.map((val, index: any) => {
    // console.log("---- issueList: "+issuesTEST);
    return (
      <DropdownItem
        leftIcon={<BoltIcon />}
        // Local
        // leftIconColorOnClick={selectedIssueColorHandler[issues.indexOf(val)]}
        leftIconColorOnClick={selectedIssueColorHandlerSessionStorage[index]}
        rightIcon={val.storyPoints}
        key={index}
        onClick1={() => {
          ShowDetailsOfSelectedIssue(val);
        }}
        onClick2={() => {
          SetVotingNameToThisIssue(val);
        }}
        onClick3={() => {
          DeleteThisIssue(index);
        }}
        rightRightIcon={<DeleteIcon />}
      >
        <Issue
          title={val.title}
          description={val.description}
          storyPoints={val.storyPoints}
        />
      </DropdownItem>
    );
  });

  /**
   * Add new issue to list
   */
  const AddNewIssue = () => {
    props.onAdd({
      description: issueDescriptionHandler,
      storyPoints: '0',
      title: issueTitleHandler,
      active: false,
      id: getIssueId()
    });
    // Adding to store
    setIssuesSessionStorage([
      ...issuesSessionStorage,
      {
        title: issueTitleHandler,
        description: issueDescriptionHandler,
        storyPoints: '0',
        id: getIssueId()
      },
    ]);
    setSelectedIssueColorHandlerSessionStorage([
      ...selectedIssueColorHandlerSessionStorage,
      '',
    ]);

    // console.log("Adding to store")
    // console.log("----Adding to store: issuesTEST")
    console.log(issuesSessionStorage);
    // console.log("----Adding to store: selectedIssueColorHandlerTEST")
    console.log(selectedIssueColorHandlerSessionStorage);
    //--Change view
    setViewList(true);
  };
  /**
   * Delete issue from list
   * @param i index
   */
  const DeleteThisIssue = (i: number) => {
    setIssuesSessionStorage([
      ...issuesSessionStorage.slice(0, i),
      ...issuesSessionStorage.slice(i + 1, issuesSessionStorage.length),
    ]);
    setSelectedIssueColorHandlerSessionStorage([
      ...selectedIssueColorHandlerSessionStorage.slice(0, i),
      ...selectedIssueColorHandlerSessionStorage.slice(
        i + 1,
        selectedIssueColorHandlerSessionStorage.length
      ),
    ]);
    if (selectedIssueColorHandlerSessionStorage.indexOf('#1976D2') === i) {
      console.log('--1----KOLOR USUNIETY');
      setColorHandlerDeleteOperation(true);
    }
  };
  /**
   * Showing details of selected issue from list
   * @param props Issue Object
   */
  const ShowDetailsOfSelectedIssue = (props: any) => {
    // console.log(issues.indexOf(props))
    // console.log(props)
    setSelectedIssueIndexHandler(issuesSessionStorage.indexOf(props));
    //Set handlers variable
    setIssueTitleHandler(props.title);
    setIssueDescriptionHandler(props.description);
    setIssueStoryPointsHandler(props.storyPoints);

    //Set view variable
    setViewIssueDetails(true);
  };
  /**
   * Save changes in selecetd issue
   */
  const SaveChanges = () => {
    const newObj = {
      title: issueTitleHandler,
      description: issueDescriptionHandler,
      storyPoints: issueStoryPointsHandler,
      id: getIssueId()
    };
    // console.log(newObj);
    issuesSessionStorage[selectedIssueIndexHandler] = newObj;
    setViewList(true);
    setViewIssueDetails(false);
    if (
      selectedIssueIndexHandler ===
      selectedIssueColorHandlerSessionStorage.indexOf('#1976D2')
    ) {
      setGlobalStoreHandlerSaveOperation(true);
    } else {
      setGlobalStoreHandlerSaveOperation(false);
    }
  };

  /**
   * Change color of selected issue and set a textfield in GamePage-issuename
   * @param e Issue Object
   */
  const SetVotingNameToThisIssue = (e: IssuesListItem) => {
    if (!colorHandler) {
      props.onSelectActive(e);
      const index = issuesSessionStorage.indexOf(e);
      const issueColorArray = [];
      for (let i = 0; i < issuesSessionStorage.length; i++) {
        issueColorArray.push('');
      }
      issueColorArray[index] = '#1976D2';
      setSelectedIssueColorHandlerSessionStorage(issueColorArray);
      setColorHandler(!colorHandler);
    }
    // if(colorHandler){
    //     console.log("---err---colorHandler: "+ colorHandler);
    //     const issueColorArray = [];
    //     for(let i = 0; i < issuesSessionStorage.length; i++) {
    //         issueColorArray.push("");
    //     }
    //     setSelectedIssueColorHandlerSessionStorage(issueColorArray);
    //     setColorHandler(false);
    // }
  };

  useEffect(() => {
    //Selected issue set it title
    if (colorHandler) {
      const index = selectedIssueColorHandlerSessionStorage.indexOf('#1976D2');
      changeGlobalState({ selectedIssue: issuesSessionStorage[index].title });
    }
    //Deleted selected issue set default name
    if (colorHandlerDeleteOperation) {
      changeGlobalState({ selectedIssue: 'Issue name' });
    }
    //Saved changes of selected issue set in selectedIssue
    if (globalStoreHandlerSaveOperation) {
      const index = selectedIssueColorHandlerSessionStorage.indexOf('#1976D2');
      changeGlobalState({ selectedIssue: issuesSessionStorage[index].title });
    }
    if (viewList === false) {
      setListView('list-exit');
      setAddNewView('add-view-enter');
      setDetailsView('details-exit');
    }
    if (viewList === true) {
      setListView('list-enter');
      setAddNewView('add-view-exit');
      setDetailsView('details-exit');
    }
    if (viewIssueDetails === true && viewList) {
      setListView('list-exit');
      setAddNewView('add-view-exit');
      setDetailsView('details-enter');
    }
    sessionStorage.setItem('listOfIssue', JSON.stringify(issuesSessionStorage));
    sessionStorage.setItem(
      'selectedIssue',
      JSON.stringify(selectedIssueColorHandlerSessionStorage)
    );
  }, [
    viewList,
    viewIssueDetails,
    issuesSessionStorage,
    selectedIssueColorHandlerSessionStorage,
    colorHandler,
    changeGlobalState,
    colorHandlerDeleteOperation,
    globalStoreHandlerSaveOperation,
    selectedIssueIndexHandler,
  ]);

  return (
    <div className="dropdown">
      {/* LIST VIEW */}
      <div className={'dropdown-issue-' + listView}>
        <div className="dropdown-issue-list">
          {/* {issueListTEST()} */}
          {issueList}
        </div>
        <div className="dropdown-issue-add">
          <div className="dropdown-issue-add-button">
            <Button
              name="New Issue"
              value={0}
              onClick={() => {
                GoToAddView();
              }}
            />
          </div>
          <div className="dropdown-issue-add-jira">
            <div className="dropdown-issue-add-jira-col1">
              <div className="dropdown-issue-add-jira-upload">
                <input
                  id="inputJira"
                  className="dropdown-issue-add-jira-upload-input"
                  type="file"
                  onChange={(e) => {
                    UploadJiraList(e);
                    console.log('TEST upload');
                  }}
                  onClick={(e) => ((e.target as HTMLInputElement).value = '')}
                />

                <label
                  htmlFor="inputJira"
                  className="dropdown-issue-add-jira-upload-label"
                >
                  <UploadIcon />
                </label>
              </div>
            </div>
            <div className="dropdown-issue-add-jira-col2">
              <div
                onClick={DownloadJiraList}
                className="dropdown-issue-add-jira-download"
              >
                <DownloadIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ADD VIEW */}
      <div className={'dropdown-issue-' + addNewView}>
        <DropdownItem
          leftIcon={<ArrowIcon />}
          onClick1={() => {
            setViewList(true);
            setViewIssueDetails(false);
          }}
          onClick2={() => {
            setViewList(true);
            setViewIssueDetails(false);
          }}
        >
          Back
        </DropdownItem>
        <div className="dropdown-issue-add-view-row1">
          <div>
            <TextField
              placeholder="Issue Name"
              value={issueTitleHandler}
              onChange={(e) => setIssueTitleHandler(e.target.value)}
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
              onChange={(e) => setIssueDescriptionHandler(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="dropdown-issue-button">
          <Button
            name="Add New Issue"
            value={0}
            onClick={() => {
              AddNewIssue();
            }}
          />
        </div>
      </div>
      {/* Details View */}
      <div className={'dropdown-issue-' + detailsView}>
        <DropdownItem
          leftIcon={<ArrowIcon />}
          onClick1={() => {
            setViewList(true);
            setViewIssueDetails(false);
          }}
          onClick2={() => {
            setViewList(true);
            setViewIssueDetails(false);
          }}
        >
          Back
        </DropdownItem>
        <div className="dropdown-issue-details-row1">
          <div className="dropdown-issue-details-text">
            <TextField
              value={issueTitleHandler}
              onChange={(e) => setIssueTitleHandler(e.target.value)}
            />
          </div>
          <div className="dropdown-issue-details-storypoints">
            <TextField
              value={issueStoryPointsHandler}
              onChange={(e) => setIssueStoryPointsHandler(e.target.value)}
            />
          </div>
        </div>
        <div className="dropdown-issue-details-row2">
          <textarea
            className="dropdown-issue-details-textarea"
            value={issueDescriptionHandler}
            onChange={(e) => setIssueDescriptionHandler(e.target.value)}
          ></textarea>
        </div>
        <div className="dropdown-issue-details-row3">
          <div className="dropdown-issue-button">
            <Button
              name="Save changes"
              value={0}
              onClick={() => {
                SaveChanges();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
