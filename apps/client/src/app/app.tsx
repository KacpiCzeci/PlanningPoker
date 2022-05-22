import { GlobalStateProvider, useGlobalState } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';
import NotFoundPage from './UI/Pages/NotFoundPage/NotFoundPage';
import CreateGamePage from './UI/Pages/CreateGamePage/CreteGamePage';
import CheckPage from './UI/Pages/CheckPage/CheckPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function App() {
  return (
    <GlobalStateProvider>
      {/* <AppInner /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateGamePage/>}/>
          <Route path="/:id" element={<CheckPage/>}/>
          <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
