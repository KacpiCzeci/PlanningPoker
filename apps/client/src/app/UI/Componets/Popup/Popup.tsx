import React from "react";
import Button from "../Button/Button";
import './Popup.scss';

function Popup(props: {
    trigger:any;
    setTrigger:any;
    children?: any;
  }){
    return(props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="close-btn">
                    <Button name="Close" onClick={()=>props.setTrigger(false)}></Button>
                </div>
                {props.children}
            </div>
        </div>
    ):(<div></div>);
}

export default Popup