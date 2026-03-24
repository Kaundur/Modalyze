import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Modalyze } from 'modalyze';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Modalyze>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Modalyze>
  </StrictMode>
);
