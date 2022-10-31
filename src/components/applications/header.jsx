import React , { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Chip from '@mui/material/Chip';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentWalletAddress, setCurrentWalletAddress, walletAddressRemove } from '../../slices/user.ts'
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { balanceOf } from '../../fetch_sol/coin.js';
import { totalSupply } from '../../fetch_sol/token.js';
import { getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod, extendSubscPeriod, getSubscUnitPeriodBlockNum, charge } from '../../fetch_sol/dealer.js';

function headerStyle() {
  return {
      position: 'fixed',
      top: 0,
      width: '100%',
      height: 10,
      zIndex: 0
  }
}

function staminaStyle() {
  return {
    position: 'fixed',
    top: 100,
    right: 20,
  }
}

export default function Header() {
    const [currentCoin, setCurrentCoin] = useState();
    const [currentToken, setCurrentToken] = useState();
    const [subscExpired, setSubscExpired] = useState();
    const [subscExpiredPoint, setSubscExpiredPoint] = useState();
    const [subscFee, setSubscFee] = useState();
    const [subscDuration, setSubscDuration] = useState();
    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
        setCurrentToken(await totalSupply());
        setSubscExpired(await subscIsExpired());
        setSubscExpiredPoint(await getSubscExpiredBlock());
        setSubscFee(await getSubscFeePerUnitPeriod());
        setSubscDuration(await getSubscUnitPeriodBlockNum());
    })();}, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const walletAddress = useSelector(selectCurrentWalletAddress);
  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

const drawerWidth = 380;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
    }),
  }));

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }));

	const handleEnableToConnect = () => {
    const tmpFlag = window.ethereum && window.ethereum.isMetaMask;
    if(tmpFlag){
		window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
          const account = result[0]
          dispatch(setCurrentWalletAddress(result[0]));
          window.ethereum.request({ method: "eth_balanceOf", params: [ account , 'latest' ]})
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
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.log({error})
      });
    }
	}

  const handleClickSubscUpdate = async () => {
    await extendSubscPeriod();
    setCurrentCoin(await balanceOf());
    setSubscExpired(await subscIsExpired());
    setSubscExpiredPoint(await getSubscExpiredBlock());
  };

  const handleClickCharge = async () => {
    await charge();
    setCurrentCoin(await balanceOf());
  };

  // 開発テスト用: MetaMaskと接続を切る
  const handleDeleteWalletData =  () => {
    dispatch(walletAddressRemove());
	}

  return (<>
    {/* <Box sx={{ flexGrow: 1 }} style={headerStyle()}> */}
    <Box sx={{ display: 'flex'}}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open} style={{margin: 0, padding: 5, height: 50}}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            アカウント設定
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List style={{margin: 8}}>

          <ListItemText
              primary="現在のスタミナ状況"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                  <div style={{marginTop: 10}}>
                    <FavoriteBorderIcon style={{fontSize: 30}}/>
                    <FavoriteBorderIcon style={{fontSize: 30}}/>
                    <FavoriteIcon style={{fontSize: 30}}/>
                    <FavoriteIcon style={{fontSize: 30}}/>
                    <FavoriteIcon style={{fontSize: 30}}/>
                  <Button variant="contained" disabled
                    onClick={handleClickSubscUpdate} style={{margin: 10, width: 345}}>
                    コインを消費してスタミナを回復する
                  </Button>
                  </div>
                  <hr/>
                  </Typography>
                </React.Fragment>
              }
          />

          <ListItemText
              primary="サブスクリプション"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                  <div style={{marginTop: 10}}>
                    <div>サブスクが終了しているか: {subscExpired}</div>
                    <div>サブスクが終了するブロック: {subscExpiredPoint}</div>
                    <div>サブスク料金: {subscFee}</div>
                    <div>サブスクで更新されるブロック数: {subscDuration}</div>
                  </div>
                  <Button variant="contained"
                    onClick={handleClickSubscUpdate} style={{margin: 10, width: 345}}>
                    サブスク期間をアップデートする
                  </Button>
                  <hr/>
                  </Typography>
                </React.Fragment>
              }
          />


          <ListItemText
              primary="サブスクリプション"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                  <div style={{marginTop: 10}}>
                    <div>コイン: {currentCoin}</div>
                    <div>トークン: {currentToken}体</div>
                  </div>
                <Button variant="contained" onClick={handleClickCharge}
                    style={{margin: 10, width: 345}}>100 MATIC を PLM に交換する</Button>
                  <hr/>
                  </Typography>
                </React.Fragment>
              }
          />
        </List>
        <Divider />
      </Drawer>
    </Box>
  </>);
}
