import { useAuth } from '@planning-poker/react/api-hooks';
import React, { useEffect, useState } from 'react';
import Button from '../../Componets/Button/Button';
import './MainPage.scss';
import {
  useParams,
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from 'react-router-dom';
import TextField from '../../Componets/TextField/TextField';
import { Query } from 'react-query';
import { async } from 'rxjs';

export default function MainPage() {
  const { logout, profile } = useAuth();
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  return (
    <div className="MainPage-container">
      <div className="MainPage-header">
        <img
          className="MainPage-image-img"
          src="../../../../assets/poker.png"
          alt="Logo.png"
        />
        <h1 className="MainPage-h1">Planning Poker</h1>
        <div className="MainPage-navv">
          <h1 className="CreateGamePage-label" style={{ alignSelf: 'center' }}>
            Hello {profile?.data?.username}!
          </h1>
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
      <div className="MainPage-urlcontainer">
        <TextField
          value={url}
          onChange={setUrl}
          placeholder={'url'}
          type={'text'}
          style={{width:'500px'}}
        />
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
      <div className="MainPage-label">
        <p className="MainPage-p">Your rooms:</p>
        {[...(profile?.data?.roomsCreated ?? [])]
          .filter((x) => x !== 'undefined')
          .map((id) => (
            <Button
              name={id}
              value={0}
              onClick={() => {
                navigate('/' + id);
              }}
            />
          ))}
      </div>
      <div className="MainPage-label">
        <p className="MainPage-p">Rooms you have take part in:</p>
        {[...(profile?.data?.rooms ?? [])]
          .filter((x) => x !== 'undefined')
          .map((id) => (
            <Button
              name={id}
              value={0}
              onClick={() => {
                navigate('/' + id);
              }}
            />
          ))}
      </div>
    </div>
  );
}
