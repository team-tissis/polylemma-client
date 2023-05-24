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
import HelpIcon from '@mui/icons-material/Help';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'assets/icons/avatar_1.png'
import { selectBattleInfo, setBattleId, setComputerInfo, setMyPlayerId, setMyPlayerSeed, setMyChoice, setMyLevelPoint, setChoiceUsed,
    setMyBlindingFactor, setBlindingFactorUsed, initializeBattle } from 'slices/battle.ts';
import { useSnackbar } from 'notistack';
import { getEnv, getRandomBytes32 } from 'fetch_sol/utils.js';
import { isInBattle } from 'fetch_sol/match_organizer.js';
import { commitPlayerSeed, revealPlayerSeed, commitChoice, revealChoice, reportLateOperation,
         getBattleState, getPlayerState, getRemainingLevelPoint, getFixedSlotCharInfo, getMyRandomSlot, getRandomSlotCharInfo,
         getCharsUsedRounds, getPlayerIdFromAddr, getCurrentRound, getMaxLevelPoint, getRoundResults, getBattleResult, getRandomSlotState, getRandomSlotLevel,
         forceInitBattle, getLatestBattle, 
         eventPlayerSeedCommitted, eventPlayerSeedRevealed, eventChoiceCommitted, eventChoiceRevealed,
         eventRoundCompleted, eventBattleCompleted,
         eventExceedingLevelPointCheatDetected, eventReusingUsedSlotCheatDetected,
         eventLatePlayerSeedCommitDetected, eventLateChoiceCommitDetected, eventLateChoiceRevealDetected,
         eventBattleCanceled } from 'fetch_sol/battle_field.js';
import { _COMCommitChoice, _COMRevealChoice, _COMRevealPlayerSeed } from 'fetch_sol/test/battle_field_test';
import characterInfo from "assets/character_info.json";
import LoadingDOM from 'components/applications/loading';
import HelpGuid from './helpGuid';
import BattleResultBoard from './BattleResultBoard';
import BattleResultTag from './BattleResultTag';

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
        fontWeight: 600,
        zIndex: 999
    }
}

function BattleCard({character, charUsedRounds, myRandomSlotState, isOpponent, isChoiceFrozen, choice, setChoice, opponentRandomSlotState}){
    const isRS = character.isRandomSlot;
    const isSecret = isOpponent && isRS && (opponentRandomSlotState !== 2);
    const characterAttribute = isSecret ? null : characterInfo.attributes[character.attributeIds[0]];
    const characterType = isSecret ? null : characterInfo.characterType[character.characterType];
    var isBattleDone = charUsedRounds === undefined ? false : charUsedRounds[character.index] > 0;
    if (isRS) {
        if (myRandomSlotState > 1) {
            isBattleDone = true
        }
    }

    const cardColor = isSecret ? 'grey' : characterAttribute["backgroundColor"];
    const levelColor = isBattleDone ? (isOpponent ? 'gray' : 'silver')
                       : ((character.index === choice) ? (isRS ? '#FFD700' : '#FFAD90')
                       : (isRS ? '#FFFF66' : '#FFDBC9'));
    const levelBorderColor = isOpponent ? 'silver' : (character.index === choice) ? 'red' : 'grey';

    function handleCharacterChoice() {
        if(isOpponent){ return }
        if(isBattleDone){ return }
        if(isChoiceFrozen){ return }
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

function PlayerYou({characters, charsUsedRounds, level, remainingLevelPoint, maxLevelPoint, opponentRandomSlotState}){
    return(<>
        <Container style={{padding: 5}}>
            <div style={{ textAlign: 'right', verticalAlign: 'middle'}}>
                <div>相手 <Chip label={`Lv. ${level}`} style={{fontSize: 20}} /></div>
                <img src={Icon}  alt="アイコン" width="60" height="60"/>
            </div>
            <div>残りレベルポイント: { remainingLevelPoint } / { maxLevelPoint }</div>
            <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
                {characters.map((character, index) => (
                    <Grid item xs={2} sm={2} md={2} key={index}>
                        <BattleCard key={index} character={character} charUsedRounds={charsUsedRounds} isOpponent={true} opponentRandomSlotState={opponentRandomSlotState}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </>)
}

function PlayerI({characters, charsUsedRounds, level, myRandomSlotState, remainingLevelPoint, maxLevelPoint, setLevelPoint, isChoiceFrozen, choice, setChoice}){
    const marks = [];
    for (let lp = 0; lp <= remainingLevelPoint; lp++) {
        marks.push({ value: lp, label: lp });
    }

    return(<>
    <Container style={{padding: 5}}>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {characters.map((character, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <BattleCard key={index} character={character} charUsedRounds={charsUsedRounds} myRandomSlotState={myRandomSlotState} isOpponent={false}
                        isChoiceFrozen={isChoiceFrozen} choice={choice} setChoice={setChoice}/>
                </Grid>
            ))}
        </Grid>

        <Box sx={{ width: '80%' }}>
            このトークンにレベルを付与する
            <div>残りレベルポイント: { remainingLevelPoint } </div>
            {
                (remainingLevelPoint != 0) && <>
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
                            disabled={isChoiceFrozen}
                        />
                    </Stack>
                </>
            }
        </Box>

        <div>自分 <Chip label={`Lv. ${level}`} style={{marginLeft: 'auto', marginRight: 0, marginTop: 10}} /></div>
        <img src={Icon}  alt="アイコン" width="60" height="60"/>
    </Container>
    </>)
}

export default function BattleMain(){
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const maxRounds = 5;
    
    const battleInfo = useSelector(selectBattleInfo);

    // ダイアログ管理のstate
    const [ helpGuidOpen, setHelpGuidOpen ] = useState(false);
    const [ battleResultBoardOpen , setBattleResultBoardOpen ] = useState(false)
    const [ battleResultDialog, setBattleResultDialog] = useState({result: false, result: null});

    const [choice, setChoice] = useState(0);
    const [levelPoint, setLevelPoint] = useState(0);

    // for debug
    const [addressIndex, setAddressIndex] = useState(-1);
    const [COMPlayerSeed, setCOMPlayerSeed] = useState();
    const [COMChoice, setCOMChoice] = useState(-1);
    const [COMBlindingFactor, setCOMBlindingFactor] = useState(null);

    const [round, setRound] = useState(0);
    const [myRemainingLevelPoint, setMyRemainingLevelPoint] = useState(0);
    const [myMaxLevelPoint, setMyMaxLevelPoint] = useState(0);
    const [opponentRemainingLevelPoint, setOpponentRemainingLevelPoint] = useState(0);
    const [opponentMaxLevelPoint, setOpponentMaxLevelPoint] = useState(0);

    const [myCharacters, setMyCharacters] = useState([]);
    const [myCharsUsedRounds, setMyCharsUsedRounds] = useState();
    const [opponentCharacters, setOpponentCharacters] = useState([]);
    const [opponentCharsUsedRounds, setOpponentCharsUsedRounds] = useState();

    const [myLevel, setMyLevel] = useState();
    const [opponentLevel, setOpponentLevel] = useState();

    const [isChanging, setIsChanging] = useState(false);
    const [isWaiting, setIsWaiting] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isInRound, setIsInRound] = useState(false);
    const [isChoiceFrozen, setIsChoiceFrozen] = useState(false);

    const [myState, setMyState] = useState(-1);
    const [myRandomSlotState, setMyRandomSlotState] = useState(-1);
    const [opponentRandomSlotState, setOpponentRandomSlotState] = useState(-1);

    const [completedNumRounds, setCompletedNumRounds] = useState(0);
    const [roundResults, setRoundResults] = useState([]);

    const [battleCompleted, setBattleCompleted] = useState(false);
    const [battleResult, setBattleResult] = useState();

    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState({isLoading: false, message: null});

    // async function checkIsCOM() {
    //     if (getEnv() === 'mumbai') return false;
    //     for (let _addressIndex = 2; _addressIndex < 7; _addressIndex++) {
    //         try {
    //             const opponentPlayerId = await getPlayerIdFromAddr(_addressIndex);
    //             if (opponentPlayerId === 1-battleInfo.myPlayerId) {
    //                 setAddressIndex(_addressIndex);
    //                 return true;
    //             }
    //         } catch (e) {
    //             console.log(`Opponent is not addr ${_addressIndex}`);
    //         }
    //     }
    //     return false;
    // }

    useEffect(() => {(async function() {
        console.log("=======useEffect A=======")
        setLoadingStatus({isLoading: true, message: null});
        if (!(await isInBattle())) {
            dispatch(initializeBattle());
            // バトル終了後にダイアログで勝敗を表示する
            const _battleResult = await getBattleResult(battleInfo.battleId);
            setBattleResult(_battleResult);
            if (_battleResult.isDraw) {
                console.log("結果4")
                setBattleResultDialog({open: true, result: "引き分け"})
            } else {
                if (_battleResult.winner == 0){
                    console.log("結果5")
                    setBattleResultDialog({open: true, result: "勝利"})
                } else {
                    console.log("結果6")
                    setBattleResultDialog({open: true, result: "敗北"})
                }
            }
            setLoadingStatus({isLoading: false, message: null});
            return;
        }
        
        console.log("続き")
        // playerId を取得
        const myPlayerId = battleInfo.myPlayerId == null ? await getPlayerIdFromAddr() : battleInfo.myPlayerId;
        dispatch(setMyPlayerId(myPlayerId));

        // 状態判定
        const _myState = await getPlayerState(battleInfo.battleId ,myPlayerId);
        console.log("getCharsUsedRounds前")
        const _myCharsUsedRounds = await getCharsUsedRounds(battleInfo.battleId, myPlayerId);
        console.log("getCharsUsedRounds後")
        if (_myState === 0 && !battleInfo.isChoiceRevealed) {
            setIsChoiceFrozen(true);
            setChoice(battleInfo.myChoice);
            setLevelPoint(battleInfo.myLevelPoint);
        } else if (_myState === 1) {
            setIsInRound(true);
            setIsChoiceFrozen(true);
            setChoice(battleInfo.myChoice);
            setLevelPoint(battleInfo.myLevelPoint);
        } else {
            // 自分の次の手を選択する
            for (let nextIndex = 0; nextIndex < _myCharsUsedRounds.length; nextIndex++) {
                if(_myCharsUsedRounds[nextIndex] === 0){
                    setChoice(nextIndex);
                    break;
                }
            }
        }

        // // COM かどうか判断
        // setIsCOM(await checkIsCOM());

        // ラウンド情報取得
        const currentRound = await getCurrentRound(battleInfo.battleId);
        setRound(currentRound);

        const _roundResults = await getRoundResults(battleInfo.battleId);
        setRoundResults(_roundResults);
        setCompletedNumRounds(currentRound);

        // レベルポイントの情報を取得
        setMyRemainingLevelPoint(await getRemainingLevelPoint(battleInfo.battleId, myPlayerId));
        setMyMaxLevelPoint(await getMaxLevelPoint(battleInfo.battleId, myPlayerId));

        setOpponentRemainingLevelPoint(await getRemainingLevelPoint(battleInfo.battleId, 1-myPlayerId));
        setOpponentMaxLevelPoint(await getMaxLevelPoint(battleInfo.battleId, 1-myPlayerId));

        // 自分のキャラ情報取得
        const myFixedSlotCharInfo = await getFixedSlotCharInfo(battleInfo.battleId, myPlayerId);
        const _myRandomSlotState = await getRandomSlotState(battleInfo.battleId, myPlayerId);
        setMyRandomSlotState(_myRandomSlotState);
        console.log("setMyCharacters ", setMyCharacters)
        if (_myRandomSlotState >= 1) {
            // 自分の seed がコミットし終わっていたら、RS も込みでキャラを設定する
            const myRandomSlot = await getMyRandomSlot(battleInfo.battleId, myPlayerId, battleInfo.myPlayerSeed);
            setMyCharacters([...myFixedSlotCharInfo, myRandomSlot]);
        } else {
            setMyCharacters(myFixedSlotCharInfo);
        }
        setMyCharsUsedRounds(_myCharsUsedRounds);
        setMyLevel(myFixedSlotCharInfo.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.level;
        }, 0));

        // 相手のキャラ情報取得
        const opponentFixedSlotCharInfo = await getFixedSlotCharInfo(battleInfo.battleId, 1-myPlayerId);
        const _opponentRandomSlotState = await getRandomSlotState(battleInfo.battleId, 1-myPlayerId);
        setOpponentRandomSlotState(_opponentRandomSlotState);
        if (_opponentRandomSlotState === 2) {
            // 相手の seed が reveal されていたら、RS の情報を設定する
            const opponentRandomSlot = await getRandomSlotCharInfo(battleInfo.battleId, 1-myPlayerId);
            setOpponentCharacters([...opponentFixedSlotCharInfo, opponentRandomSlot]);
        } else {
            // 相手の seed が reveal されていなかったら、わからない情報は null にして RS の情報を設定する
            const opponentRSLevel = await getRandomSlotLevel(battleInfo.battleId, 1-myPlayerId);
            const opponentRandomSlot = {
                index: 4, name: null, imgURI: null, characterType: null, level: opponentRSLevel,
                bondLevel: null, rarity: null, attributeIds: [], isRandomSlot: true
            };
            setOpponentCharacters([...opponentFixedSlotCharInfo, opponentRandomSlot]);
        }
        console.log("getCharsUsedRounds 2 前")
        setOpponentCharsUsedRounds(await getCharsUsedRounds(battleInfo.battleId, 1-myPlayerId));
        console.log("getCharsUsedRounds 2 後")
        setOpponentLevel(opponentFixedSlotCharInfo.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.level;
        }, 0));

        // イベント情報の取得
        if (_opponentRandomSlotState === 0) {
            eventPlayerSeedCommitted(battleInfo.battleId, 1-myPlayerId, setIsWaiting);
        }
        for (let r = currentRound; r < maxRounds; r++) {
            eventChoiceCommitted(battleInfo.battleId, r, 1-myPlayerId, setIsWaiting);
            eventChoiceRevealed(battleInfo.battleId, r, 1-myPlayerId, setIsWaiting);
            eventRoundCompleted(battleInfo.battleId, r, setCompletedNumRounds);
        }

        const _opponentState = await getPlayerState(battleInfo.battleId, 1-myPlayerId);
        if (_myState > _opponentState || (_myRandomSlotState === 1 && _opponentRandomSlotState === 0)) {
            // 自分の方が進んでいれば相手を待つ必要がある
            // バトルが終了していたらダイアログを出さない
            console.log("useEffectA 内部 相手の操作が完了するのを待っています。")
            setLoadingStatus({isLoading: true, message: '相手の操作が完了するのを待っています。'});
        } else if (_myState < _opponentState || (_myRandomSlotState === 0 && _opponentRandomSlotState === 1)) {
            setIsWaiting(false);
            setLoadingStatus({isLoading: false, message: null});
        } else {
            setLoadingStatus({isLoading: false, message: null});
        }
    })();}, [myState]);


    useEffect(() => {
        console.log("=======useEffect B=======")
        
        // 対戦相手のrevealを検知する?
        eventPlayerSeedRevealed(battleInfo.battleId, round, 1 - battleInfo.myPlayerId, battleInfo.myPlayerSeed);
        eventBattleCompleted(battleInfo.battleId, round, setBattleCompleted);

        // reasons for cancellation
        for (let playerId = 0; playerId <= 1; playerId++) {
            eventExceedingLevelPointCheatDetected(battleInfo.battleId, playerId, setIsCancelling);
            // if(choice != null) {
            //     eventReusingUsedSlotCheatDetected(battleInfo.battleId, playerId, choice, choice, setIsCancelling);
            //     eventLateChoiceRevealDetected(battleInfo.battleId, playerId, setIsCancelling);
            // }
            eventLatePlayerSeedCommitDetected(battleInfo.battleId, playerId, setIsCancelling);
            eventLateChoiceCommitDetected(battleInfo.battleId, playerId, setIsCancelling);
        }

        eventBattleCanceled(setIsCancelled);
    }, []);


    useEffect(() => {
        console.log("=======useEffect C=======")
        if (isCancelling && isCancelled) {
            alert("バトルがキャンセルされました。");
            dispatch(initializeBattle());
            navigate('../');
        }
    }, [isCancelling, isCancelled]);


    async function handleForceInitBattle () {
        dispatch(initializeBattle());
        await forceInitBattle();
        const message = "バトル状態を初期化しました。";
        enqueueSnackbar(message, {
            autoHideDuration: 1500,
            variant: 'success',
        });
        navigate('../');
    }

    async function handleReportLateOperation () {
        try {
            if (await reportLateOperation(1-battleInfo.myPlayerId)) {
                const message = "報告しました。";
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'success',
                });
            }
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else if (e.reason.substr(0, 19) === "execution reverted:") {
                alert(e.reason.substr(20));
            } else {
                alert("不明なエラーが発生しました。");
            }
        }
    }


    // COMChoice をランダムに更新
    function getNextCOMIndex(){
        var UnusedIndexes = [];
        for (let idx = 0; idx < opponentCharsUsedRounds.length; idx++) {
            if(idx !== COMChoice && opponentCharsUsedRounds[idx] === 0){
                UnusedIndexes.push(idx);
            }
        }

        const _nextCOMChoice = Math.floor( Math.random() * UnusedIndexes.length );
        if (UnusedIndexes[_nextCOMChoice] == undefined) {
            return 4
        } else {
            return UnusedIndexes[_nextCOMChoice];
        }
    }


    async function handleSeedCommit () {
        setLoadingStatus({isLoading: true, message: 'まもなく対戦が開始されます！'});
        setIsChanging(true);
        let succeed = false;

        const myPlayerId = battleInfo.myPlayerId;
        const myPlayerSeed = battleInfo.myPlayerSeed == null ? getRandomBytes32() : battleInfo.myPlayerSeed;
        dispatch(setMyPlayerSeed(myPlayerSeed));

        try {
            await commitPlayerSeed(myPlayerSeed);
            const message = "バトルが開始されました！";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
            succeed = true;
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }

        try {
            const myRandomSlot = await getMyRandomSlot(battleInfo.battleId, myPlayerId, myPlayerSeed);
            setMyCharacters((characters) => {
                characters.push(myRandomSlot);
                return characters;
            });
        } catch (e) {
            console.log({error: e});
            alert("リロードして再度ゲームを開始してください。");
            succeed = false;
        }

        if (battleInfo.isCOM) {
            const _COMPlayerSeed = getRandomBytes32();
            setCOMPlayerSeed(_COMPlayerSeed);
            try {
                await commitPlayerSeed(_COMPlayerSeed, battleInfo.comAddress);
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
            setCOMChoice(getNextCOMIndex());
        }

        setMyRandomSlotState(await getRandomSlotState(battleInfo.battleId,　myPlayerId));

        setIsChanging(false);
        if (succeed) {
            setLoadingStatus({isLoading: true, message: '相手の操作が完了するのを待っています。'});
        } else {
            setIsChecking(false);
            setLoadingStatus({isLoading: false, message: null});
        }
    }


    async function handleChoiceCommit() {
        console.log("-------------勝負するキャラを確定する---------------")
        setLoadingStatus({isLoading: true, message: 'キャラを確定しています。'});
        setIsChanging(true);
        setIsChecking(true);
        setIsInRound(true);
        setIsChoiceFrozen(true);
        let succeed = false;

        const blindingFactor = battleInfo.isBlindingFactorUsed ? getRandomBytes32() : battleInfo.myBlindingFactor;
        dispatch(setMyBlindingFactor(blindingFactor));
        dispatch(setMyChoice(choice));
        dispatch(setMyLevelPoint(levelPoint));

        try {
            await commitChoice(levelPoint, choice, blindingFactor);
            const message = "キャラが確定されました！";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
            succeed = true;
        } catch (e) {
            setIsInRound(false);
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }

        if (battleInfo.isCOM) {
            const _COMblindingFactor = getRandomBytes32();
            setCOMBlindingFactor(_COMblindingFactor);
            try {
                await _COMCommitChoice(levelPoint, COMChoice, _COMblindingFactor, battleInfo.comAddress);
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
        }

        setIsChanging(false);
        if (succeed) {
            setLoadingStatus({isLoading: true, message: '相手の操作が完了するのを待っています。'});
        } else {
            setIsChecking(false);
            setLoadingStatus({isLoading: false, message: null});
        }
    }

    async function handleSeedReveal() {
        setLoadingStatus({isLoading: true, message: 'ランダムスロットを公開しています。'});
        setIsChanging(true);

        try {
            await revealPlayerSeed(battleInfo.myPlayerSeed);
            const message = "ランダムスロットを公開しました！";
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
        setMyRandomSlotState(await getRandomSlotState(battleInfo.battleId, battleInfo.myPlayerId));

        setIsChanging(false);
        setLoadingStatus({isLoading: false, message: null});
    }


    async function handleChoiceReveal() {
        console.log("------------バトル結果を見る----------------")
        setLoadingStatus({isLoading: true, message: 'バトルに出したキャラを公開しています。'});
        setIsChanging(true);
        setIsChecking(true);
        setLevelPoint(0);
        let succeed = false;

        dispatch(setChoiceUsed());
        const myBlindingFactor = battleInfo.myBlindingFactor;
        dispatch(setBlindingFactorUsed());
        
        try {
            await revealChoice(levelPoint, choice, myBlindingFactor);
            const message = "バトルに出したキャラを公開しました！";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
            succeed = true;
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。");
            }
        }

        if (battleInfo.isCOM) {
            if (COMChoice === 4) {
                try {
                    await _COMRevealPlayerSeed(COMPlayerSeed, battleInfo.comAddress);
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
                await _COMRevealChoice(levelPoint, COMChoice, COMBlindingFactor, battleInfo.comAddress);
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
            setCOMChoice(getNextCOMIndex());
        }

        setIsChanging(false);

        // バトルが終了していたらダイアログを出さない
        var isInBattle = await isInBattle
        if(!isInBattle){
            return
        }
        if (succeed) {
            setLoadingStatus({isLoading: true, message: '相手の操作が完了するのを待っています。'});
        } else {
            setIsChecking(false);
            setLoadingStatus({isLoading: false, message: null});
        }
    }

    // 各処理終了時の処理
    useEffect(() => {(async function() {
        console.log("=======useEffect D=======")
        const myPlayerId = battleInfo.myPlayerId == null ? await getPlayerIdFromAddr() : battleInfo.myPlayerId;
        const _myState = await getPlayerState(battleInfo.battleId, myPlayerId);
        const _opponentState = await getPlayerState(battleInfo.battleId, 1-myPlayerId);
        setMyState(_myState);
        
        if (!isChanging && !isWaiting) {
            const _myRandomSlotState = await getRandomSlotState(battleInfo.battleId, myPlayerId);
            const _opponentRandomSlotState = await getRandomSlotState(battleInfo.battleId, 1-myPlayerId);
            if (_myState === _opponentState && !(_myRandomSlotState + _opponentRandomSlotState === 1)) {
                // 両方のステータスが同じになったらチェック終了で次に進める
                setIsChecking(false);
                if (loadingStatus.message === '相手の操作が完了するのを待っています。') {
                    setLoadingStatus({isLoading: false, message: null});
                }
            } else if (_myState > _opponentState || (_myRandomSlotState === 1 && _opponentRandomSlotState === 0)) {
                // 自分の方が進んでいれば相手を待つ必要がある
                setIsWaiting(true);
            }
        }
        
    // })();}, [hasAction]);
    })();}, [isChanging, isWaiting]);


    // ラウンド終了後の処理
    useEffect(() => {(async function() {
        console.log("=======useEffect E=======")
        if (completedNumRounds > 0 && myCharsUsedRounds !== undefined) {
            // 相手の次の動作を待つ
            setIsWaiting(true);

            const myPlayerId = battleInfo.myPlayerId == null ? await getPlayerIdFromAddr() : battleInfo.myPlayerId;
            const currentRound = await getCurrentRound(battleInfo.battleId);
            setRound(currentRound);

            if (currentRound > 0) {
                setMyRemainingLevelPoint(await getRemainingLevelPoint(battleInfo.battleId, myPlayerId));
                setOpponentRemainingLevelPoint(await getRemainingLevelPoint(battleInfo.battleId, 1-myPlayerId));
                setLevelPoint(0);
                console.log("関数発火確認　getCharsUsedRounds")
                setMyCharsUsedRounds(await getCharsUsedRounds(battleInfo.battleId, myPlayerId));
                setOpponentCharsUsedRounds(await getCharsUsedRounds(battleInfo.battleId, 1-myPlayerId));
                console.log("関数発火確認　getCharsUsedRounds　ここまで")
                const _opponentRandomSlotState = await getRandomSlotState(battleInfo.battleId, 1-battleInfo.myPlayerId);
                if (_opponentRandomSlotState === 2) {
                    const opponentRandomSlot = await getRandomSlotCharInfo(battleInfo.battleId, 1-myPlayerId);
                    setOpponentCharacters((character) => {
                        character[4] = opponentRandomSlot;
                        return character;
                    });
                }

                setOpponentRandomSlotState(_opponentRandomSlotState);
            }

            const _roundResults = await getRoundResults(battleInfo.battleId);
            setRoundResults(_roundResults);
            const _roundResult = _roundResults[completedNumRounds-1];
            if (await getPlayerState(battleInfo.battleId, myPlayerId) === 0) {
                if (_roundResult.isDraw) {
                    alert(`Round ${completedNumRounds}: Draw (${_roundResult.winnerDamage}).`);
                } else {
                    alert(`Round ${completedNumRounds}: Winner ${_roundResult.winner} ${_roundResult.winnerDamage} vs Loser ${_roundResult.loser} ${_roundResult.loserDamage}.`);
                }
            }

            let nextIndex;
            for (nextIndex = 0; nextIndex < myCharsUsedRounds.length; nextIndex++) {
                if(nextIndex !== choice && myCharsUsedRounds[nextIndex] === 0){
                    break;
                }
            }
            setChoice(nextIndex);

            setIsChoiceFrozen(false);
            setIsInRound(false);
        }
    })();}, [completedNumRounds]);


    // バトル終了後の処理
    useEffect(() => {(async function() {
        console.log("=======useEffect G=======")
        if (battleCompleted && !isInRound) {
            const _battleResult = await getBattleResult(battleInfo.battleId);
            setBattleResult(_battleResult);
            if (_battleResult.isDraw) {
                alert(`Battle Result (${_battleResult.numRounds+1} Rounds): Draw (${_battleResult.winnerCount} - ${_battleResult.loserCount}).`);
                if (!(await isInBattle())) {
                    console.log("結果1")
                    setBattleResultDialog({open: true, result: "引き分け"})
                }
            } else {
                alert(`Battle Result (${_battleResult.numRounds+1} Rounds): Winner ${_battleResult.winner} (${_battleResult.winnerCount} - ${_battleResult.loserCount}).`);
                if (!(await isInBattle())) {
                    if (_battleResult.winner == 0){
                        console.log("結果2")
                        setBattleResultDialog({open: true, result: "勝利"})
                    } else {
                        console.log("結果3")
                        setBattleResultDialog({open: true, result: "敗北"})
                    }
                }
            }
        }
    })();}, [battleCompleted, isInRound]);

    function roundResult(){
        if (roundResults.length === 0) return <></>
        var win_count = 0
        var lose_count = 0
        var draw_count = 0
        roundResults.map((roundResult, index) => {
            if (!roundResult.isDraw){
                if(battleInfo.myPlayerId === roundResult.winner){
                    win_count += 1
                } else {
                    lose_count += 1
                }
            } else {
                draw_count += 1
            }
        })

        return  <Paper elevation={3} style={{padding: 6, backgroundColor: '#EEEEEE'}}>
                    <Chip label="自分" variant="outlined" style={{marginRight: 8, backgroundColor: '#99FFFF'}}/>
                        {win_count} - {lose_count}
                    <Chip label="相手" variant="outlined" style={{marginLeft: 8, backgroundColor: '#FFCCFF'}}/>
                    <br/>(引き分け: {draw_count})
                </Paper>
    }
    return(<>
    <LoadingDOM isLoading={loadingStatus.isLoading} message={loadingStatus.message}/>
    <div variant="contained" size="large" className="battle_result_btn" color="primary" aria-label="add">
        { roundResult() }
    </div>
    <Button variant="contained" size="large" color="secondary" onClick={() => handleForceInitBattle() }>
        バトルの状態をリセットする
    </Button>
    <Button variant="contained" size="large" color="secondary" onClick={() => handleReportLateOperation() }>
        相手の操作が遅いことを報告する
    </Button>
    <div>※：バグ等でバトルがうまく進まなくなったり、マッチングができなくなったら押してください。</div>
    <div>COMとバトル: {battleInfo.isCOM ? "YES" : "NO"}</div>
    <div>ラウンド {round+1}</div>

    {myRandomSlotState >= 1 &&
        <Container style={{backgroundColor: '#EDFFBE', marginBottom: '10%'}}>
            [dev]左から数えて {COMChoice} 番目のトークンが選択されました。
            <PlayerYou characters={opponentCharacters} charsUsedRounds={opponentCharsUsedRounds} level={opponentLevel}
                remainingLevelPoint={opponentRemainingLevelPoint} maxLevelPoint={opponentMaxLevelPoint} opponentRandomSlotState={opponentRandomSlotState}/>
            <div style={{height: 100}}/>
            [dev]レベルポイント {levelPoint}<br/>
            [dev]保存したmyPlayerSeed: { battleInfo.myPlayerSeed }<br/>
            [dev]左から数えて {choice} 番目のトークンが選択されました。

            <PlayerI characters={myCharacters} charsUsedRounds={myCharsUsedRounds} level={myLevel} myRandomSlotState={myRandomSlotState}
                remainingLevelPoint={myRemainingLevelPoint} maxLevelPoint={myMaxLevelPoint} setLevelPoint={setLevelPoint}
                isChoiceFrozen={isChoiceFrozen} choice={choice} setChoice={setChoice} />
        </Container>
    }

    <div class="battle_result_dialog_btn" onClick={() => setBattleResultBoardOpen(true) }>
        <HelpIcon style={{ marginRight: '10px' }}/> バトル結果を見る
    </div>
    <BattleResultBoard battleResult={battleResult} roundResults={roundResults} round={round}
        battleInfo={battleInfo} battleResultBoardOpen={battleResultBoardOpen}
        setBattleResultBoardOpen={setBattleResultBoardOpen} />

    <div class="help_dialog_btn" onClick={() => setHelpGuidOpen(true) }>
        <HelpIcon  style={{ marginRight: '10px' }}/> ヘルプ
    </div>
    <HelpGuid helpGuidOpen={helpGuidOpen} setHelpGuidOpen={setHelpGuidOpen} />

    {!isChanging && myRandomSlotState === 0 &&
        <Button variant="contained" size="large" style={ handleButtonStyle() } color="primary" aria-label="add" onClick={() => handleSeedCommit() }>
            バトルを開始する
        </Button>
    }

    {!battleCompleted && !isChanging && !isChecking && !isInRound && myState === 0 && myRandomSlotState >= 1 &&
        <Button variant="contained" size="large" style={ handleButtonStyle() } color="secondary" aria-label="add" onClick={() => handleChoiceCommit()}>
            勝負するキャラを確定する
        </Button>
    }

    {!battleCompleted && !isChanging && !isChecking && myState === 1 && choice === 4 && myRandomSlotState === 1 &&
        <Button variant="contained" size="large" style={ handleButtonStyle() } color="info" aria-label="add" onClick={() => handleSeedReveal()}>
            ランダムスロットを公開する
        </Button>
    }

    {!battleCompleted && !isChanging && !isChecking && myState === 1 && (choice !== 4 || (choice === 4 && myRandomSlotState === 2)) &&
        <Button variant="contained" size="large" style={ handleButtonStyle() } color="primary" aria-label="add" onClick={() => handleChoiceReveal()}>
            バトル結果を見る
        </Button>
    }
    {/* alertで各バトルの結果を通知 */}
    <BattleResultTag battleResultDialog={battleResultDialog} setBattleResultDialog={setBattleResultDialog}
        roundResults={roundResults} round={round} battleInfo={battleInfo}/>
    </>)
}
