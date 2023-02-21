import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Puff } from 'react-loader-spinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import 'css/card.css';
import { selectMyCharacter, setBattleCharacters, addBattleCharacters, removeBattleCharacters, updateBattleCharacters, initializeBattleCharacters } from 'slices/myCharacters.ts';
import { initializeBattle } from 'slices/battle.ts';
import { useSelector, useDispatch } from 'react-redux';
import { getContract } from 'fetch_sol/utils.js';
import { getCurrentStamina, getStaminaPerBattle, subscIsExpired } from 'fetch_sol/dealer.js';
import { getOwnedCharacterWithIDList } from 'fetch_sol/token.js';
import { proposeBattle, isProposed, isInBattle, isNotInvolved, cancelProposal } from 'fetch_sol/match_organizer.js';
import { forceInitBattle, eventBattleStarted } from 'fetch_sol/battle_field.js';
import { prepareForBattle, createCharacters, makeProposers, cancelProposals, requestChallengeToMe } from 'fetch_sol/test/match_organizer_test.js';

import { useSnackbar } from 'notistack';
import characterInfo from "assets/character_info.json";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function createRoomButtonStyle() {
    return {
        position: 'fixed',
        bottom: 10,
        right: '55%',
        width: '20%',
        fontSize: 17,
        fontWeight: 600
    }
}
function searchRoomsButtonStyle() {
    return {
        position: 'fixed',
        bottom: 10,
        left: '55%',
        width: '20%',
        fontSize: 17,
        fontWeight: 600
    }
}

function editButtonStyle() {
    return {
        position: 'fixed',
        bottom: 50,
        right: 30,
        fontSize: 20,
        fontWeight: 600,
        zIndex: 20
    }
}

const maxNumBattleCharacters = 4;

function CharacterCard({character, setMyBattleCharacters, isChanging}){
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const myCharacters = useSelector(selectMyCharacter);

    const characterAttribute = characterInfo.attributes[character.attributeIds[0]];
    const characterType = characterInfo.characterType[character.characterType];
    const isSelected = myCharacters.battleCharacters.some(char => char.id === character.id);
    const borderColor = (isChanging && isSelected) ? 'black' : 'silver';
    const backgroundColor = (isChanging && isSelected) ? 'orange' : '#FFDBC9';
    const imgBackgroundColor = (isChanging && isSelected) ? 'black' : 'white';

    function handleClickCharacter(){
        if (!isChanging) { return }
        if (isSelected) {
            dispatch(removeBattleCharacters(character));
            setMyBattleCharacters(myCharacters.battleCharacters);
        } else if (myCharacters.battleCharacters.length >= maxNumBattleCharacters) {
            const message = `対戦に選べるキャラクターは ${maxNumBattleCharacters} 体までです`;
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'error',
            });
        } else {
            dispatch(addBattleCharacters(character));
            setMyBattleCharacters(myCharacters.battleCharacters);
        }
    }

    return(<>
        <div className="card_parent" style={{backgroundColor: characterAttribute["backgroundColor"]}} onClick={() => handleClickCharacter()}>
            <div className="card_name">
                { character.name }
            </div>

            <div className="box" style={{borderColor: borderColor, backgroundColor: backgroundColor, padding: 10}}>
                レベル: { character.level }<br/>
                絆レベル: { character.bondLevel }
            </div>

            <div className="character_type_box"
                style={{backgroundColor: characterType['backgroundColor'], borderColor: characterType['borderColor']}}>
                { characterType['jaName'] }
            </div>

            <div className="img_box" style={{backgroundColor: imgBackgroundColor}}>
                <img className='img_div' src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="sample"/>
            </div>

            <div className="attribute_box">
                レア度 {character.rarity}<br/>
                { characterAttribute["title"] }
            </div>

            <div className="detail_box">
                <div style={{margin: 10}}>
                    { characterAttribute["description"] }
                </div>
            </div>
        </div>
    </>)
}


export default function Battle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const myCharacters = useSelector(selectMyCharacter);

    const [myOwnedCharacters, setMyOwnedCharacters] = useState([]);
    const [myBattleCharacters, setMyBattleCharacters] = useState([]);
    const [rangeValue, setRangeValue] = useState({min: 4, max: 1020});
    const [matched, setMatched] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {(async function() {
        // 対戦情報ステータスを初期化する
        dispatch(initializeBattle());

        // バトルキャラの情報を更新する
        const _myOwnedCharacters = await getOwnedCharacterWithIDList();
        setMyOwnedCharacters(_myOwnedCharacters);
        dispatch(updateBattleCharacters(_myOwnedCharacters));
        setMyBattleCharacters(myCharacters.battleCharacters);

        // 現在対戦申し込み中の場合は、ダイアログを表示
        setDialogOpen(await isProposed());

        // 自分が propose した時のバトル開始を検知
        const { signer } = getContract("PLMMatchOrganizer");
        const myAddress = await signer.getAddress();
        eventBattleStarted(myAddress, setMatched, true);
    })();}, []);


    useEffect(() => {(async function() {
        if (matched) {
            // 対戦情報ステータスを初期化する
            const message = "相手とマッチしました！";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
            dispatch(initializeBattle());
            navigate('/battle_main');
        }
    })();}, [matched]);


    async function handleUpdate(){
        setIsChanging(false);

        const _myOwnedCharacters = await getOwnedCharacterWithIDList();
        setMyOwnedCharacters(_myOwnedCharacters);
        dispatch(updateBattleCharacters(_myOwnedCharacters));
        setMyBattleCharacters(myCharacters.battleCharacters);

        if(_myOwnedCharacters.length < maxNumBattleCharacters){
            const message = `対戦するためにはキャラクターを最低でも ${maxNumBattleCharacters} 体保持する必要があります。`;
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'info',
            });
        }
    }


    async function createRoom() {
        if ((await getCurrentStamina()) < (await getStaminaPerBattle())) {
            // スタミナがあるか確認
            alert("スタミナが足りません。チャージしてください。");
        } else if (await subscIsExpired()) {
            // サブスクの確認
            alert("サブスクリプションの期間が終了しました。更新して再度バトルに臨んでください。");
        } else {
            setDialogOpen(true);
            try {
                const fixedSlotsOfChallenger = myCharacters.battleCharacters.map(character => character.id);
                console.log({fixedSlotsOfChallenger});
                // proposeBattle で自分が対戦要求ステータスに変更される
                await proposeBattle(rangeValue, fixedSlotsOfChallenger);
                const message = "対戦の部屋を作りました。";
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'success',
                });
            } catch (e) {
                setDialogOpen(false);
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。バトル状態をリセットしてみてください。");
                }
            }
        }
    }


    function searchRooms() {
        // 対戦情報ステータスを初期化する
        dispatch(initializeBattle());
        navigate('/match_make');
    }


    async function declineProposal(){
        try {
            await cancelProposal();
            const message = "対戦希望を取り下げました。";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'success',
            });
            setDialogOpen(false);
        } catch (e) {
            console.log({error: e});
            if (e.message.substr(0, 18) === "transaction failed") {
                alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
            } else {
                alert("不明なエラーが発生しました。バトル状態をリセットしてみてください。");
            }
        }
    }


    // 開発用・後で消す
    async function devPrepareForBattle(){
        const fixedSlots = await prepareForBattle();
        const _myOwnedCharacters = await getOwnedCharacterWithIDList();
        setMyOwnedCharacters(_myOwnedCharacters);
        const _myBattleCharacters = _myOwnedCharacters.filter(char => fixedSlots.includes(char.id));
        setMyBattleCharacters(_myBattleCharacters);
        dispatch(setBattleCharacters(_myBattleCharacters));
    }

    const fixedSlotsOfChallengers = [];
    async function devHandleCharacter(){
        await createCharacters(fixedSlotsOfChallengers);
    }

    async function devHandleProposal(){
        await makeProposers(fixedSlotsOfChallengers);
    }

    // 開発テスト用: Proposalを取り下げる
    async function devHandleDeclinePros () {
        await cancelProposals();
    }

    // 開発テスト用: 自分に対戦を申し込む
    async function devHandleProposeToMe () {
        await requestChallengeToMe();
    }

    async function handleForceInitBattle () {
        await forceInitBattle();
    }

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
                {isChanging ?
                <>{myOwnedCharacters.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <CharacterCard key={index} character={character} setMyBattleCharacters={setMyBattleCharacters} isChanging={isChanging}/>
                    </Grid>
                ))}</>
                :
                <>{myBattleCharacters.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <CharacterCard key={index} character={character} setMyBattleCharacters={setMyBattleCharacters} isChanging={isChanging}/>
                    </Grid>
                ))}</>
                }
            </Grid>

            {isChanging ?
            <Button variant="contained" size="large" color="secondary"
                style={ editButtonStyle() } onClick={() => handleUpdate()}>
                変更を保存する
            </Button>
            :
            <Button variant="contained" size="large" style={{marginTop: 10}} onClick={() => setIsChanging(true)}>
                変更
            </Button>
            }
        </Box>

        <Dialog
            open={dialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center'}}>
                対戦相手を探しています。
            </DialogTitle>
            <DialogContent>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <Puff
                        height="150"
                        width="150"
                        radius={10}
                        color="#4fa94d"
                        ariaLabel="puff-loading"
                        wrapperStyle={{display: 'inlineBlock'}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>

                <DialogContentText id="alert-dialog-description" component="div">
                    他プレイヤーが対戦を申し込んでくると、自動でバトル画面に遷移します。<br/>
                    このままお待ちください
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={() => devHandleProposeToMe()} style={{marginLeft: 20, backgroundColor: 'white'}}>
                    [dev] 自分に対戦を申し込ませる
                </Button>
                <Button  variant="contained" size="large" style={{width: '100%'}} onClick={() => declineProposal()}>
                    対戦申告を取り下げる
                </Button>
            </DialogActions>
        </Dialog>

        <Button variant="outlined" color="secondary" onClick={() => handleForceInitBattle()} style={{marginLeft: 20, backgroundColor: 'white'}}>
            バトルの状態をリセットする
        </Button>
        <div>※：バグ等でバトルがうまく進まなくなったり、マッチングができなくなったら押してください。</div>

        <Button variant="contained" size="large"
            onClick={() => devPrepareForBattle()} disabled={isChanging}>
            [dev] 自分のキャラを用意する
        </Button>

        <Button variant="contained" size="large"
            onClick={() => devHandleCharacter()} disabled={isChanging}>
            [dev] ユーザー2~4のキャラを用意する
        </Button>

        <Button variant="contained" size="large"
            onClick={() => devHandleProposal()} disabled={isChanging}>
            [dev] ユーザー2~4の3名を対戦可能状態にする
        </Button>

        <Button variant="outlined" color="secondary" onClick={() => devHandleDeclinePros()} style={{marginLeft: 20, backgroundColor: 'white'}}>
            [dev] 全ユーザーのProposalを取り下げる
        </Button>

        {(myBattleCharacters.length >= maxNumBattleCharacters) &&
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 30,
                    '& > :not(style)': { m: 1 },
                }}
            >
                <div>対戦相手の希望レベル上限下限<br/>(4 ~ 1020)まで指定可能</div>
                <TextField
                    error={false}
                    type = 'number'
                    min="4" max="1020"
                    helperText={ false ? "対戦相手希望下限レベルを正しく入力してください"  : ""}
                    id="demo-helper-text-aligned"
                    defaultValue={rangeValue.min}
                    onChange={(e) => setRangeValue({ ...rangeValue, min: Number(e.target.value)})}
                />
                から
                <TextField
                    error={false}
                    type = 'number'
                    min="4" max="1020"
                    helperText= {false ? "対戦相手希望上限レベルを正しく入力してください" : ""}
                    id="demo-helper-text-aligned-no-helper"
                    defaultValue={rangeValue.max}
                    onChange={(e) => setRangeValue({ ...rangeValue, max: Number(e.target.value)})}
                />
                の範囲で対戦部屋を作成
            </Box>


            <Button variant="contained" size="large" style={createRoomButtonStyle()} onClick={() => createRoom()} disabled={isChanging}>
                対戦の部屋を作る
            </Button>
            <Button variant="contained" size="large" style={searchRoomsButtonStyle()} onClick={() => searchRooms()} disabled={isChanging}>
                対戦相手を探す
            </Button>
        </>
        }
    </>)
}
