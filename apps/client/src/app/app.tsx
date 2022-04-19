import GamePage from './UI/GamePage/GamePage';
import { GlobalStateProvider } from './GlobalStateProvider';


export function App() {
  return (
    <GlobalStateProvider>
      <GamePage/>
    </GlobalStateProvider>
  );
}

export default App;
