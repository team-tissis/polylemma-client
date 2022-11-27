import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'assets/icons/avatar_1.png'
import { selectMyCharacter, notInBattleVerifyCharacters, choiceCharacterInBattle, setMyPlayerSeed } from 'slices/myCharacter.ts';
import { selectRoundResult, oneRoundDone } from 'slices/roundResult.ts';
import { getRandomBytes32 } from 'fetch_sol/utils.js';
import { isInBattle } from 'fetch_sol/match_organizer.js';
import { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, reportLateReveal, playerSeedIsRevealed,
         getBattleState, getPlayerState, getRemainingLevelPoint, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getCharsUsedRounds, getPlayerIdFromAddr, getCurrentRound, getMaxLevelPoint, getRoundResults, getBattleResult,
         forceInitBattle,
         eventBattleStarted, eventPlayerSeedCommitted, eventPlayerSeedRevealed, eventChoiceCommitted, eventChoiceRevealed,
         eventRoundCompleted, eventBattleCompleted,
         eventExceedingLevelPointCheatDetected, eventReusingUsedSlotCheatDetected,
         eventLatePlayerSeedCommitDetected, eventLateChoiceCommitDetected, eventLateChoiceRevealDetected,
         eventBattleCanceled } from 'fetch_sol/battle_field.js';
import characterInfo from "assets/character_info.json";

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

function CharacterCard({character, charUsedRounds, isOpponent, listenToRoundRes, choice, setChoice, opponentRandomSlotState}){
    const isRS = character.isRandomSlot;
    const isSecret = isOpponent && isRS && (opponentRandomSlotState !== 2);
    const characterAttribute = isSecret ? null : characterInfo.attributes[character.attributeIds[0]];
    const characterType = isSecret ? null : characterInfo.characterType[character.characterType];
    const isBattleDone = charUsedRounds === undefined ? false : charUsedRounds[character.index] > 0;

    const cardColor = isSecret ? 'grey' : characterAttribute["backgroundColor"];
    const levelColor = isBattleDone ? (isOpponent ? 'gray' : 'silver')
                       : ((character.index === choice) ? (isRS ? '#FFD700' : '#FFAD90')
                       : (isRS ? '#FFFF66' : '#FFDBC9'));
    const levelBorderColor = isOpponent ? 'silver' : (character.index === choice) ? 'red' : 'grey';

    function handleCharacterChoice() {
        if(isOpponent){ return }
        if(isBattleDone){ return }
        if(listenToRoundRes === 'freeze'){ return }
        setChoice(character.index);
    }

    return(<>
        <div className="card_parent" style={{backgroundColor: cardColor}} onClick={ () => handleCharacterChoice() } >
            {!isSecret &&
            <div className="card_name">
                { character.name }
            </div>
            }

            <div className="box" style={{padding: 10, backgroundColor: levelColor, fontSize: 14, borderColor: levelBorderColor}}>
                レベル: { character.level }
                {!isRS && <>
                <br/>
                絆レベル: { character.bondLevel }
                </>}
            </div>

            {!isSecret &&
            <div className="character_type_box"
                style={{backgroundColor: characterType['backgroundColor'], borderColor: characterType['borderColor']}}>
                { characterType['jaName'] }
            </div>
            }

            {!isSecret ?
            <div className="img_box">
                <img className='img_div' src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="card"/>
            </div>
            :
            <div className="img_box" style={{justifyContent: 'center'}}>
                <div style={{paddingTop: '30px'}}>Secret</div>
            </div>
            }

            {!isSecret &&
            <div className="attribute_box">
                レア度 {character.rarity}<br/>
                { characterAttribute["title"] }
            </div>
            }

            <div className="detail_box">
                {!isSecret &&
                <div style={{margin: 10}}>
                    { characterAttribute["description"] }
                </div>
                }
            </div>
        </div>
    </>)
}

function PlayerYou({characters, charsUsedRounds, opponentRandomSlotState, remainingLevelPoint, maxLevelPoint}){
    const opponentTotalLevels = characters.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.level;
    }, 0);
    return(<>
        <Container style={{padding: 5}}>
            <div style={{ textAlign: 'right', verticalAlign: 'middle'}}>
                <div>相手 <Chip label={`Lv.${opponentTotalLevels}`} style={{fontSize: 20}} /></div>
                <img src={Icon}  alt="アイコン" width="60" height="60"/>
            </div>
            <div>残りレベルポイント: { remainingLevelPoint } / { maxLevelPoint }</div>
            <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
                {characters.map((character, index) => (
                    <Grid item xs={2} sm={2} md={2} key={index}>
                        <CharacterCard key={index} character={character} charUsedRounds={charsUsedRounds} isOpponent={true} opponentRandomSlotState={opponentRandomSlotState}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </>)
}

function PlayerI({characters, charsUsedRounds, listenToRoundRes, choice, setChoice, remainingLevelPoint, maxLevelPoint, setLevelPoint}){
    const myTotalLevels = characters.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.level;
    }, 0);

    const marks = [];
    for (let lp = 0; lp <= remainingLevelPoint; lp++) {
        marks.push({ value: lp, label: lp });
    }

    return(<>
    <Container style={{padding: 5}}>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {characters.map((character, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <CharacterCard key={index} character={character} charUsedRounds={charsUsedRounds} isOpponent={false}
                        listenToRoundRes={listenToRoundRes} choice={choice} setChoice={setChoice}/>
                </Grid>
            ))}
        </Grid>

        <Box sx={{ width: '80%' }}>
            このトークンにレベルを付与する
            <div>残りレベルポイント: { remainingLevelPoint } / { maxLevelPoint }</div>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <Slider
                    aria-label="Temperature"
                    defaultValue={0}
                    onChange={(e) => setLevelPoint(e.target.value)}
                    valueLabelDisplay="auto"
                    step={null}
                    marks={marks}
                    min={0}
                    max={maxLevelPoint}
                    disabled={listenToRoundRes === 'freeze'}
                />
            </Stack>
        </Box>

        <div>自分 <Chip label={`Lv.${myTotalLevels}`} style={{marginLeft: 'auto', marginRight: 0, marginTop: 10}} /></div>
        <img src={Icon}  alt="アイコン" width="60" height="60"/>
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

    const [levelPoint, setLevelPoint] = useState(0);

    const myInfo = useSelector(selectMyCharacter);
    const roundResultList = useSelector(selectRoundResult);

    const [myPlayerId, setMyPlayerId] = useState();
    const [myBlindingFactor, setMyBlindingFactor] = useState();

    const [myCharacters, setMyCharacters] = useState([]);
    const [opponentCharacters, setOpponentCharacters] = useState([]);

    // for debug
    const addressIndex = 2;
    const [COMPlayerSeed, setCOMPlayerSeed] = useState();

    const [choice, setChoice] = useState(0);
    // COMPUTER側の選択したキャラ
    const [comChoice, setComChoice] = useState(-1);
    const [round, setRound] = useState(0);
    const [opponentCommit, setOpponentCommit] = useState(false);
    const [myCommit, setMyCommit] = useState(false);
    const [mySeedRevealed, setMySeedRevealed] = useState(false);
    const [isCOM, setIsCOM] = useState(false);
    const [listenToRoundRes, setListenToRoundRes] = useState('can_choice');
    const [roundDetail, setRoundDetail] = useState(null);
    const [myRemainingLevelPoint, setMyRemainingLevelPoint] = useState(0);
    const [myMaxLevelPoint, setMyMaxLevelPoint] = useState(0);
    const [opponentRemainingLevelPoint, setOpponentRemainingLevelPoint] = useState(0);
    const [opponentMaxLevelPoint, setOpponentMaxLevelPoint] = useState(0);
    const [battleDetail, setBattleDetail] = useState(null);

    const [myCharsUsedRounds, setMyCharsUsedRounds] = useState();
    const [opponentCharsUsedRounds, setOpponentCharsUsedRounds] = useState();
    const [myRandomSlotState, setMyRandomSlotState] = useState(-1);
    const [opponentRandomSlotState, setOpponentRandomSlotState] = useState(-1);

    const [myStatus, setMyStatus] = useState(-1);
    const [opponentStatus, setOpponentStatus] = useState(-1);

    useEffect(() => {
        console.log("commit and reveal........");
    },[listenToRoundRes]);

    useEffect(() => {
        // reduxに結果を反映
        if(roundDetail != null){
            dispatch(oneRoundDone(roundDetail));
        }
    },[roundDetail]);

    useEffect(() => {(async function() {
        const _myPlayerId = await getPlayerIdFromAddr();
        setMyPlayerId(_myPlayerId);

        const currentRound = await getCurrentRound();
        setRound(currentRound);
        const _myCharsUsedRounds = await getCharsUsedRounds(_myPlayerId);
        setMyCharsUsedRounds(_myCharsUsedRounds);
        setOpponentCharsUsedRounds(await getCharsUsedRounds(1-_myPlayerId));

        setMyRemainingLevelPoint(await getRemainingLevelPoint(_myPlayerId));
        setMyMaxLevelPoint(await getMaxLevelPoint(_myPlayerId));
        setOpponentRemainingLevelPoint(await getRemainingLevelPoint(1-_myPlayerId));
        setOpponentMaxLevelPoint(await getMaxLevelPoint(1-_myPlayerId));

        const _myRandomSlotState = await playerSeedIsRevealed(_myPlayerId);
        setMyRandomSlotState(_myRandomSlotState);

        const _opponentRandomSlotState = await playerSeedIsRevealed(1-_myPlayerId);
        setOpponentRandomSlotState(_opponentRandomSlotState);
        if (_opponentRandomSlotState === 2) {
            const opponentRandomSlot = await getRandomSlotCharInfo(1-_myPlayerId);
            setOpponentCharacters((character) => {
                character[4] = opponentRandomSlot;
                return character;
            });
        }

        eventChoiceCommitted(1-_myPlayerId, currentRound, setOpponentCommit);
        eventChoiceRevealed(1-_myPlayerId, currentRound, setOpponentStatus);

        if (isCOM) {
            const _COMPlayerSeed = getRandomBytes32();
            setCOMPlayerSeed(_COMPlayerSeed);
            try {
                await commitPlayerSeed(1-_myPlayerId, _COMPlayerSeed, addressIndex);
            } catch (e) {
                console.log(e);
            }
            setComChoice(getNextComIndex());
        }

        if (_myRandomSlotState >= 1) { // 自分の seed がコミットし終わっていたら
            const opponentFixedSlotCharInfo = await getFixedSlotCharInfo(1-_myPlayerId, addressIndex);
            // 相手の RS のレベルは書くキャラクタレベルのうち最大
            const opponentRSLevel = opponentFixedSlotCharInfo.reduce((accumulator, currentValue) => {
                return Math.max(accumulator, currentValue.level);
            }, 0);
            // 相手の RS のわからない情報は null にしておく
            const opponentRandomSlot = {
                index: 4, name: null, imgURI: null, characterType: null, level: opponentRSLevel,
                bondLevel: null, rarity: null, attributeIds: null, isRandomSlot: true, battleDone: false
            };
            setOpponentCharacters([...opponentFixedSlotCharInfo, opponentRandomSlot]);

            const myFixedSlotCharInfo = await getFixedSlotCharInfo(_myPlayerId);
            const myRandomSlot = await getMyRandomSlot(_myPlayerId, myInfo.myPlayerSeed);
            setMyCharacters([...myFixedSlotCharInfo, myRandomSlot]);
        }

        for (let nextIndex = 0; nextIndex < _myCharsUsedRounds; nextIndex++) {
            if(_myCharsUsedRounds[nextIndex] === 0){
                setChoice(nextIndex);
                break;
            }
        }
    })();}, []);

    const navigate = useNavigate();
    useEffect(() => {(async function() {
        if (await isInBattle() === false) {
            navigate('../');
        }

        // for debug
        if (isCOM) {
            const _COMPlayerSeed = getRandomBytes32();
            setCOMPlayerSeed(_COMPlayerSeed);
            try {
                await commitPlayerSeed(1-myPlayerId, _COMPlayerSeed, addressIndex);
            } catch (e) {
                console.log(e);
            }
            setComChoice(getNextComIndex());
        }
    })();}, [isCOM]);

    useEffect(() => {
        eventPlayerSeedCommitted();
        eventPlayerSeedRevealed();
        eventBattleCompleted(battleDetail, setBattleDetail);
        eventExceedingLevelPointCheatDetected();
        eventReusingUsedSlotCheatDetected();
        eventLatePlayerSeedCommitDetected();
        eventLateChoiceCommitDetected();
        eventLateChoiceRevealDetected();
        eventBattleCanceled();
    }, []);

    async function handleForceInitBattle () {
        dispatch(notInBattleVerifyCharacters());
        await forceInitBattle();
        navigate('../');
    }

    function getNextComIndex(){
        // comChoiceをランダムに更新
        var UnusedIndexes = [];
        for (let idx = 0; idx < opponentCharsUsedRounds.length; idx++) {
            if(idx !== comChoice && opponentCharsUsedRounds[idx] === 0){
                UnusedIndexes.push(idx);
            }
        }

        const _nextComChoice = Math.floor( Math.random() * UnusedIndexes.length );
        return UnusedIndexes[_nextComChoice];
    }

    async function handleSeedCommit () {
        const _myRandomSlotState = await playerSeedIsRevealed(myPlayerId);
        setMyRandomSlotState(1); // うまくいくんかわからん

        // リロードしてモンスターが変わらないように修正
        if(_myRandomSlotState === 0){
            const myPlayerSeed = myInfo.myPlayerSeed == null ? getRandomBytes32() : myInfo.myPlayerSeed;

            // seedが登録されていない場合、登録する
            if(myInfo.myPlayerSeed == null){
                dispatch(setMyPlayerSeed(myPlayerSeed));
            }

            const opponentFixedSlotCharInfo = await getFixedSlotCharInfo(1-myPlayerId);
            // 相手の RS のレベルは書くキャラクタレベルのうち最大
            const opponentRSLevel = opponentFixedSlotCharInfo.reduce((accumulator, currentValue) => {
                return Math.max(accumulator, currentValue.level);
            }, 0);
            // 相手の RS のわからない情報は null にしておく
            const opponentRandomSlot = {
                index: 4, name: null, imgURI: null, characterType: null, level: opponentRSLevel,
                bondLevel: null, rarity: null, attributeIds: null, isRandomSlot: true, battleDone: false
            };
            setOpponentCharacters([...opponentFixedSlotCharInfo, opponentRandomSlot]);

            const myFixedSlotCharInfo = await getFixedSlotCharInfo(myPlayerId);
            try {
                await commitPlayerSeed(myPlayerId, myPlayerSeed);
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
            const myRandomSlot = await getMyRandomSlot(myPlayerId, myPlayerSeed);
            setMyCharacters([...myFixedSlotCharInfo, myRandomSlot]);
        }

        setMyRandomSlotState(await playerSeedIsRevealed(myPlayerId));
    }

    // for debug
    async function handleChoiceCommitCOM() {
        // 以下、choice => comChoiceに変更
        const blindingFactor = getRandomBytes32();
        try {
            await commitChoice(1-myPlayerId, levelPoint, comChoice, blindingFactor, addressIndex);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
        if (comChoice === 4) {
            try {
                await revealPlayerSeed(1-myPlayerId, COMPlayerSeed, addressIndex);
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
        }
        try {
            await revealChoice(1-myPlayerId, levelPoint, comChoice, blindingFactor, addressIndex);
            setComChoice(getNextComIndex(comChoice));
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
    }

    async function handleChoiceCommit() {
        setListenToRoundRes('freeze');
        // reduxに保存して、使ったことのないものを使用する
        const blindingFactor = getRandomBytes32();
        try {
            await commitChoice(myPlayerId, levelPoint, choice, blindingFactor);

            setMyBlindingFactor(blindingFactor);
            // 次に自動選択するindexを調べてstateを変更する
            let nextIndex;
            for (nextIndex = 0; nextIndex < myCharsUsedRounds.length; nextIndex++) {
                if(nextIndex !== choice && myCharsUsedRounds[nextIndex] === 0){
                    break;
                }
            }
            eventRoundCompleted(round, nextIndex, setListenToRoundRes, setChoice, setRoundDetail);

            setMyCommit(true);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }

        if (isCOM) {
            await handleChoiceCommitCOM();
        }
    }

    async function handleSeedReveal() {
        try {
            await revealPlayerSeed(myPlayerId, myInfo.myPlayerSeed);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
        setMySeedRevealed(true);
    }

    async function handleChoiceReveal() {
        setMySeedRevealed(false);
        try {
            await revealChoice(myPlayerId, levelPoint, choice, myBlindingFactor);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
        setMyStatus(2);
    }

    useEffect(() => {(async function() {
        if (myStatus === 2 && opponentStatus === 2) {
            // この辺は両者の commit の reveal が終わってからじゃないといけないかも
            const nextRound = await getCurrentRound();
            eventChoiceCommitted(1-myPlayerId, nextRound, setOpponentCommit);
            eventChoiceRevealed(1-myPlayerId, nextRound, setOpponentStatus);
            setRound(nextRound);
            setOpponentCommit(false);
            setMyCommit(false);
            setMyCharsUsedRounds(await getCharsUsedRounds(myPlayerId));
            setOpponentCharsUsedRounds(await getCharsUsedRounds(1-myPlayerId));
            setMyRemainingLevelPoint(await getRemainingLevelPoint(myPlayerId));
            setOpponentRemainingLevelPoint(await getRemainingLevelPoint(1-myPlayerId));

            const _opponentRandomSlotState = await playerSeedIsRevealed(1-myPlayerId);
            if (_opponentRandomSlotState === 2) {
                const opponentRandomSlot = await getRandomSlotCharInfo(1-myPlayerId);
                setOpponentCharacters((character) => {
                    character[4] = opponentRandomSlot;
                    return character;
                });
            }
            setOpponentRandomSlotState(_opponentRandomSlotState);

            setLevelPoint(0);

            setMyStatus(0);
            setOpponentStatus(0);
        }
    })();}, [myStatus, opponentStatus]);

    return(<>
    <Button variant="contained" size="large" color="secondary" onClick={() => handleForceInitBattle() }>
        バトルの状態をリセットする
    </Button>
    <div>※：バグ等でバトルがうまく進まなくなったり、マッチングができなくなったら押してください。</div>
    <Button variant="contained" size="large" color="secondary" onClick={() => setIsCOM((isCOM) => !isCOM)}>
        COMと対戦: {isCOM ? "YES" : "NO"}
    </Button>
    <div>ラウンド {round+1}</div>
    <Grid container spacing={5} style={{margin: 5}} columns={{ xs: 10, sm: 10, md: 10 }}>
        <Grid item xs={10} md={7}>
            <Container style={{backgroundColor: '#EDFFBE', marginBottom: '10%'}}>
                [dev]左から数えて {comChoice} 番目のトークンが選択されました。
                <PlayerYou characters={opponentCharacters} charsUsedRounds={opponentCharsUsedRounds} opponentRandomSlotState={opponentRandomSlotState}
                           remainingLevelPoint={opponentRemainingLevelPoint} maxLevelPoint={opponentMaxLevelPoint}/>
                <div style={{height: 100}}/>
                [dev]レベルポイント {levelPoint}<br/>
                [dev]保存したmyPlayerSeed: { myInfo.myPlayerSeed }<br/>
                [dev]左から数えて {choice} 番目のトークンが選択されました。

                <PlayerI characters={myCharacters} charsUsedRounds={myCharsUsedRounds}
                         listenToRoundRes={listenToRoundRes} choice={choice} setChoice={setChoice}
                         remainingLevelPoint={myRemainingLevelPoint} maxLevelPoint={myMaxLevelPoint} setLevelPoint={setLevelPoint} />
            </Container>
        </Grid>
        <Grid item xs={10} md={2}>
            {/* <div style={{textAlign: 'center', fontSize: 20, marginBottom: 30}}>残り時間</div>
            <div style={{textAlign: 'center'}}>
                <div style={{display: 'inlineBlock'}}>
                    <UrgeWithPleasureComponent/>
                </div>
            </div> */}
            <Card variant="outlined" style={{marginRight: 20, padding: 10}}>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={6}></Grid>
                    <Grid item xs={6} md={6}>攻撃力</Grid>
                    <Grid item xs={3} md={3}>ラウンド</Grid>
                    <Grid item xs={3} md={3}>勝敗</Grid>
                    <Grid item xs={3} md={3}>自分</Grid>
                    <Grid item xs={3} md={3}>相手</Grid>
                    {roundResultList.resultList.map((roundResult, index) => (
                        <>
                            <Grid item xs={3} md={3}>{roundResult.numRounds + 1}</Grid>
                            <Grid item xs={3} md={3}>{roundResult.isDraw ? <>△</> : (myPlayerId === roundResult.winner) ? <>○</> : <>×</>}</Grid>
                            <Grid item xs={3} md={3}>{(myPlayerId === roundResult.winner) ? roundResult.winnerDamage : roundResult.loserDamage}</Grid>
                            <Grid item xs={3} md={3}>{(myPlayerId === roundResult.winner) ? roundResult.loserDamage : roundResult.winnerDamage}</Grid>
                        </>
                    ))}
                </Grid>
            </Card>
            {battleDetail &&
            <Card variant="outlined" style={{marginRight: 20, padding: 10}}>
                <Grid container spacing={3}>
                    <Grid item xs={4} md={4}>勝敗</Grid>
                    <Grid item xs={4} md={4}>自分</Grid>
                    <Grid item xs={4} md={4}>相手</Grid>

                    <Grid item xs={4} md={4}>{battleDetail.isDraw ? <>△</> : (myPlayerId === battleDetail.winner) ? <>○</> : <>×</>}</Grid>
                    <Grid item xs={4} md={4}>{(myPlayerId === battleDetail.winner) ? battleDetail.winnerCount : battleDetail.loserCount}</Grid>
                    <Grid item xs={4} md={4}>{(myPlayerId === battleDetail.winner) ? battleDetail.loserCount : battleDetail.winnerCount}</Grid>
                </Grid>
            </Card>
            }

            <Grid item xs={10} md={10}>
                <h2>バトル方法</h2><hr/>

                <h2>手順<hr style={{margin: 0, padding: 0}}/></h2>
                <p>「バトルを開始する」ボタンを押すとバトルが開始する</p>
                <p>「勝負するキャラクターを確定する」ボタンを押すと各ラウンドで使用するキャラが確定する（それ以降は変更不可）</p>
                <p>ランダムスロットを選択した場合、「ランダムスロットを公開する」ボタンを押すとランダムスロットが使用可能になる</p>
                <p>「バトル結果を見る」ボタンを押すとバトルの実行結果が勝敗表に反映される</p>

                <h2>勝敗の決定<hr style={{margin: 0, padding: 0}}/></h2>
                <p>攻撃力が大きい方が勝負に勝利できます。</p>
                <p>レベル: 基本的にはレベルによってキャラの攻撃力が決まります。</p>
                <p>絆レベル: 獲得したキャラの保有期間が長ければ長いほど、絆レベルは上昇していきます。（上限は自分のレベル数の二倍）</p>
                <p>絆レベルが高いほど攻撃力が増加します。（ただし、必ず攻撃力が上がるわけではありません。）</p>
                <p>属性: 炎 / 草 / 水の3種類があり、じゃんけんのような相性があります。</p>
                <p>特性: 表示されている効果が発動され、攻撃力が上昇したりします。</p>
                <p>その他: ランダムスロットを使うことができ、レベルポイントも追加できます。</p>

                <h2>ランダムスロット<hr style={{margin: 0, padding: 0}}/></h2>
                <p>レベル: 使っているキャラのレベルの平均値が設定されます。</p>
                <p>絆レベル: ありません。</p>

                <h2>レベルポイント<hr style={{margin: 0, padding: 0}}/></h2>
                <p>5 ラウンドで、合計で使っているキャラのレベルの最大値まで与えることができます。</p>
                <p>一つのラウンドで全てのレベルポイントを使うことも可能です。</p>
                <p>レベルポイントはレベルと同じように攻撃力に加算されます。</p>
            </Grid>
        </Grid>

        {myRandomSlotState === 0 &&
            <Button variant="contained" size="large" style={ handleButtonStyle() } color="primary" aria-label="add" onClick={() => handleSeedCommit() }>
                バトルを開始する
            </Button>
        }

        {battleDetail == null && myCharacters.length !== 0 && choice != null && listenToRoundRes !== 'freeze' &&
            <Button variant="contained" size="large" style={ handleButtonStyle() } color="secondary" aria-label="add" onClick={() => handleChoiceCommit()}>
                勝負するキャラクターを確定する
            </Button>
        }

        {battleDetail == null && opponentCommit && myCommit && !mySeedRevealed && choice === 4 &&
            <Button variant="contained" size="large" style={ handleButtonStyle() } color="info" aria-label="add" onClick={() => handleSeedReveal()}>
                ランダムスロットを公開する
            </Button>
        }

        {battleDetail == null && opponentCommit && myCommit && (choice !== 4 || (choice === 4 && mySeedRevealed)) &&
            <Button variant="contained" size="large" style={ handleButtonStyle() } color="primary" aria-label="add" onClick={() => handleChoiceReveal()}>
                バトル結果を見る
            </Button>
        }
    </Grid>
    </>)
}
