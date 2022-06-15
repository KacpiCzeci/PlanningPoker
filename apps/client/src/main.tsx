import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import App from './app/app';

const client = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
});

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root')
);
