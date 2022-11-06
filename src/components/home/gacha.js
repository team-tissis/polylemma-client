import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
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
import DialogTitle from '@mui/material/DialogTitle';
import { balanceOf, mint } from '../../fetch_sol/coin.js';
import { getNumberOfOwnedTokens } from '../../fetch_sol/token.js';
import { gacha, getGachaFee } from '../../fetch_sol/gacha.js';
import TextField from '@mui/material/TextField';
import characterInfo from "./character_info.json";

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
    const [characterName, setCharacterName] = useState('');
    const [newToken, setNewToken] = useState();
    const [gachaOpen, setGachaOpen] = useState(false);

    useEffect(() => {(async function() {
        setGachaFee(await getGachaFee());
        setCurrentCoin(await balanceOf());
        setCurrentToken(await getNumberOfOwnedTokens());
    })();}, []);

    const handleClickGacha = async () => {
        setOpen(true);
        const newGotToken = await gacha(characterName);
        console.log({newGotToken})
        setNewToken(newGotToken)
        setCurrentCoin(await balanceOf());
        setCurrentToken(await getNumberOfOwnedTokens());
        setAddedTokenId(newGotToken.id);
    };

    const handleClose = () => {
        setOpen(false);
        setIsOpened(false)
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
                <div onClick={() =>  setIsOpened(true)} style={{margin: 50}}>
                    {isOpened ? <>
                        {newToken && <>
                            <div className="card_parent"　style={{width: 400, margin: '0 auto'}}>
                            <div className="card_name">
                                { newToken.name }
                            </div>
                            <div className="box" style={{padding: 10}}>
                                レベル: { newToken.level }<br/>
                            </div>
                            
                            <div className="character_type_box" style={{backgroundColor: characterInfo.characterType[newToken.characterType]['backgroundColor'],
                                                                borderColor: characterInfo.characterType[newToken.characterType]['borderColor']}}>
                                { characterInfo.characterType[newToken.characterType]['jaName'] }
                            </div>
                            <div className="img_box" style={{height: 'auto'}}>
                                <img className='img_div' src={ newToken.imgURI } style={{width: '98%', height: 'auto', objectFit: 'fill'}} alt="sample"/>
                            </div>
                            <div className="attribute_box">
                                レア度 {newToken.rarity} / { characterInfo.attributes[newToken.attributeIds[0]]["title"] }
                            </div>
                            <div className="detail_box">
                                <div style={{margin: 10}}>
                                    { characterInfo.attributes[newToken.attributeIds[0]]["description"] }
                                </div>
                            </div>
                        </div>
                        </>}
                    </> : <Lottie options={defaultOptions} height={400} width={400} />
                    }
                    {/* <Lottie options={isOpened ? openedOptions : defaultOptions} height={400} width={400} /> */}
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
                <Button variant="contained" onClick={handleClickGacha} disabled={characterName === ''} style={{margin: 10, width: 345}}>
                    ガチャを1回引く
                </Button>
            </Grid>
            <Grid item xs={12} sm={7} md={7}>
                <div>コイン: {currentCoin}</div>
                <div>トークン: {currentToken}</div>
                <h2>ここに説明文</h2><hr/>
                レベル: hogehoge<br/>
                絆レベル: hogehoge<br/>
                特性: hogehoge<br/>
                属性: hogehoge<br/>
                レベルの上げ方:  hogehoge<br/>
                対戦方法: hogehoge<br/>
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
