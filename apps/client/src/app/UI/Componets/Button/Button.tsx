import React from "react";
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
import "./Button.scss";

export interface ButtonProps {
  name?:string;
  value?: number;
  onClick: (st: string) => void;
}

function getSessionStorageOrDefault(key: string, defaultValue: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return stored;
}

export default function Button(props: ButtonProps) {
  const { state, setState } = useGlobalState();
  // const [mystate, setMyState] = useState(state.cardPicked == props.value? 'clicked': 'notclicked');

  const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
    setState((prevSt) => ({...prevSt, ...data}));
  }

  // const changeState = () => {
  //   if(mystate === 'clicked'){
  //     changeGlobalState({cardPicked: undefined});
  //     sessionStorage.setItem('cardPicked', '');
  //   }
  //   else{
  //     changeGlobalState({cardPicked: props.value});
  //     sessionStorage.setItem('cardPicked', props.value.toString());
  //   }
  // }

  // useEffect(() => {
  //   if(state.gameEnded == true){
  //     setMyState('blocked');
  //   }
  //   else{
  //     if(state.cardPicked == props.value){
  //       setMyState('clicked');
  //     }
  //     else{
  //       setMyState('notclicked');
  //     }
  //   }
  // },[state.cardPicked])
  function changeHandler(e:any) {
    props.onClick(e.target.value);
}
  return (
    <div id="btn" className="Button-container" onClick={changeHandler}>
          <div className="Button-subcontainer">
          <p className="Button-text">{props.name}</p>
        </div>
    </div>
  );
}