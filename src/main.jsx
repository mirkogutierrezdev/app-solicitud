import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/index.css';

import { DataProvider } from './context/DataContext.jsx'; 
import { UnreadProvider } from './context/UnreadContext.jsx';
import HomeTabs from './components/HomeTabs..jsx';
import { Footer } from './components/Footer.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UnreadProvider>
      <DataProvider>
        <main>
          <HomeTabs />
          <App />
        </main>
      </DataProvider>
    </UnreadProvider>
    <Footer />
  </React.StrictMode>
);
