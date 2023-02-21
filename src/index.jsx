import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'css/index.css';
import reportWebVitals from 'reportWebVitals';
import { Provider } from 'react-redux';
import { RouterConfig } from "routes/Routes.jsx";
import { SnackbarProvider } from 'notistack';
import { store } from 'store.ts';
import { balanceOf } from 'fetch_sol/coin.js';
import { getCurrentAdress } from 'fetch_sol/utils';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Page() {
    const [currentCoin, setCurrentCoin] = useState(0);

    useEffect(() => {(async function() {
        const address = await getCurrentAdress();
        console.log({address})
    })();}, []);

    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
    })();}, []);

    return (<>
        <Provider store={store}>
        <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
            <RouterConfig currentCoin={currentCoin} setCurrentCoin={setCurrentCoin} />
        </SnackbarProvider>
        </Provider>
    </>);
}

root.render(<Page />);

reportWebVitals();
