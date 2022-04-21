import GamePage from './UI/Pages/GamePage/GamePage';
import { GlobalStateProvider } from './GlobalStateProvider';
import LoginPage from './UI/Pages/LoginPage/LoginPage';
import { useState } from 'react';


export function App() {
  const [loading, setLoading] = useState(false);
  const [inGame, seTnGame] = useState(sessionStorage.getItem('userName') != undefined);

  const page = (loading)? <></>: (inGame)? <GamePage/>  : <LoginPage/>;
  return (
    <GlobalStateProvider>
      {page}
    </GlobalStateProvider>
  );
}

export default App;
