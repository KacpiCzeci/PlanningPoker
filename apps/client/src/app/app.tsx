import GamePage from './UI/Pages/GamePage/GamePage';
import { GlobalStateProvider } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';
import LoadingPage from './UI/Pages/LoadingPage/LoadingPage';


export function App() {
  const [loading, setLoading] = useState(false);
  const [inGame, seTnGame] = useState(sessionStorage.getItem('userName') != undefined);

  const page = (loading)? <LoadingPage/>: (inGame)? <GamePage/>  : <LoginPage/>;
  return (
    <GlobalStateProvider>
      {page}
    </GlobalStateProvider>
  );
}

export default App;
