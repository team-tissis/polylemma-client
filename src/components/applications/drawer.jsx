import React , { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSnackbar } from 'notistack';
import { balanceOf } from 'fetch_sol/coin.js';
import { getNumberOfOwnedTokens } from 'fetch_sol/token.js';
import { restoreFullStamina, getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee,
         subscIsExpired, extendSubscPeriod, getSubscExpiredBlock, getSubscRemainingBlockNum, getSubscFeePerUnitPeriod, getSubscUnitPeriodBlockNum,
         getPLMCoin } from 'fetch_sol/dealer.js';
import ProgressBar from 'components/battle/ProgressBar';

function getExchangeRate () {
    const exchangeRate = [];
    exchangeRate[10] = 9;
    exchangeRate[20] = 19;
    exchangeRate[40] = 38;
    exchangeRate[80] = 76;
    exchangeRate[160] = 144;
    exchangeRate[200] = 160;
    exchangeRate[240] = 184;
    exchangeRate[280] = 187;
    exchangeRate[320] = 192;
    exchangeRate[360] = 198;
    exchangeRate[400] = 220;
    return exchangeRate;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function SwipeableTemporaryDrawer() {
    const [currentCoin, setCurrentCoin] = useState();
    const [currentToken, setCurrentToken] = useState();
    const [subscExpired, setSubscExpired] = useState(true);
    const [subscExpiredBlock, setSubscExpiredBlock] = useState();
    const [subscRemainingBlocks, setSubscRemainingBlocks] = useState();
    const [subscFee, setSubscFee] = useState();
    const [subscBlock, setSubscBlock] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const exchangeRate = getExchangeRate();


    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
        setCurrentToken(await getNumberOfOwnedTokens());

        setSubscExpiredBlock(await getSubscExpiredBlock());
        setSubscRemainingBlocks(await getSubscRemainingBlockNum());
        setSubscExpired(await subscIsExpired());
        setSubscFee(await getSubscFeePerUnitPeriod());
        setSubscBlock(await getSubscUnitPeriodBlockNum());
    })();}, []);

    const [staminaDetail, setStaminaDetail] = useState({
        currentStamina: 0,
        maxStamina: 0,
        staminaPerBattle: 0,
        restoreStaminaFee: 0,
        currentStaminaPercentage: 0
    })
    const theme = useTheme();

    const [state, setState] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
        event &&
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
        ) {
        return;
        }

        setState(open);
    };

    const handleClickCharge = async (plm, matic) => {
        try {
            const addedCoin = await getPLMCoin(plm, matic);
            setCurrentCoin(await balanceOf());
            const message = addedCoin + " コインを獲得しました!";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
        } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
    };

    const handleClickSubscUpdate = async () => {
        if (await balanceOf() < await getRestoreStaminaFee()) {
            alert("サブスク期間を延長するのにコインが足りません。");
        } else {
            try {
                await extendSubscPeriod();
                setCurrentCoin(await balanceOf());
                setSubscExpired(await subscIsExpired());
                setSubscExpiredBlock(await getSubscExpiredBlock());
                setSubscRemainingBlocks(await getSubscRemainingBlockNum());
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
        }
    };
    
    const handleClickRestoreStamina = async () => {
        if (await balanceOf() < await getRestoreStaminaFee()) {
            alert("スタミナを回復するのにコインが足りません。");
        } else {
            try {
                await restoreFullStamina();
                setCurrentCoin(await balanceOf());
                const currentStamina = await getCurrentStamina();
                const staminaMax = await getStaminaMax();
                const staminaPerBattle = await getStaminaPerBattle();
                const restoreStaminaFee = await getRestoreStaminaFee();
                setStaminaDetail({
                    currentStamina: currentStamina,
                    maxStamina: staminaMax,
                    staminaPerBattle: staminaPerBattle,
                    restoreStaminaFee: restoreStaminaFee,
                    currentStaminaPercentage: Math.round((currentStamina/staminaMax)*100)
                });
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
        }
    };

  const list = () => (<>
    <Box
      sx={{ width: 400 }}
      role="presentation"
    //   onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
        <List style={{margin: 8}}>
            <DrawerHeader>
                <IconButton>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    アカウント設定
                </IconButton>
            </DrawerHeader>
            <Box component="span">
                    <h4>{`現在のスタミナ状況 ${ staminaDetail.currentStamina }/${ staminaDetail.maxStamina }`}</h4>
                    <ProgressBar stamina={staminaDetail}/>
                    <div style={{marginTop: 10}}>
                        バトルごとの消費スタミナ: { staminaDetail.staminaPerBattle }<br/>
                        スタミナ回復/コイン: { staminaDetail.restoreStaminaFee }<br/>
                        <Button variant="contained"
                            disabled={(staminaDetail.currentStamina === staminaDetail.maxStamina) || (staminaDetail.restoreStaminaFee > currentCoin)}
                            onClick={handleClickRestoreStamina} style={{margin: 10, width: 345}}>
                            コインを消費してスタミナを回復する
                        </Button>
                    </div><hr/>
                </Box>
                <Box component="span">
                    <h4>サブスクリプション</h4>
                    <div style={{marginTop: 10}}>
                        <div>サブスクが終了しているか: {subscExpired.toString()}</div>
                        <div>サブスクが終了するブロック: {subscExpiredBlock}</div>
                        <div>サブスクが終了するまでのブロック数: {subscRemainingBlocks}</div>
                        <div>サブスク料金: {subscFee}</div>
                        <div>サブスクで更新されるブロック数: {subscBlock}</div>
                    </div>
                    <Button variant="contained" disabled={subscFee > currentCoin}
                        onClick={handleClickSubscUpdate} style={{margin: 10, width: 345}}>
                        サブスク期間をアップデートする
                    </Button><hr/>
                </Box>

                <Box component="span">
                    <h4>ステータス</h4>
                    <div style={{marginTop: 10}}>
                        <div>コイン: {currentCoin}</div>
                        <div>トークン: {currentToken} 体</div>
                    </div>
                    <div>
                        ※: 累進課税式ですが、デモ用に MATIC は消費しないようにしています。
                    </div>
                    {exchangeRate.map((plm, matic) => (
                        <Button variant="contained" key={`exchange${matic}`} onClick={() => handleClickCharge(plm, matic)} style={{margin: 10, width: 345}}>
                            {matic} MATIC を {plm} PLM に交換する
                        </Button>
                    ))}
                    <hr/>
                </Box>
        </List>
    </Box>
    </>);

  return (
    <div>
        <React.Fragment key={'right'}>
          <Button style={{backgroundColor: 'white'}} onClick={toggleDrawer(true)}>{'right'}</Button>
          <SwipeableDrawer
            anchor={'right'}
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {list()}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  );
}
