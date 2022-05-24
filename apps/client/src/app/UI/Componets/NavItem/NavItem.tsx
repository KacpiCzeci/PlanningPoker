import "./NavItem.scss"
import React, { useState, useEffect, useCallback, useMemo } from 'react';

export default function NavItem(props:any){
    const [open,setOpen] = useState(false);

    return(
        <li key={Math.random()} className="nav-item">
            <button className="icon-button" onClick={()=>setOpen(!open)}>
                {props.icon}
            </button>
            {/* Show dropdown list */}
            {open && props.children}
        </li>
    );
}