import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
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
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { setCurrentMyCharacter, myCharacterRemove, selectMyCharacter } from '../../slices/myCharacter.ts'
import { useSelector, useDispatch } from 'react-redux';
import { getOwnedCharacterWithIDList } from '../../fetch_sol/utils.js'
import { useSnackbar } from 'notistack';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function style() {
    return {
        position: 'fixed',
        bottom: 10,
        right: '35%',
        width: '30%',
        fontSize: 20,
        fontWeight: 600
    }
}
function styleA() {
    return {
        position: 'fixed',
        bottom: 10,
        right: '55%',
        width: '20%',
        fontSize: 17,
        fontWeight: 600
    }
}
function styleB() {
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
        fontWeight: 600
    }
}

const selectedNum = 4;

function NFTCard({character, charactersForBattle, setStateChange, myCharacterList, setCharactersForBattle, isChanging}){
    const { enqueueSnackbar } = useSnackbar();
    var color = 'white'
    const result = charactersForBattle.filter(cha => cha.id === character.id);
    const alreadySelected = (result.length > 0) ? true : false;
    if( isChanging && alreadySelected){
        color = '#CCFFFF'
    }

    function handleChange(){
        const _selectedData = charactersForBattle;
        if (alreadySelected){
            const popThisData = _selectedData.filter((data, index) => {
                return data.id !== character.id
            });
            setCharactersForBattle(popThisData)
        }else{
            if(_selectedData.length >= selectedNum){
                const message = "対戦に選べるキャラクターは4体までです"
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'error',
                });
            }else{
                _selectedData.push(character)
                setCharactersForBattle(_selectedData)
            }
        }
        setStateChange((prev) => prev + 1)
    }

    return(
        <Card style={{backgroundColor: color}} onClick={ isChanging ? () => handleChange() : null}>
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
    </Card>
    )
}


export default function Battle() {
    const dispatch = useDispatch();
    const myCharacters = useSelector(selectMyCharacter);
    const [charactersForBattle, setCharactersForBattle] = useState([]);
    const [isChanging, setIsChanging] = useState(false);
    const [stateChange, setStateChange] = useState(0);
    const navigate = useNavigate();
    const [open, setOpen] = useState(0);
    const [myCharacterList, setMyCharacterList] = useState([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleClickOpen = () => {
        setDialogOpen(true);
    };
    const handleClose = () => {
        setDialogOpen(false);
    };


    useEffect(() => {(async function() {
        setCharactersForBattle(myCharacters)
    })();}, []);


    useEffect(() => {(async function() {
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
        setIsChanging(false)
        setStateChange((prev) => prev + 1)
    }

    function handleCharacterSelected(kind){
        // 4体あるか確認する redux に保存する
        dispatch(setCurrentMyCharacter(charactersForBattle)); //更新
        if(kind === "makeOwnRoom"){
            setDialogOpen(true);
        }else if(kind === "searchRooms"){
            navigate('/match_make')
        }
    }

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {isChanging ?
                <>{myCharacterList.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard character={character} myCharacterList={myCharacterList}
                            charactersForBattle={charactersForBattle} setStateChange={setStateChange}
                            setCharactersForBattle={setCharactersForBattle} isChanging={isChanging}/>
                    </Grid>
                ))}</>
                :
                <>{charactersForBattle.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard character={character} charactersForBattle={charactersForBattle} setStateChange={setStateChange}
                            setCharactersForBattle={setCharactersForBattle} isChanging={isChanging}/>
                    </Grid>
                ))}</>
            }
        </Grid>
        {isChanging ?
            <Button variant="contained" size="large" color="secondary" style={ editButtonstyle() } onClick={() => handleUpdate() }>
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
            onClose={handleClose}
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
            <Button onClick={handleClose} autoFocus>戻る</Button>
            </DialogActions>
        </Dialog>
        { (charactersForBattle.length >= selectedNum) &&
            <>
                {/* 自分のスタミナをスマコン側から確認する && スタミナがなければボタンは押せない */}
                <Button variant="contained" size="large" style={ styleA() } onClick={() => handleCharacterSelected('makeOwnRoom') } disabled={isChanging}>
                対戦の部屋を作る
                </Button>
                <Button variant="contained" size="large" style={ styleB() } onClick={() => handleCharacterSelected('searchRooms')} disabled={isChanging}>
                対戦相手を探す
                </Button>
            </>
        }
    </>)
}
