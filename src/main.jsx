import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//import Navbar from './components/Navbar.jsx';
import Sidebar from './components/SideBar.jsx';
import HomeTabs from './components/HomeTabs..jsx';
import { DataProvider } from './context/DataContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <Sidebar />
      <HomeTabs />
      <App />
    </DataProvider>
  </React.StrictMode>,
)
