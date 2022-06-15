import { useEffect, useState } from "react";
import { GlobalStateInterface, useGlobalState } from "../../../GlobalStateProvider";
import "./Card.scss";
import { useGameHook } from '../../Pages/GamePage/useGameHook';
export interface CardProps {
  value: number;
  onClick?: (st: string) => void;
}

function getSessionStorageOrDefault(key: string, defaultValue: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return stored;
}

export default function Card(props: CardProps) {
  const game = useGameHook();
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
    if(game.data.finished == true){
      setMyState('blocked');
      //changeGlobalState({cardPicked: undefined});
      //sessionStorage.setItem('cardPicked', '');
    }
    else{
      if(state.cardPicked == props.value){
        setMyState('clicked');
      }
      else{
        setMyState('notclicked');
      }
    }
  },[state.cardPicked,game.data.finished])

  return (
    <div className={"Card-container-"+mystate} onClick={() => {changeState()}}>
      <div className="Card-subcontainer">
        <p className={"Card-value-"+mystate}>{props.value}</p>
      </div>
    </div>
  );
}
