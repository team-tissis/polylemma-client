import React, { useState, useEffect } from 'react';
import './card.css';
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
import { setCurrentMyCharacter, myCharacterRemove, selectMyCharacter } from '../../slices/myCharacter.ts'
import { useSelector, useDispatch } from 'react-redux';
import { getOwnedCharacterWithIDList } from '../../fetch_sol/token.js';
import { useSnackbar } from 'notistack';
import { proposeBattle, getProposalList, isInProposal, isNonProposal, requestChallenge, cancelProposal } from '../../fetch_sol/match_organizer.js';
import { createCharacters, makeProposers, cancelProposals, requestChallengeToMe } from '../../fetch_sol/test/match_organizer_test.js';
import characterInfo from "./character_info.json";
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function handleCreateRoomButtonStyle() {
    return {
        position: 'fixed',
        bottom: 10,
        right: '55%',
        width: '20%',
        fontSize: 17,
        fontWeight: 600
    }
}
function handleSearchRoomButtonStyle() {
    return {
        position: 'fixed',
        bottom: 10,
        left: '55%',
        width: '20%',
        fontSize: 17,
        fontWeight: 600
    }
}

function editButtonstyle() {
    return {
        position: 'fixed',
        bottom: 50,
        right: 30,
        fontSize: 20,
        fontWeight: 600,
        zIndex: 20
    }
}

const selectedNum = 4;

function NFTCard({character, charactersForBattle, setStateChange, myCharacterList, setCharactersForBattle, isChanging}){
    const { enqueueSnackbar } = useSnackbar();
    const thisCharacterAbility = character.abilityIds[0];
    const charaType = characterInfo.characterType[character.characterType];
    var color = 'white'
    const result = charactersForBattle.filter(cha => cha.id === character.id);
    const alreadySelected = (result.length > 0) ? true : false;
    if( isChanging && alreadySelected){
        color = 'black'
    }

    function handleChange(){
        const selectedData = charactersForBattle;
        if (alreadySelected){
            const popThisData = selectedData.filter((data, index) => {
                return data.id !== character.id
            });
            setCharactersForBattle(popThisData)
        }else{
            if(selectedData.length >= selectedNum){
                const message = "対戦に選べるキャラクターは4体までです"
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'error',
                });
            }else{
                setCharactersForBattle([...selectedData, character])
            }
        }
        setStateChange((prev) => prev + 1)
    }

    return(<>
        <div class="card_parent" style={{backgroundColor: characterInfo.attributes[thisCharacterAbility]["backgroundColor"]}} onClick={ isChanging ? () => handleChange() : null}>
            <div class="card_name">
                キャラクター名をここに書く
            </div>
            <div class="box">
                <p>{ character.level }</p>
            </div>
            <div class="character_type_box" 
                style={{backgroundColor: charaType['backgroundColor'], borderColor: charaType['borderColor']}}>
                { charaType['jaName'] }
            </div>
            <div class="img_box" style={{backgroundColor: color}}>
                <img className='img_div' src="https://www.picng.com/upload/sun/png_sun_7636.png" alt="sample"/>
            </div>
            <div class="attribute_box">
                { characterInfo.attributes[thisCharacterAbility]["title"] }
            </div>
            <div class="detail_box">
                <div style={{margin: 10}}>
                    { characterInfo.attributes[thisCharacterAbility]["description"] }
                </div>
            </div>
        </div>

        {/* <Card style={{backgroundColor: color}} onClick={ isChanging ? () => handleChange() : null}>
        <CardActionArea>
            <CardMedia component="img" height="200"
                image="https://www.picng.com/upload/sun/png_sun_7636.png" alt="green iguana" />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">キャラID: {character.id}</Typography>
            <Typography variant="body1" color="text.primary">レア度: { character.rarity }</Typography>
            <Typography variant="body1" color="text.primary">属性: { character.characterType }</Typography>
            <Typography variant="body1" color="text.primary">レベル: { character.level }</Typography>
            <Typography variant="body1" color="text.primary">特性: { character.abilityIds }</Typography>
            </CardContent>
        </CardActionArea>
        </Card> */}
    </>)
}


export default function Battle() {
    const dispatch = useDispatch();
    const myCharacters = useSelector(selectMyCharacter);
    const [charactersForBattle, setCharactersForBattle] = useState([]);
    const [isChanging, setIsChanging] = useState(false);
    const [stateChange, setStateChange] = useState(0);
    const navigate = useNavigate();
    const [myCharacterList, setMyCharacterList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [rangeValue, setRangeValue] = useState({min: 4, max: 1020});

    useEffect(() => {
        // スマコンのアドレスを取得
        // 自分の持ってるキャラを参照して、myCharactersがが含まれていたらOK
        // もし服魔れていなかったら dispatch(myCharacterRemove()); で削除
        console.log({自分が選択しているキャラ: myCharacters.charactersList})
        setCharactersForBattle(myCharacters.charactersList)
    }, []);

    // キャラクターを所持していないのに、キャラがバトル画面で表示されてしまうバグの修正
    useEffect(() => {(async function() {
        const _myCharacterList = await getOwnedCharacterWithIDList()
        // FEATURE:ローカルストレージに保存している値と自分が持ってるキャラが一致しているか確認する
        const updatedCharactersForBattle = []
        var hasToUpdateState = false
        for (let step = 0; step < myCharacters.charactersList.length; step++) {
            // const thisChara = _myCharacterList[step];
            const matchedCharaFromAPI = _myCharacterList.find(char => char.id === myCharacters.charactersList[step].id);
            if (_myCharacterList.find(char => char.id === myCharacters.charactersList[step].id)) {
                console.log({存在しました: myCharacters.charactersList[step]})
                if( myCharacters.charactersList[step].level == matchedCharaFromAPI.level ){
                    updatedCharactersForBattle.push(matchedCharaFromAPI)
                    continue
                } else {
                    // 育成が反映されていないので更新する必要がある
                    updatedCharactersForBattle.push(matchedCharaFromAPI)
                    hasToUpdateState = true
                    continue
                }
            } else {
                hasToUpdateState = true
                continue
            }
        }
        if(hasToUpdateState){
            dispatch(setCurrentMyCharacter(updatedCharactersForBattle)); //更新
            setCharactersForBattle(updatedCharactersForBattle)
        }
        // FEATURE:ローカルストレージに保存している値と自分が持ってるキャラが一致しているか確認する
    })();}, []);

    useEffect(() => {(async function() {
        // 現在対戦申し込み中の場合は、ダイアログを表示
        setDialogOpen(await isInProposal());
        const _myCharacterList = await getOwnedCharacterWithIDList()
        setMyCharacterList(_myCharacterList)
        if(_myCharacterList.length < selectedNum){
            const message = "対戦するためにはキャラクターを最低でも4体保持する必要があります。"
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'info',
            });
        }
    })();}, [stateChange]);

    function handleUpdate(){
        dispatch(setCurrentMyCharacter(charactersForBattle)); //更新
        setIsChanging(false);
        setStateChange((prev) => prev + 1);
    }

    async function handleCharacterSelected(kind){
        // 4体あるか確認する redux に保存する
        dispatch(setCurrentMyCharacter(charactersForBattle)); //更新
        if(kind === "makeOwnRoom"){
            const fixedSlotsOfChallenger = myCharacters.charactersList.map(character => character.id);
            // proposeBattleで自分が対戦要求ステータスに変更される
            console.log({fixedSlotsOfChallenger});
            await proposeBattle(fixedSlotsOfChallenger, rangeValue);
            setDialogOpen(true);
        }else if(kind === "searchRooms"){
            navigate('/match_make');
        }
    }

    // 開発用・後で消す
    const fixedSlotsOfChallengers = Array();
    async function declineProposal(){
        setDialogOpen(false);
        await cancelProposal();
    }

    async function devHanldeCharacter(){
        await createCharacters(fixedSlotsOfChallengers);
    }

    async function devHanldeProposal(){
        await makeProposers(fixedSlotsOfChallengers);
        // setDialogOpen(false);
        // await cancelProposal();
    }

    // 開発テスト用: Proposalを取り下げる
    async function handleDeclinePros () {
        await cancelProposals();
    }

    // 開発テスト用: 自分に対戦を申し込む
    // TODO: event を listen してマッチを成立させないといけない
    async function handleProposeToMe () {
        await requestChallengeToMe();
        navigate('/battle_main');
    }

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {isChanging ?
                <>{myCharacterList.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard character={character} myCharacterList={myCharacterList} key={index}
                            charactersForBattle={charactersForBattle} setStateChange={setStateChange}
                            setCharactersForBattle={setCharactersForBattle} isChanging={isChanging}/>
                    </Grid>
                ))}</>
                :
                <>{charactersForBattle.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard character={character} key={index} charactersForBattle={charactersForBattle} setStateChange={setStateChange}
                            setCharactersForBattle={setCharactersForBattle} isChanging={isChanging}/>
                    </Grid>
                ))}</>
            }
        </Grid>
        {isChanging ?
            <Button variant="contained" size="large" color="secondary"
                style={ editButtonstyle() } onClick={() => handleUpdate() }>
                変更を保存する
            </Button>
            :
            <Button variant="contained" size="large" style={{marginTop: 10}} onClick={() => setIsChanging(true) }>
                変更
            </Button>
        }

        </Box>

        <Dialog
            open={dialogOpen}
            // onClose={() => setDialogOpen(false)}
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
                        radisu={10}
                        color="#4fa94d"
                        ariaLabel="puff-loading"
                        wrapperStyle={{display: 'inlineBlock'}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>

            <DialogContentText id="alert-dialog-description">
                あああああああああああああああああああああああああああああ<br/>
                あああああああああああああああああああああああああ
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button variant="outlined" color="secondary" onClick={() => handleProposeToMe()} style={{marginLeft: 20, backgroundColor: 'white'}}>
                [dev]自分に対戦を申し込ませる
            </Button>
            <Button  variant="contained" size="large" style={{width: '100%'}} onClick={() => declineProposal()}>
                対戦申告を取り下げる
            </Button>
            </DialogActions>
        </Dialog>

        <Button variant="contained" size="large"
            onClick={() => devHanldeCharacter()} disabled={isChanging}>
            [開発用] ユーザー2~4のキャラを用意する
        </Button>

        <Button variant="contained" size="large"
            onClick={() => devHanldeProposal()} disabled={isChanging}>
            [開発用] ユーザー2~4の3名を対戦可能状態にする
        </Button>

        <Button variant="outlined" color="secondary" onClick={() => handleDeclinePros()} style={{marginLeft: 20, backgroundColor: 'white'}}>
            [dev]全ユーザーのProposalを取り下げる
        </Button>

        { (charactersForBattle.length >= selectedNum) &&
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
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
                        // onChange={(e) => setHealthData({ ...healthData, weight: e.target.value })}
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

                <Button variant="contained" size="large" style={ handleCreateRoomButtonStyle() }
                    onClick={() => handleCharacterSelected('makeOwnRoom') } disabled={isChanging}>
                    対戦の部屋を作る
                </Button>
                <Button variant="contained" size="large" style={ handleSearchRoomButtonStyle() } onClick={() => handleCharacterSelected('searchRooms')} disabled={isChanging}>
                    対戦相手を探す
                </Button>
            </>
        }
    </>)
}
