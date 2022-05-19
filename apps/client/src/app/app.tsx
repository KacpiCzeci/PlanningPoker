import GamePage from './UI/Pages/GamePage/GamePage';
import { GlobalStateProvider, useGlobalState } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';
import LoadingPage from './UI/Pages/LoadingPage/LoadingPage';
import NotFoundPage from './UI/Pages/NotFoundPage/NotFoundPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function App() {
  return (
    <GlobalStateProvider>
      {/* <AppInner /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/:id" element={<GamePage/>}/>
          <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

const AppInner = () => {
  const g = useGlobalState();

  return g.state.userName === undefined ? <LoginPage /> : <GamePage />;
};

export default App;
