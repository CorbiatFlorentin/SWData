import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import './assets/style/App.css';
import AppRoutes from './routes/AppRoutes'; 
import Navbar from './components/Navbar';
import { UserProvider } from './UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
    <Router>
      <Navbar />
      <AppRoutes /> 
    </Router>
    </UserProvider>
  </React.StrictMode>
);







