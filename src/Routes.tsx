import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Sample from './Sample';
import BattleMain from './components/home/battle_main.js'
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

export const RouterConfig:React.VFC =() => {
  const [address, setAddress] = React.useState("");
  var web3: Web3;

  const enable = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider && window.ethereum?.isMetaMask) {
      console.log('Welcome to MetaMask User🎉');
      
      web3 = new Web3(Web3.givenProvider);
      web3.eth.defaultChain = "ropsten";
      
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
    } else {
      console.log('Please Install MetaMask🙇‍♂️')
    }
  }
  const [metaMaskFlag, setMetaMaskFlag] = useState(false);
  useEffect(() => {
      const tmpFlag = window.ethereum && window.ethereum.isMetaMask;
      setMetaMaskFlag(tmpFlag);
      if(tmpFlag){
        enable()
      }
      console.log(tmpFlag)
  },[]);

  // const enable = async () => {
  //   const provider = await detectEthereumProvider({ mustBeMetaMask: true });
  //   if (provider && window.ethereum?.isMetaMask) {
  //     console.log('Welcome to MetaMask User🎉');
  //   } else {
  //     console.log('Please Install MetaMask🙇‍♂️')
  //   }
  // }

  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const connectWallet = () => {
		window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((result) => {
			  setAccount(result[0]);
        console.log({result})
		})
		.catch((error) => {
		  setErrorMessage(error.message);
      console.log({error})
		});
	}

  // function connect() {
  //   ethereum
  //   .request({ method: 'eth_requestAccounts' })
  //   .then(handleAccountsChanged)
  //   .catch((err) => {
  //   if (err.code === 4001) {
  //     // EIP-1193 userRejectedRequest error
  //     // If this happens, the user rejected the connection request.
  //     console.log('Please connect to MetaMask.');
  //   } else {
  //     console.error(err);
  //   }
  //   });
  // }

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="sample/:id" element={<Sample />} />
        <Route path="/battle_main" element={<BattleMain />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
