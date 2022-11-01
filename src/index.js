import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { RouterConfig } from "./Routes.tsx";
import Header from './components/applications/header';
import Footer from './components/applications/footer';
import { SnackbarProvider } from 'notistack';
import { store, persistor } from './store.ts';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
  <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
      <Header />
      <RouterConfig/>
      <Footer />
  </SnackbarProvider>
  </Provider>
);

reportWebVitals();
