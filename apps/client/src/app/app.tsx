import { GlobalStateProvider, useGlobalState } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage1/LoginPage';
import { useState } from 'react';
import NotFoundPage from './UI/Pages/NotFoundPage/NotFoundPage';
import CreateGamePage from './UI/Pages/CreateGamePage/CreteGamePage';
import CheckPage from './UI/Pages/CheckPage/CheckPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from './UI/Pages/GamePage/GamePage';
import ReqAuthRoute from './UI/Pages/ReqAuthPage/ReqAuthPage';

export function App() {
  return (
    <GlobalStateProvider>
      {/* <AppInner /> */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<CreateGamePage/>}/> */}
          <Route path="/" element={<GamePage/>}/>
          <Route path="/:id" element={<CheckPage/>}/>
          <Route path="/new" element={<ReqAuthRoute element={<CreateGamePage/>}/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/:id" element={<ReqAuthRoute element={<CheckPage/>}/>}/>
          <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
