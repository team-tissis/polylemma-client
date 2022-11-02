import React , { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentWalletAddress, setCurrentWalletAddress, walletAddressRemove } from '../../slices/user.ts'
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { balanceOf } from '../../fetch_sol/coin.js';
import { totalSupply } from '../../fetch_sol/token.js';
import { getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod,
         extendSubscPeriod, getSubscUnitPeriodBlockNum, charge, accountCharged ,
         getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee, restoreFullStamina, consumeStaminaForBattle,
       } from '../../fetch_sol/dealer.js';
import { useSnackbar } from 'notistack';
import ProgressBar from './progress_bar'
import { cancelProposals, requestChallengeToMe } from '../../fetch_sol/test/match_organizer_test';

export default function Header() {
    const [currentCoin, setCurrentCoin] = useState();
    const [currentToken, setCurrentToken] = useState();
    const [subscExpired, setSubscExpired] = useState();
    const [subscExpiredBlock, setSubscExpiredBlock] = useState();
    const [subscFee, setSubscFee] = useState();
    const [subscBlock, setSubscBlock] = useState();

    const [addedCoin, setAddedCoin] = useState(-1);
    const [charging, setCharging] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [staminaDetail, setstaminaDetail] = useState({
        currentStamina: 0, maxStamina: 0,
        staminaPerBattle: 0, restoreStaminaFee: 0,
        currentStaminapercentage: 0
    })

    useEffect(() => {(async function() {
        const currentStamina = await getCurrentStamina();
        const staminaMax = await getStaminaMax();
        const staminaPerBattle = await getStaminaPerBattle();
        const restoreStaminaFee = await getRestoreStaminaFee();
        setstaminaDetail({
            currentStamina: currentStamina,
            maxStamina: staminaMax,
            staminaPerBattle: staminaPerBattle,
            restoreStaminaFee: restoreStaminaFee,
            currentStaminapercentage: (currentStamina/staminaMax)*100
        })
    })()},[]);

    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
        setCurrentToken(await totalSupply());

        setSubscExpiredBlock(await getSubscExpiredBlock());
        setSubscExpired(await subscIsExpired());
        setSubscFee(await getSubscFeePerUnitPeriod());
        setSubscBlock(await getSubscUnitPeriodBlockNum());
    })();}, []);

    useEffect(() => {
        if (charging && addedCoin > 0) {
            const message = addedCoin + " コインを獲得しました!";
            enqueueSnackbar(message, {
            autoHideDuration: 1500,
            variant: 'success',
            });
        }
        setAddedCoin(-1);
        setCharging(false);
    }, [addedCoin]);

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
    }));

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

    const dispatch = useDispatch();
    const walletAddress = useSelector(selectCurrentWalletAddress);
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
                    const payload = { address: account, ethAmount: eth, gwei: gwei}
                    dispatch(setCurrentWalletAddress(payload));
                })
                .catch((error) => {
                    console.log({error})
                });
            })
            .catch((error) => {
                console.log({error})
            });
        }
	}

    const handleClickSubscUpdate = async () => {
        await extendSubscPeriod();
        setCurrentCoin(await balanceOf());
        setSubscExpired(await subscIsExpired());
        setSubscExpiredBlock(await getSubscExpiredBlock());
    };

    const handleClickCharge = async () => {
        if (charging) {
            alert("チャージ中です。");
        } else {
            await charge();
            setCurrentCoin(await balanceOf());
            await accountCharged(setAddedCoin);
            setCharging(true);
        }
    };

    // 開発テスト用: MetaMaskと接続を切る
    const handleDeleteWalletData =  () => {
        dispatch(walletAddressRemove());
    }
    // 開発テスト用: Proposalを取り下げる
    async function handleDeclinePros () {
        await cancelProposals();
    }
    // 開発テスト用: Proposalを取り下げる
    async function handleProposeToMe () {
        await requestChallengeToMe();
    }
   
    return (<>
        <Box sx={{ display: 'flex'}}>
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                    Polylemma
                </Typography>

                {/* <Button variant="outlined" color="inherit" onClick={() => handleDeleteWalletData() } style={{marginLeft: 20}}>
                    [開発者用]Walletデータを消去
                </Button>
                {walletAddress ?
                    <Chip label={`${walletAddress.ethAmount} ETH`}
                    style={{fontSize: 20, backgroundColor: 'white', margin: 15, padding: 10}} variant="outlined" />
                    : <Button  variant="outlined" color="inherit" onClick={() => handleEnableToConnect() } style={{marginLeft: 20}}>
                        MetaMaskと連携する
                    </Button>
                } */}
                <Button variant="outlined" color="secondary" onClick={() => handleProposeToMe()} style={{marginLeft: 20, backgroundColor: 'white'}}>
                    [dev]自分に対戦を申し込ませる
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeclinePros()} style={{marginLeft: 20, backgroundColor: 'white'}}>
                    [dev]全ユーザーのProposalを取り下げる
                </Button>
                <Button variant="outlined" color="inherit" style={{marginLeft: 20}}>
                    所持コイン: {`${currentCoin} PLM`}
                </Button>
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
                <Box component="span">
                    <h4>{`現在のスタミナ状況 ${ staminaDetail.currentStamina }/${ staminaDetail.maxStamina }`}</h4>
                    <ProgressBar stamina={staminaDetail}/>
                    <div style={{marginTop: 10}}>
                        バトルごとの消費スタミナ: { staminaDetail.staminaPerBattle }<br/>
                        スタミナ回復/コイン: { staminaDetail.restoreStaminaFee }<br/>
                        <Button variant="contained" disabled={(staminaDetail.currentStamina === staminaDetail.maxStamina) ? true : false}
                            onClick={handleClickCharge} style={{margin: 10, width: 345}}>
                            コインを消費してスタミナを回復する
                        </Button>
                    </div><hr/>
                </Box>
                <Box component="span">
                    <h4>サブスクリプション</h4>
                    <div style={{marginTop: 10}}>
                        <div>サブスクが終了しているか: {subscExpired}</div>
                        <div>サブスクが終了するブロック: {subscExpiredBlock}</div>
                        <div>サブスク料金: {subscFee}</div>
                        <div>サブスクで更新されるブロック数: {subscBlock}</div>
                    </div>
                    <Button variant="contained"
                        onClick={handleClickSubscUpdate} style={{margin: 10, width: 345}}>
                        サブスク期間をアップデートする
                    </Button><hr/>
                </Box>

                <Box component="span">
                    <h4>ステータス</h4>
                    <div style={{marginTop: 10}}>
                        <div>コイン: {currentCoin}</div>
                        <div>トークン: {currentToken}体</div>
                    </div>
                    <Button variant="contained" disabled={charging} onClick={handleClickCharge} style={{margin: 10, width: 345}}>
                        100 MATIC を 95 PLM に交換する
                    </Button><hr/>
                </Box>
            </List>
            <Divider />
        </Drawer>
        </Box>
    </>);
}
