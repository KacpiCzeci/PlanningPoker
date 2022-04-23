import GamePage from './UI/Pages/GamePage/GamePage';
import { GlobalStateProvider, useGlobalState } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';
import LoadingPage from './UI/Pages/LoadingPage/LoadingPage';

export function App() {
  return (
    <GlobalStateProvider>
      <AppInner />
    </GlobalStateProvider>
  );
}

const AppInner = () => {
  const g = useGlobalState();

  return g.state.userName === undefined ? <LoginPage /> : <GamePage />;
};

export default App;
