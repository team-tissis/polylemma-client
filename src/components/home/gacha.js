import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import * as animationData from '../../animations/gift.json';
import * as unOpenAnimationData from '../../animations/gift-unopen.json';
import * as questionAnimationData from '../../animations/question.json';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Skeleton } from 'react-skeleton-generator';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { balanceOf, mint } from '../../fetch_sol/coin.js';
import { totalSupply } from '../../fetch_sol/token.js';
import { gacha, getGachaFee } from '../../fetch_sol/gacha.js';
import { getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod, extendSubscPeriod, getSubscUnitPeriodBlockNum, charge, accountCharged } from '../../fetch_sol/dealer.js';
import { useSnackbar } from 'notistack';
import TextField from '@mui/material/TextField';

const questionOption = {
    loop: true,
    autoplay: true,
    animationData: questionAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const openedOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: unOpenAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default function GachaGacha(){
    const [isOpened, setIsOpened] = useState(false);

    const [open, setOpen] = useState(false);
    const [gachaFee, setGachaFee] = useState();
    const [currentCoin, setCurrentCoin] = useState();
    const [currentToken, setCurrentToken] = useState();
    const [addedTokenId, setAddedTokenId] = useState(0);

    const [subscExpired, setSubscExpired] = useState();
    const [subscExpiredBlock, setSubscExpiredBlock] = useState();
    const [subscFee, setSubscFee] = useState();
    const [subscBlock, setSubscBlock] = useState();

    const [characterName, setCharacterName] = useState('');

    const [addedCoin, setAddedCoin] = useState(-1);
    const [charging, setCharging] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {(async function() {
        setGachaFee(await getGachaFee());
        setCurrentCoin(await balanceOf());
        setCurrentToken(await totalSupply());
        setSubscExpired(await subscIsExpired());
        setSubscExpiredBlock(await getSubscExpiredBlock());
        setSubscFee(await getSubscFeePerUnitPeriod());
        setSubscBlock(await getSubscUnitPeriodBlockNum());
        accountCharged(setAddedCoin);
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

    const handleClickGacha = async () => {
        setOpen(true);
        const newTokenId = await gacha(characterName);
        setCurrentCoin(await balanceOf());
        setCurrentToken(await totalSupply());
        setAddedTokenId(newTokenId);
    };

    const handleClickCharge = async () => {
        await charge();
        setCurrentCoin(await balanceOf());
        setCharging(true);
    };

    const handleClickSubscUpdate = async () => {
        await extendSubscPeriod();
        setCurrentCoin(await balanceOf());
        setSubscExpired(await subscIsExpired());
        setSubscExpiredBlock(await getSubscExpiredBlock());
        const message = "サブスクリプションを更新しました!"
        enqueueSnackbar(message, {
            autoHideDuration: 1500,
            variant: 'success',
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(<>
    <Container>
        <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            ギフトボックスをクリックしてキャラクターを確認しよう
            </DialogTitle>
            <DialogContent>
                <div onClick={() => setIsOpened(true)} >
                    <Lottie options={isOpened ? openedOptions : defaultOptions} height={400} width={400} />
                    {/* <div style={{position: 'absolute', top: 100, left: 200, height: 300 ,backgroundColor: 'blue'}}>
                        ここにキャラのカードを表示
                    </div> */}
                </div>
            </DialogContent>
            <DialogActions>
            <div>トークンID: {addedTokenId}</div>
            <Button onClick={handleClose} autoFocus>
                戻る
            </Button>
            </DialogActions>
        </Dialog>
        </div>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} sm={5} md={5}>
                <Card sx={{ maxWidth: 345, m: 2 }}>
                    <Lottie options={questionOption} height={345} width={345} style={{zIndex: 10}} />
                    <CardContent>
                    <Skeleton.SkeletonThemeProvider>
                        <Skeleton count={3} widthMultiple={['100%', '50%', '75%']} heightMultiple={['30px', '30px', '30px']} />
                    </Skeleton.SkeletonThemeProvider>
                    <Chip label={gachaFee + " コイン/回"} style={{fontSize: 20, padding: 10, marginTop: 10, marginLet: 'auto'}} />
                    </CardContent>
                </Card>
                <label>ガチャを引く前にキャラクターの名前を決めてください</label>
                <TextField id="outlined-basic" label="キャラクターの名前を決めよう"
                    variant="outlined" style={{margin: 10, width: 345}}
                    value={ characterName }
                    onChange={(e) => setCharacterName(e.target.value)}/>
                <Button variant="contained" onClick={handleClickGacha} disabled={characterName === ''} style={{margin: 10, width: 345}}>ガチャを1回引く</Button>
            </Grid>
            <Grid item xs={12} sm={7} md={7}>
                <Button variant="contained" onClick={handleClickCharge} style={{margin: 10, width: 345}}>100 MATIC を PLM に交換する</Button>
                <div>コイン: {currentCoin}</div>
                <div>トークン: {currentToken}</div>
                <Button variant="contained" onClick={handleClickSubscUpdate} style={{margin: 10, width: 345}}>サブスク期間をアップデートする</Button>
                <div>サブスクが終了しているか: {subscExpired}</div>
                <div>サブスクが終了するブロック: {subscExpiredBlock}</div>
                <div>サブスク料金: {subscFee}</div>
                <div>サブスクで更新されるブロック数: {subscBlock}</div>
                <h2>ここに説明文</h2><hr/>
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
                ああああああああああああああああああああああああああああああああああああ
            </Grid>
        </Grid>
    </Container>
    </>)
}
