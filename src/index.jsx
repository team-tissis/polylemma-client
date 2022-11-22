import ReactDOM from 'react-dom/client';
import 'css/index.css';
import reportWebVitals from 'reportWebVitals';
import { Provider } from 'react-redux';
import { RouterConfig } from "routes/Routes.tsx";
import Header from 'components/applications/Header';
import { SnackbarProvider } from 'notistack';
import { store, persistor } from 'Store.ts';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
  <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
      <Header />
      <RouterConfig/>
  </SnackbarProvider>
  </Provider>
);

reportWebVitals();
