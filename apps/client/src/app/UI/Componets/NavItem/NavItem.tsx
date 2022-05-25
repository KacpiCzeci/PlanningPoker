import "./NavItem.scss"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Button from "../Button/Button";

export default function NavItem(props:any){
    const [open,setOpen] = useState(false);

    return(
        <li key={Math.random()} className="nav-item">
            <Button name={props.icon} value={0} onClick={()=>setOpen(!open)}/>
            {/* Show dropdown list */}
            {open && props.children}
        </li>
    );
}