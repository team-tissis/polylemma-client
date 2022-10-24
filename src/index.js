import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { PersistGate } from 'redux-persist/integration/react';
import { composeWithDevTools } from "redux-devtools-extension";
import { RouterConfig } from "./Routes.tsx";
import { createStore, applyMiddleware } from 'redux'
import Header from './components/applications/header';
import Footer from './components/applications/footer';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';

const enhancer = process.env.NODE_ENV === 'development' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk)

switch (process.env.NODE_ENV) {
  case 'development':
    axios.defaults.baseURL = 'http://localhost:3000';
    break;
  case 'production':
    axios.defaults.baseURL = 'https://room-backend-sample.herokuapp.com/'
    break;
  default:
    axios.defaults.baseURL = 'http://localhost:3000';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
  {/* <PersistGate loading={null} persistor={persistor}> */}
    {/* <Router> */}
      <Header />
      <RouterConfig style={{ marginTop: 80}}/>
      <Footer />
    {/* </Router> */}
  {/* </PersistGate> */}
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
