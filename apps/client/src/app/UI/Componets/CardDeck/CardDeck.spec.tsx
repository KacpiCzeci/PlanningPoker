import { render } from '@testing-library/react';

import CardDeck from './CardDeck';

describe('CardDeck', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardDeck />);
    expect(baseElement).toBeTruthy();
  });
});
