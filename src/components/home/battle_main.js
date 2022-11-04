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
import { selectMyCharacter, addRandomSlotToCurrentMyCharacter, notInBattleVerifyCharacters, choiceCharacterInBattle } from '../../slices/myCharacter.ts';
import { selectBattleStatus, setOneBattle } from '../../slices/battle.ts';
import { useSelector, useDispatch } from 'react-redux';
import { getRandomBytes32 } from '../../fetch_sol/utils.js';
import { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo, getPlayerIdFromAddress,
         battleStarted, playerSeedCommitted, playerSeedRevealed, choiceCommitted, choiceRevealed, roundResult, battleResult, battleCanceled } from '../../fetch_sol/battle_field.js';
import { defeatByFoul } from '../../fetch_sol/test/match_organizer_test.js';
import characterInfo from "./character_info.json";

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
function NFTCharactorCard({choice, setChoice, character, listenToRoundRes, thisCharacter, setThisCharacter, levelPoint}){
    // const _myCharacters = useSelector(selectMyCharacter);
    // listenToRoundRes == 'freeze'
    const thisCharacterAbility = character.abilityIds[0];
    const charaType = characterInfo.characterType[character.characterType];
    // const _myCharacters[]
    const _backgroundColor = (character.index == choice) ? 'grey' : 'white';
    const _isRandomSlot = character.isRandomSlot;
    const _thisCharacterBattleDone = character.battleDone;
    const _cardStyleColor = _isRandomSlot ? 'grey' : 'orange'

    function handleCharacterChoice() {
        if(listenToRoundRes == 'freeze'){
            return
        }
        if(_thisCharacterBattleDone){
            return
        }
        setChoice(character.index)
        setThisCharacter(character.id)
    }
    return(<>
        <div class="card_parent" style={{backgroundColor: characterInfo.attributes[thisCharacterAbility]["backgroundColor"]}} 
            onClick={() => handleCharacterChoice() } >
            <div class="card_name">
                キャラクター名をここに書く
            </div>
            <div class="box" style={{backgroundColor: _cardStyleColor, fontSize: 14}}>
                {(character.index == choice) ? <>
                    <p>{ character.level + levelPoint}</p>
                </> : <>
                    <p>{ character.level}</p>
                </>}
            </div>
            <div class="character_type_box"
                style={{backgroundColor: charaType['backgroundColor'], borderColor: charaType['borderColor']}}>
                { charaType['jaName'] }
            </div>
            <div class="img_box" style={{backgroundColor: _backgroundColor}}>
                <img className='img_div' style={{width: '100%', height: 'auto'}} src="https://www.picng.com/upload/sun/png_sun_7636.png" alt="sample"/>
            </div>
            <div class="attribute_box">
                { characterInfo.attributes[thisCharacterAbility]["title"] }
            </div>
            <div class="detail_box" style={{fontSize: 12}}>
                <div style={{margin: 10}}>
                    { characterInfo.attributes[thisCharacterAbility]["description"] }
                </div>
            </div>
        </div>
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
                    <Paper elevation={10} style={{backgroundColor: 'silver', height: 200, borderStyle: 'solid', borderColor: 'white', borderWidth: 5}}>
                        トークンID {character.id} <br/>
                        レベル {character.level}
                        属性: {character.characterType}
                    </Paper>
                    {/* <NFTCharactorCard character={character}/> */}
                </Grid>
                ))}
            </Grid>
        </Container>
    </>)
}

function PlayerI({myCharactors, thisCharacter, setThisCharacter, listenToRoundRes,  choice, setChoice, totalLevelPoint, levelPoint, setLevelPoint}){
    return(<>
    <Container style={{padding: 10}}>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {myCharactors.map((myCharactor, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard choice={choice} setChoice={setChoice} character={myCharactor}
                        listenToRoundRes={listenToRoundRes} thisCharacter={thisCharacter} setThisCharacter={setThisCharacter} levelPoint={levelPoint} />
                </Grid>
            ))}
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
    const dispatch = useDispatch();

    const [thisCharacter, setThisCharacter] = useState();
    const totalLevelPoint = 10;
    const [levelPoint, setLevelPoint] = useState(0);
    const myCharacters = useSelector(selectMyCharacter);

    const [myPlayerId, setMyPlayerId] = useState();
    // const [myCharacters, setMyCharacters] = useState();
    // const [opponentCharacters, setOpponentCharacters] = useState();
    const [myPlayerSeed, setMyPlayerSeed] = useState();
    const [myBlindingFactor, setMyBlindingFactor] = useState();

    // battleに出現させたキャラクターの順番の配列
    const battleStatus = useSelector(selectBattleStatus);

    // for debug
    const addressIndex = 2;
    const [COMPlayerSeed, setCOMPlayerSeed] = useState();
    const [randomSlotCOM, setRandomSlotCOM] = useState();

    const [choice, setChoice] = useState(null);
    const [nextIndex, setNextIndex] = useState(null);
    const [round, setRound] = useState(0);
    const [opponentCommit, setOpponentCommit] = useState(false);
    const [myCommit, setMyCommit] = useState(false);
    const [isCOM, setIsCOM] = useState(false);
    const [listenToRoundRes, setListenToRoundRes] = useState('can_choice');

    useEffect(() => {
        console.log("commit and reveal........");
    },[listenToRoundRes, choice]);

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

        // setHoge で設定したやつは useEffect が終わるまで更新されない…
        const _myRandomSlot = await getMyRandomSlot(tmpMyPlayerId, tmpMyPlayerSeed)
        // hasRandomSlot && 全てのキャラがRSでない
        if(myCharacters.hasRandomSlot){
            // DO NOTHING
        } else {
            // RSを追加する
            dispatch(addRandomSlotToCurrentMyCharacter(_myRandomSlot));
        }
        choiceCommitted(1-tmpMyPlayerId, round, setOpponentCommit);
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
            setRandomSlotCOM(await getMyRandomSlot(1-myPlayerId, tmpCOMPlayerSeed, addressIndex));
        }
    })();}, [isCOM]);

    useEffect(() => {
        playerSeedCommitted();
        playerSeedRevealed();
        // choiceCommitted();
        choiceRevealed();
        roundResult(setListenToRoundRes, setChoice, nextIndex);
        battleResult();
        battleCanceled();
    }, []);

    const navigate = useNavigate();
    async function devHandleFinishBattle () {
        dispatch(notInBattleVerifyCharacters());
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
        setListenToRoundRes('freeze')
        const blindingFactor = getRandomBytes32();
        await commitChoice(myPlayerId, levelPoint, choice, blindingFactor);
        setMyBlindingFactor(blindingFactor);
        // どのキャラを選んだか？の情報を追加
        dispatch(choiceCharacterInBattle(choice))
        // 次に自動選択するindexを調べてstateを変更する
        for (let step = 0; step < myCharacters.charactersList.length - 1; step++) {
            if(myCharacters.charactersList[step].battleDone == false){
                if(step != choice){
                    console.log(`${step}番目が次の出力です`)
                    setNextIndex(step)
                }
                break;
            }
        }
        setMyCommit(true);
        // 勝敗が決まるまでボタンを押せないようにする
        if (isCOM) {
            await handleCommitCOM();
        }
    }

    useEffect(() => {(async function() {
        if (opponentCommit && myCommit) {
            if (choice === 4) {
                await revealPlayerSeed(myPlayerId, myPlayerSeed);
            }
            try {
                await revealChoice(myPlayerId, levelPoint, choice, myBlindingFactor);
            } catch (err) {
                console.log(err);
            }
            choiceCommitted(1-myPlayerId, round+1, setOpponentCommit);
            setRound(round + 1);
            setOpponentCommit(false);
            setMyCommit(false);
        }
    })();}, [opponentCommit, myCommit]);

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
                [dev]左から数えて {choice} 番目のトークンが選択されました。
                <PlayerI myCharactors={myCharacters.charactersList} thisCharacter={thisCharacter} setThisCharacter={setThisCharacter}
                        listenToRoundRes={listenToRoundRes}
                        choice={choice} setChoice={setChoice} totalLevelPoint={totalLevelPoint} 
                        levelPoint={levelPoint} setLevelPoint={setLevelPoint} />
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
            <Fab variant="extended" style={ handleButtonStyle() } disabled={listenToRoundRes == 'freeze'} color="primary" aria-label="add" onClick={() => handleCommit()}>
                勝負するキャラクターを確定する
            </Fab>
        }
    </Grid>
    </>)
}
