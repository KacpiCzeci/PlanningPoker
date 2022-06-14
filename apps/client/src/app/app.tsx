import { GlobalStateProvider, useGlobalState } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';
import NotFoundPage from './UI/Pages/NotFoundPage/NotFoundPage';
import CreateGamePage from './UI/Pages/CreateGamePage/CreteGamePage';
import CheckPage from './UI/Pages/CheckPage/CheckPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePage from './UI/Pages/GamePage/GamePage';
import ReqAuthRoute from './UI/Pages/ReqAuthPage/ReqAuthPage';
import RegisterPage from './UI/Pages/RegisterPage/RegisterPage';
import { AuthProvider, GameProvider } from '@planning-poker/react/api-hooks';

export function App() {
  const authToken = sessionStorage.getItem('authToken');
  return (
    <AuthProvider authToken={authToken || undefined}>
      <GlobalStateProvider>
        {/* <AppInner /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/:id" element={<CheckPage />} />
            <Route
              path="/new"
              element={<ReqAuthRoute element={<CreateGamePage />} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/:id"
              element={
                <GameProvider>
                  <ReqAuthRoute element={<CheckPage />} />
                </GameProvider>
              }
            />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalStateProvider>
    </AuthProvider>
  );
}

export default App;
