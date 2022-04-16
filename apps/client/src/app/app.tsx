import styled from 'styled-components';
import NxWelcome from './nx-welcome';
import GamePage from '../../../../libs/react/UI/GamePage/GamePage';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <GamePage />
    </StyledApp>
  );
}

export default App;
