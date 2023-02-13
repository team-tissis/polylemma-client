import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import HeaderDrawer from 'components/applications/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentWalletAddress, setCurrentWalletAddress, walletAddressRemove } from '../../slices/user.ts';
import { connectWallet } from 'fetch_sol/utils.js';
import Chip from '@mui/material/Chip';

export default function Header({currentCoin, setCurrentCoin}) {
    const dispatch = useDispatch();
    const walletAddress = useSelector(selectCurrentWalletAddress);

    async function handleConnectWallet () {
        const address = await connectWallet();
        dispatch(setCurrentWalletAddress(address));
    }

    return (<>
        <Box sx={{ display: 'flex'}} style={{height: 60, backgroundColor: 'grey'}}>
            <MuiAppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Polylemma
                    </Typography>
                    {walletAddress ?
                    <>
                        <div>{"今のアドレス: " + walletAddress.substr(0, 5) + "..." + walletAddress.substr(-4)}</div>
                        <Button variant="outlined" color="inherit" onClick={() => handleConnectWallet() } style={{marginLeft: 20}}>
                            別のアカウントを接続
                        </Button>
                    </>
                    : <Button variant="outlined" color="inherit" onClick={() => handleConnectWallet() } style={{marginLeft: 20}}>
                        MetaMaskと連携
                    </Button>
                    }
                    <Chip label={`所持コイン: ${currentCoin} PLM`} variant="outlined"  style={{marginLeft: 20, color: 'white', fontSize: 16}}/>
                    <HeaderDrawer currentCoin={currentCoin} setCurrentCoin={setCurrentCoin} />
                </Toolbar>
            </MuiAppBar>
        </Box>
    </>);
}
