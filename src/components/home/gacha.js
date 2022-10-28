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
import { getBalance, getTotalSupply } from '../../fetch_sol/utils.js'
import { playGacha, mintCoin } from '../../fetch_sol/gacha.js'

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
    const initData = [0,1,2,3,4,5,6,7,8,9,10];
    const [selectedNFT, setSelectedNFT] = useState();
    const [selectedId, setSelectedId] = useState(null);
    const [isOpened, setIsOpened] = useState(false);

    const [open, setOpen] = useState(false);
    const [currentCoin, setCurrentCoin] = useState(0);
    const [currentToken, setCurrentToken] = useState(0);
    const [addedTokenId, setAddedTokenId] = useState(0);

    useEffect(() => {(async function() {
        setCurrentCoin(await getBalance());
        setCurrentToken(await getTotalSupply());
    })();}, []);

    const handleClickOpen = async () => {
        setOpen(true);
        const { newCoin, newToken, newTokenId } = await playGacha();
        setCurrentCoin(newCoin);
        setCurrentToken(newToken);
        setAddedTokenId(newTokenId);
    };

    const handleClickMint = async () => {
        const { newCoin } = await mintCoin();
        setCurrentCoin(newCoin);
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
            {/* <p> の中に <div> を入れられないっていうエラーが出るから DialogContentText は消した (橋本) */}
            {/* <DialogContentText id="alert-dialog-description"> */}
                <div onClick={() => setIsOpened(true)} >
                    <Lottie options={isOpened ? openedOptions : defaultOptions} height={400} width={400} style={{backgroundColor: 'grey'}} />
                    {/* <div style={{position: 'absolute', top: 100, left: 200, height: 300 ,backgroundColor: 'blue'}}>
                        ここにキャラのカードを表示
                    </div> */}
                </div>


            {/* </DialogContentText> */}
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
                    <Chip label="5 コイン/回" style={{fontSize: 20, padding: 10, marginTop: 10, marginLet: 'auto'}} />
                    </CardContent>
                </Card>
                <Button variant="contained" onClick={handleClickOpen} style={{margin: 10, width: 345}}>ガチャを1回引く</Button>
            </Grid>
            <Grid item xs={12} sm={7} md={7}>
                <Button variant="contained" onClick={handleClickMint} style={{margin: 10, width: 345}}>100 コインミントする</Button>
                <div>コイン: {currentCoin}</div>
                <div>トークン: {currentToken}</div>
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
        {/* タップしてキャラクターを確認しよう！ */}
    </>)
}
