import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import Paper from '@mui/material/Paper';
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
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {BallTriangle} from 'react-loader-spinner'
import TableRow from '@mui/material/TableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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
        setNewToken(null);
        setOpen(true);
        try {
            const newGotToken = await gacha(characterName);
            setNewToken(newGotToken);
            setCurrentCoin(await balanceOf());
            setCurrentToken(await getNumberOfOwnedTokens());
            setAddedTokenId(newGotToken.id);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
            setOpen(false);
        }
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
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {(newToken == null) ? <>
                    通信中です、しばらくお待ちください
                </> : <>
                    ギフトボックスをクリックしてキャラクターを確認しよう
                </>}
            </DialogTitle>
            <DialogContent>
                {(newToken == null) ? <>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <BallTriangle
                        height="150"
                        width="150"
                        radisu={10}
                        color="#4fa94d"
                        ariaLabel="puff-loading"
                        wrapperStyle={{display: 'inlineBlock'}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
                </>:<>
                    <div onClick={() =>  newToken == null ? null : setIsOpened(true)} style={{margin: 50}}>
                        {isOpened ? <>
                            {newToken && <>
                                <div className="card_parent" style={{width: 400, margin: '0 auto'}}>
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
                    </div>
                </>}
            </DialogContent>
            <DialogActions>
            {/* <div>トークンID: {addedTokenId}</div> */}
            <Button onClick={handleClose} disabled={!isOpened} autoFocus>
                戻る
            </Button>
            </DialogActions>
        </Dialog>
        </div>
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} sm={4} md={4}>
                <Card sx={{ maxWidth: 345, m: 2 }}>
                    <Lottie options={questionOption} height={345} width={345} style={{zIndex: 10}} />
                    <CardContent>
                    <Skeleton.SkeletonThemeProvider>
                        <Skeleton count={3} widthMultiple={['100%', '50%', '75%']} heightMultiple={['30px', '30px', '30px']} />
                    </Skeleton.SkeletonThemeProvider>
                    <Chip label={gachaFee + " コイン/回"} style={{fontSize: 20, padding: 10, marginTop: 10, marginLet: 'auto'}} />
                    </CardContent>
                </Card>
                <label> ガチャを引く前にキャラクターの名前を決めてください</label>
                <TextField id="outlined-basic" label="キャラクターの名前を決めよう"
                    variant="outlined" style={{margin: 10, width: 345}}
                    value={ characterName }
                    onChange={(e) => setCharacterName(e.target.value)}/>
                <Button variant="contained" onClick={() => handleClickGacha()} disabled={characterName === ''} style={{margin: 10, width: 345}}>
                    ガチャを1回引く
                </Button>
                <div>コイン: {currentCoin}</div>
                <div>トークン: {currentToken}</div>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <h2>Polyemmaガチャを引いてキャラを取得する</h2><hr/>

                <h3>キャラの使い方<hr style={{margin: 0, padding: 0}}/></h3>
                <p>他のプレイヤーと自分の所有するキャラを4対使用して、バトルすることができます。</p>
                <p>バトルに勝つとPLMコインを獲得できます。</p>

                <h3>キャラの性質<hr style={{margin: 0, padding: 0}}/></h3>
                <p>レベル: 育成ページでPLMコインを使用し、キャラのレベルをあげることができます。</p>
                <p>基本的にはレベルによってキャラの攻撃力が決まり、攻撃力が大きい方が勝負に勝利できます。</p>
                <p>絆レベル: 獲得したキャラの保有期間が長ければ長いほど、絆レベルは上昇していきます。（上限は自分のレベル数の二倍）</p>
                <p>絆レベルが高いほど攻撃力が増加します。（ただし、必ず攻撃力が上がるわけではありません。）</p>
                <p>属性: 炎 / 草 / 水の3種類があり、じゃんけんのような相性があります。</p>
                <p>特性: 属性を活用することでバトルで勝利しやすくなったり、勝利後の獲得コインを通常より多く獲得することができます。（一覧は下の表）</p>
                <Paper variant="outlined">
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell>特性名</StyledTableCell>
                                <StyledTableCell align="left">詳細</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {characterInfo.attributes.map((attribute, index) => (
                                <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    { attribute.title }
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    { attribute.description }
                                </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    </Container>
    </>)
}
