import { render } from '@testing-library/react';

import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginPage />);
    expect(baseElement).toBeTruthy();
  });
});