import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '../../icons/avatar_1.png'
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { selectMyCharacter } from '../../slices/myCharacter.ts';
import { useSelector, useDispatch } from 'react-redux';
import { getRandomBytes32 } from '../../fetch_sol/utils.js';
import { totalSupply } from '../../fetch_sol/token.js';
import { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, getNonce,
         getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo, getPlayerIdFromAddress, getTotalSupplyAtBattleStart,
         battleStarted, playerSeedCommitted, playerSeedRevealed, choiceCommitted, choiceRevealed, roundResult, battleResult, battleCanceled } from '../../fetch_sol/battle_field.js';
import { defeatByFoul } from '../../fetch_sol/test/match_organizer_test.js';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
function handleButtonStyle() {
    return {
        position: 'fixed',
        bottom: 20,
        right: '38%',
        width: '24%',
        fontSize: 17,
        fontWeight: 600
    }
}

// TODO::すでにバトルに出したキャラは選択できない
// TODO: thisCharcter は左から何番目のキャラクタかという情報の方がありがたい
function NFTCharactorCard({character, thisCharacter, setThisCharacter, levelPoint}){
    useEffect(() => {
        console.log({character});
        console.log("レベルを読み込み中........");
    },[levelPoint])

    return(<>
        <Paper onClick={() => setThisCharacter(character.id) } elevation={10}
            style={{backgroundColor: (thisCharacter === character.id) ? '#FFBEDA' : '#30F9B2', height: 200, borderStyle: 'solid', borderColor: 'white', borderWidth: 5}}>
            トークンID {character.id} <br/>
            {(levelPoint > 0)&(thisCharacter === character.id) ?
                <>レベル {character.level + levelPoint}( +{levelPoint}.Lv )<br/></>
                : <>レベル {character.level}.Lv<br/></>
            }
            属性: {character.characterType}
        </Paper>
    </>)
}

function PlayerYou({opponentCharacters}){
    opponentCharacters = [1,2,3,4]
    const randomSlot = 'a'
    opponentCharacters.push(randomSlot)
    return(<>
        <Container style={{padding: 10}}>
            <div style={{ textAlign: 'right', verticalAlign: 'middle'}}>
                <div>プレイヤーB <Chip label="Lv.120" style={{fontSize: 20}} /></div>
                <img src={Icon}  alt="アイコン" width="60" height="60"/>
            </div>
            <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
                {opponentCharacters.map((character, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard character={character}/>
                </Grid>
                ))}
            </Grid>
        </Container>
    </>)
}

function PlayerI({myCharactors, thisCharacter, setThisCharacter, totalLevelPoint, levelPoint, setLevelPoint, randomSlot}){
    return(<>
    <Container style={{padding: 10}}>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {myCharactors.map((myCharactor, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard character={myCharactor}
                        thisCharacter={thisCharacter} setThisCharacter={setThisCharacter} levelPoint={levelPoint} />
                </Grid>
            ))}
            {/* TODO: 描画の方が先に走ってしまうから randomSlot が undefined になってる (多分) */}
            {/* <Grid item xs={2} sm={2} md={2} key={myCharactors.length}>
                <NFTCharactorCard character={randomSlot}
                    thisCharacter={thisCharacter} setThisCharacter={setThisCharacter} levelPoint={levelPoint} />
            </Grid> */}
        </Grid>
        <div style={{marginLeft: 'auto', marginRight: 0, marginTop: 10}}>
            プレイヤーA
        </div>

        <Box sx={{ width: '80%' }}>
            トークン{thisCharacter}にレベルを付与する
            <Slider
                aria-label="Temperature"
                defaultValue={0}
                onChange={(e) => setLevelPoint(e.target.value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={totalLevelPoint}
            />
        </Box>
    </Container>
    </>)
}

const UrgeWithPleasureComponent = () => (
    <CountdownCircleTimer
        isPlaying
        duration={30}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        strokeWidth={20}
    >
        {({ remainingTime }) => <div style={{fontSize: 50, fontWeight: 700}}>{ remainingTime }</div>}
    </CountdownCircleTimer>
)

export default function BattleMain(){
    const [thisCharacter, setThisCharacter] = useState();
    const totalLevelPoint = 10;
    const [levelPoint, setLevelPoint] = useState(0);
    const myCharacters = useSelector(selectMyCharacter);

    const [myPlayerId, setMyPlayerId] = useState();
    // const [myCharacters, setMyCharacters] = useState();
    // const [opponentCharacters, setOpponentCharacters] = useState();
    const [myPlayerSeed, setMyPlayerSeed] = useState();
    const [nonce, setNonce] = useState();
    const [mod, setMod] = useState();
    const [randomSlot, setRandomSlot] = useState();
    const [myBlindingFactor, setMyBlindingFactor] = useState();

    // for debug
    const addressIndex = 2;
    const [COMPlayerSeed, setCOMPlayerSeed] = useState();
    const [nonceCOM, setNonceCOM] = useState();
    const [randomSlotCOM, setRandomSlotCOM] = useState();

    const [choice, setChoice] = useState(0);
    const [round, setRound] = useState(0);
    const [committed, setCommitted] = useState(false);
    const [isCOM, setIsCOM] = useState(false);

    useEffect(() => {
        console.log({自分のキャラ: myCharacters.charactersList});
        console.log("読み込み中........");
    },[thisCharacter]);

    useEffect(() => {(async function() {
        const tmpMyPlayerId = await getPlayerIdFromAddress();
        setMyPlayerId(tmpMyPlayerId);

        const tmpMyPlayerSeed = getRandomBytes32();
        setMyPlayerSeed(tmpMyPlayerSeed);

        // setMyCharacters(await getFixedSlotCharacterInfo(tmpMyPlayerId));
        // setOpponentCharacters(await getFixedSlotCharacterInfo(1-tmpMyPlayerId));

        try {
            await commitPlayerSeed(tmpMyPlayerId, tmpMyPlayerSeed);
        } catch (e) {
            // TODO: Error handling
        }

        const tmpNonce = await getNonce(tmpMyPlayerId);
        setNonce(tmpNonce);
        // const tmpMod = await totalSupply();
        const tmpMod = await getTotalSupplyAtBattleStart();
        setMod(tmpMod);
        // setHoge で設定したやつは useEffect が終わるまで更新されない…
        setRandomSlot(await getMyRandomSlot(tmpMyPlayerId, tmpNonce, tmpMyPlayerSeed, tmpMod));


        // const tmpCOMPlayerSeed = getRandomBytes32();
        // setCOMPlayerSeed(tmpCOMPlayerSeed);
        // try {
        //     await commitPlayerSeed(1-tmpMyPlayerId, tmpCOMPlayerSeed, addressIndex);
        // } catch (e) {
        //     // TODO: Error handling
        // }
        // const tmpNonceCOM = await getNonce(1-tmpMyPlayerId, addressIndex);
        // setNonce(tmpNonceCOM);
        // setRandomSlotCOM(await getMyRandomSlot(1-tmpMyPlayerId, tmpNonceCOM, tmpCOMPlayerSeed, tmpMod, addressIndex));
    })();}, []);

    useEffect(() => {(async function() {
        // for debug
        if (isCOM) {
            const tmpCOMPlayerSeed = getRandomBytes32();
            setCOMPlayerSeed(tmpCOMPlayerSeed);
            try {
                await commitPlayerSeed(1-myPlayerId, tmpCOMPlayerSeed, addressIndex);
            } catch (e) {
                // TODO: Error handling
            }
            const tmpNonceCOM = await getNonce(1-myPlayerId, addressIndex);
            setNonce(tmpNonceCOM);
            setRandomSlotCOM(await getMyRandomSlot(1-myPlayerId, tmpNonceCOM, tmpCOMPlayerSeed, mod, addressIndex));
        }
    })();}, [isCOM]);

    useEffect(() => {
        playerSeedCommitted();
        playerSeedRevealed();
        // choiceCommitted();
        choiceRevealed();
        roundResult();
        battleResult();
        battleCanceled();
    }, []);

    const navigate = useNavigate();
    async function devHandleFinishBattle () {
        await defeatByFoul();
        navigate('../');
    }

    // for debug
    async function handleCommitCOM() {
        const blindingFactor = getRandomBytes32();
        await commitChoice(1-myPlayerId, levelPoint, choice, blindingFactor, addressIndex);
        if (choice === 4) {
            await revealPlayerSeed(1-myPlayerId, COMPlayerSeed, addressIndex);
        }
        try {
            await revealChoice(1-myPlayerId, levelPoint, choice, blindingFactor, addressIndex);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleCommit() {
        const blindingFactor = getRandomBytes32();
        await commitChoice(myPlayerId, levelPoint, choice, blindingFactor);
        setMyBlindingFactor(blindingFactor);

        choiceCommitted(1-myPlayerId, round, setCommitted);
        if (isCOM) {
            await handleCommitCOM();
        }
    }

    useEffect(() => {(async function() {
        if (committed) {
            if (choice === 4) {
                await revealPlayerSeed(myPlayerId, myPlayerSeed);
            }
            try {
                await revealChoice(myPlayerId, levelPoint, choice, myBlindingFactor);
            } catch (err) {
                console.log(err);
            }
            setChoice(choice + 1);
            setRound(round + 1);
            setCommitted(false);
        }
    })();}, [committed]);

    return(<>
    <Button variant="contained" size="large" color="secondary" onClick={() => devHandleFinishBattle() }>
        バトルを終了する
    </Button>
    <Button variant="contained" size="large" color="secondary" onClick={() => setIsCOM((isCOM) => !isCOM)}>
        COMと対戦: {isCOM ? "YES" : "NO"}
    </Button>
    <Grid container spacing={10} style={{margin: 10}} columns={{ xs: 10, sm: 10, md: 10 }}>
        <Grid item xs={10} md={6}>
            <Container style={{backgroundColor: '#EDFFBE', marginBottom: '10%'}}>
                <PlayerYou/>
                <div style={{height: 100}}/>
                <PlayerI myCharactors={myCharacters.charactersList} thisCharacter={thisCharacter} setThisCharacter={setThisCharacter}
                        totalLevelPoint={totalLevelPoint} levelPoint={levelPoint} setLevelPoint={setLevelPoint} randomSlot={randomSlot}/>
            </Container>
        </Grid>
        <Grid item xs={10} md={3}>
            <div style={{textAlign: 'center', fontSize: 20, marginBottom: 30}}>残り時間</div>
            <div style={{textAlign: 'center'}}>
                <div style={{display: 'inlineBlock'}}>
                    <UrgeWithPleasureComponent/>
                </div>
            </div>
            <Card variant="outlined" style={{marginRight: 20, padding: 10}}>
                <Grid container spacing={3}>
                    <Grid item xs={4} md={4}></Grid>
                    <Grid item xs={4} md={4}>自分</Grid>
                    <Grid item xs={4} md={4}>相手</Grid>

                    <Grid item xs={4} md={4}>1戦目</Grid>
                    <Grid item xs={4} md={4}>✖️</Grid>
                    <Grid item xs={4} md={4}>◯</Grid>

                    <Grid item xs={4} md={4}>2戦目</Grid>
                    <Grid item xs={4} md={4}>◯</Grid>
                    <Grid item xs={4} md={4}>✖️</Grid>

                    <Grid item xs={4} md={4}>3戦目</Grid>
                    <Grid item xs={4} md={4}>◯</Grid>
                    <Grid item xs={4} md={4}>✖️</Grid>

                    <Grid item xs={4} md={4}>4戦目</Grid>
                    <Grid item xs={4} md={4}>✖️</Grid>
                    <Grid item xs={4} md={4}>◯</Grid>

                    <Grid item xs={4} md={4}>5戦目</Grid>
                    <Grid item xs={4} md={4}>◯</Grid>
                    <Grid item xs={4} md={4}>✖️</Grid>
                </Grid>
            </Card>
        </Grid>

        {thisCharacter &&
            <Fab variant="extended" style={ handleButtonStyle() } color="primary" aria-label="add" onClick={() => handleCommit()}>
                勝負するキャラクターを確定する
            </Fab>
        }
    </Grid>
    </>)
}
