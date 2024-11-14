import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { DataProvider } from './context/DataContext.jsx'; // Proporcionamos acceso global al contexto de datos
import { UnreadProvider } from './context/UnreadContext.jsx';
import HomeTabs from './components/HomeTabs..jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UnreadProvider>
      <DataProvider> {/* Proporcionamos acceso al contexto global */}
        <HomeTabs />  {/* HomeTabs sigue teniendo acceso al contexto */}
        <App />       {/* App manejará rutas dinámicas sin necesidad de otro DataProvider */}
      </DataProvider>
    </UnreadProvider>
  </React.StrictMode>
);
