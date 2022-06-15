import { useAuth } from "@planning-poker/react/api-hooks";
import React, { useEffect, useState } from "react";
import Button from "../../Componets/Button/Button";
import "./MainPage.scss";
import { useParams, useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import TextField from "../../Componets/TextField/TextField";
import { Query } from "react-query";

export default function MainPage() {
    const { logout, profile } = useAuth();
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    return(
        <div className="MainPage-container">
            <div className="MainPage-header">
                <img
                    className="MainPage-image-img"
                    src="../../../../assets/poker.png"
                    alt="Logo.png"
                />
                <h1 className="MainPage-h1">Planning Poker</h1>
                <div className="MainPage-navv">
                    <Button
                        name="New Game"
                        value={0}
                        onClick={() => {
                            navigate('/new');
                        }}
                    />
                    <Button
                        name="Log out"
                        value={0}
                        onClick={async () => {
                            logout();
                        }}
                    />
                </div>
            </div>
            <div>
                <TextField 
                    value={url}
                    onChange={setUrl}
                    placeholder={'url'}
                    type={'text'}/>
                <Button 
                    name="Go to the room!"
                    value={0}
                    onClick={async () => {
                        // console.log(url)
                        // const useQuery = new URLSearchParams(url);
                        // console.log(useQuery)
                        // if(useQuery.get('id')){
                        //     navigate(useQuery.get('id') || "");
                        // }
                        // console.log(useQuery.get('id'))
                        window.location.href = url;
                    }}
                />
            </div>
        </div>
    )
}