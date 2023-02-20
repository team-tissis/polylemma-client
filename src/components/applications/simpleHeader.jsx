import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentWalletAddress, setCurrentWalletAddress, removeWalletAddress } from '../../slices/user.ts';
import { connectWallet } from 'fetch_sol/utils.js';

export default function SimpleHeader() {
    const dispatch = useDispatch();
    const walletAddress = useSelector(selectCurrentWalletAddress);

    function getWalletAddressToShow (address) {
        return address.substr(0, 5) + "..." + address.substr(-4);
    }

    async function handleConnectWallet () {
        if (window.ethereum === undefined) {
            dispatch(removeWalletAddress());
            alert("Chrome に MetaMask をインストールしてください。");
        } else {
            try {
                const address = await connectWallet();
                if (walletAddress !== address) {
                    alert(`アカウントが ${getWalletAddressToShow(address)} に変更されました。`);
                    dispatch(setCurrentWalletAddress(address));
                    window.location.reload();
                } else {
                    alert("アカウントが変更されていません。");
                }
            } catch (e) {
                dispatch(removeWalletAddress());
                console.log({error: e});
            }
        }
    }

    useEffect(() => {(async function() {
        if (window.ethereum === undefined) {
            dispatch(removeWalletAddress());
            alert("Chrome に MetaMask をインストールしてください。");
        } else {
            try {
                const address = await connectWallet();
                if (walletAddress !== address) {
                    alert(`アカウントが ${getWalletAddressToShow(address)} に設定されました。`);
                    dispatch(setCurrentWalletAddress(address));
                    window.location.reload();
                }
            } catch (e) {
                dispatch(removeWalletAddress());
                console.log({error: e});
            }
            window.ethereum.on("accountsChanged", () => handleConnectWallet());
        }
    })()},[]);

    return (<>
        <Box sx={{ display: 'flex'}} style={{height: 60, backgroundColor: 'grey'}}>
            <MuiAppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Polylemma
                    </Typography>
                    {walletAddress ?
                    <>
                        <div>{"今のアドレス: " + getWalletAddressToShow(walletAddress)}</div>
                        <Button variant="outlined" color="inherit" onClick={() => handleConnectWallet() } style={{marginLeft: 20}}>
                            別のアカウントを接続
                        </Button>
                    </>
                    : <Button variant="outlined" color="inherit" onClick={() => handleConnectWallet() } style={{marginLeft: 20}}>
                        MetaMaskと連携
                    </Button>
                    }
                </Toolbar>
            </MuiAppBar>
        </Box>
    </>);
}
