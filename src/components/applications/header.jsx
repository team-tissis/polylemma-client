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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemText from '@mui/material/ListItemText';
import { balanceOf, totalSupply } from '../../fetch_sol/utils.js'
import { charge, getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod, extendSubscPeriod, getSubscUnitPeriodBlockNum } from '../../fetch_sol/subsc.js'
import { getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee, restoreFullStamina  } from '../../fetch_sol/stamina.js'

export default function Header() {
    const [currentCoin, setCurrentCoin] = useState();
    const [currentToken, setCurrentToken] = useState();
    const [subscExpired, setSubscExpired] = useState();
    const [subscExpiredPoint, setSubscExpiredPoint] = useState();
    const [subscFee, setSubscFee] = useState();
    const [subscDuration, setSubscDuration] = useState();
    const [staminaDetail, setstaminaDetail] = useState({
      currentStamina: 0, maxStamina: 0, 
      staminaPerBattle: 0, restoreStaminaFee: 0
    });

    useEffect(() => {(async function() {
      setstaminaDetail({
        currentStamina: await getCurrentStamina(),
        maxStamina: await getStaminaMax(), 
        staminaPerBattle: await getStaminaPerBattle(),
        restoreStaminaFee: await getRestoreStaminaFee()
      })
    })()},[]);

    useEffect(() => {(async function() {
        console.log({staminaDetail})
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
	const [errorMessage, setErrorMessage] = useState(null);

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

    const handleClickExchange = async () => {
        const { newCoin } = await charge();
        setCurrentCoin(newCoin);
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
                <Button variant="contained" onClick={handleClickExchange}
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
