import { useEffect, useState } from "react";
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
import "./Card.scss";

export interface CardProps {
  value: number;
  onClick: (st: string) => void;
}

function getSessionStorageOrDefault(key: string, defaultValue: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return stored;
}

export default function Card(props: CardProps) {
  const { state, setState } = useGlobalState();
  const [mystate, setMyState] = useState(state.cardPicked == props.value? 'clicked': 'notclicked');

  const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
    setState((prevSt) => ({...prevSt, ...data}));
  }

  const changeState = () => {
    if(mystate === 'clicked'){
      changeGlobalState({cardPicked: undefined});
      sessionStorage.setItem('cardPicked', '');
    }
    else{
      changeGlobalState({cardPicked: props.value});
      sessionStorage.setItem('cardPicked', props.value.toString());
    }
  }

  useEffect(() => {
    if(state.gameEnded == true){
      setMyState('blocked');
    }
    else{
      if(state.cardPicked == props.value){
        setMyState('clicked');
      }
      else{
        setMyState('notclicked');
      }
    }
  },[state.cardPicked,state.gameEnded])

  return (
    <div className={"Card-container-"+mystate} onClick={() => {changeState()}}>
      <div className="Card-subcontainer">
        <p className={"Card-value-"+mystate}>{props.value}</p>
      </div>
    </div>
  );
}
