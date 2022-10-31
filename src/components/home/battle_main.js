import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '../../icons/avatar_1.png'
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { selectMyCharacter } from '../../slices/myCharacter.ts';
import { useSelector, useDispatch } from 'react-redux';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


// TODO::すでにバトルに出したキャラは選択できない
function NFTCharactorCard({character, thisCharacter, setThisCharacter, extraLevel}){
    useEffect(() => {
        console.log({character})
        console.log("レベルを読み込み中........")
    },[extraLevel])

    return(<>
        <Paper onClick={() =>　setThisCharacter(character.id) } elevation={10}
            style={{backgroundColor: (thisCharacter === character.id) ? '#FFBEDA' : '#30F9B2', height: 200, borderStyle: 'solid', borderColor: 'white', borderWidth: 5}}>
            トークンID {character.id} <br/>
            {(extraLevel > 0)&(thisCharacter === character.id) ?
                <>レベル {character.level + extraLevel}( +{extraLevel}.Lv )<br/></>
                : <>レベル {character.level}.Lv<br/></>
            }
            属性: {character.characterType}
        </Paper>
    </>)
}

function style() {
    return {
        position: 'fixed',
        bottom: 20,
        right: '38%',
        width: '24%',
        fontSize: 17,
        fontWeight: 600
    }
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

function PlayerI({myCharactors, thisCharacter, setThisCharacter, totalExtraLevel, extraLevel, setExtraLevel}){
    return(<>
    <Container style={{padding: 10}}>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {myCharactors.map((myCharactor, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard character={myCharactor}
                        thisCharacter={thisCharacter} setThisCharacter={setThisCharacter} extraLevel={extraLevel} />
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
                onChange={(e) => setExtraLevel(e.target.value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={totalExtraLevel}
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
    const totalExtraLevel = 10;
    const [extraLevel, setExtraLevel] = useState(0);
    const myCharacters = useSelector(selectMyCharacter);

    useEffect(() => {
        console.log({自分のキャラ: myCharacters})
        console.log("読み込み中........")
    },[thisCharacter])

    return(<>
    <Grid container spacing={10} style={{margin: 10}} columns={{ xs: 10, sm: 10, md: 10 }}>
        <Grid item xs={10} md={6}>
            <Container style={{backgroundColor: '#EDFFBE', marginBottom: '10%'}}>
                <PlayerYou/>
                <div style={{height: 100}}/>
                <PlayerI myCharactors={myCharacters} thisCharacter={thisCharacter} setThisCharacter={setThisCharacter}
                        totalExtraLevel={totalExtraLevel} extraLevel={extraLevel} setExtraLevel={setExtraLevel} />
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
            <Fab variant="extended" style={ style() } color="primary" aria-label="add">
                勝負するキャラクターを確定する
            </Fab>
        }
    </Grid>
    </>)
}
