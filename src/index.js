import React, { useState, useEffect } from 'react';
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
import { SnackbarProvider } from 'notistack';
import { store, persistor } from './store.ts';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
  <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
      <Header />
      {/* <div style={{height: 70}}/> */}
      <RouterConfig/>
      <Footer />
  </SnackbarProvider>
  </Provider>
);

reportWebVitals();
