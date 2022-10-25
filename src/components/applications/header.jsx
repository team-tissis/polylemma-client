import React , { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Chip from '@mui/material/Chip';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentWalletAddress, setCurrentWalletAddress, walletAddressRemove } from '../../slices/user.ts'

function headerStyle() {
  return {
      position: 'fixed',
      top: 0,
      width: '100%',
      height: 80,
      zIndex: 999
  }
}

export default function Header() {
  const dispatch = useDispatch();
  const walletAddress = useSelector(selectCurrentWalletAddress);
  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const handleEnableToConnect = () => {
    const tmpFlag = window.ethereum && window.ethereum.isMetaMask;
    if(tmpFlag){
		window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
          const account = result[0]
          dispatch(setCurrentWalletAddress(result[0]));
          window.ethereum.request({ method: "eth_getBalance", params: [ account , 'latest' ]})
          .then((result) => {
              const wei = parseInt(result/16)
              const gwei = (wei / Math.pow(10,9))
              const eth = (wei / Math.pow(10,18))
              const payload = {
                address: account,
                ethAmount: eth,
                gwei: gwei,
              }
              dispatch(setCurrentWalletAddress(payload));
          })
          .catch((error) => {
            console.log({error})
          });
          // const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [ account , 'latest' ]})
          // const wei = parseInt(balance/16)
          // const gwei = (wei / Math.pow(10,9))
          // const eth = (wei / Math.pow(10,18))
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.log({error})
      });
    }
	}

  // 開発テスト用: MetaMaskと接続を切る
  const handleDeleteWalletData =  () => {
    dispatch(walletAddressRemove());
	}
  
  return (
    <Box sx={{ flexGrow: 1 }} style={headerStyle()}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Polylemma
          </Typography>
          <Button  variant="outlined" color="inherit" onClick={() => handleDeleteWalletData() } style={{marginLeft: 20}}>
            [開発者用]Walletデータを消去
          </Button>
          {walletAddress ? 
            <Chip label={`${walletAddress.ethAmount} ETH`}
              style={{fontSize: 20, backgroundColor: 'white', margin: 15, padding: 10}} variant="outlined" />
            : <Button  variant="outlined" color="inherit" onClick={() => handleEnableToConnect() } style={{marginLeft: 20}}>
                MetaMaskと連携する
              </Button>
          }
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
