import Container from '@mui/material/Container';
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '../../icons/avatar_1.png'
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

// TODO::すでにバトルに出したキャラは選択できない
function NFTCharactorCard({id, thisCharacter, setThisCharacter, extraLevel}){
    useEffect(() => {
        console.log("レベルを読み込み中........")
    },[extraLevel])

    return(<>
        <Paper onClick={() =>　setThisCharacter(id) } elevation={8}　
            style={{backgroundColor: (thisCharacter == id) ? '#FFBEDA' : '#30F9B2', height: 200}}>
            {(extraLevel > 0)&(thisCharacter == id) ? 
                <>トークン {id + extraLevel} .Lv ( +{extraLevel}.Lv )</>
                : <>トークン {id}.Lv</>
            }
            
        </Paper>
    </>)
}

function PlayerYou(){
    const myCharactors = [1,2,3,4]
    const randomSlot = 'a'
    myCharactors.push(randomSlot)
    return(<>
        <Container style={{padding: 10}}>
            <div style={{ textAlign: 'right', verticalAlign: 'middle'}}>
                <div>プレイヤーB <Chip label="Lv.120" style={{fontSize: 20}} /></div>
                <img src={Icon}  alt="アイコン" width="60" height="60"/>
            </div>
            <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
                {myCharactors.map((id, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard id={id}/>
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
            {myCharactors.map((id, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard id={id} 
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
    const myCharactors = [5,6,7,8]
    const randomSlot = 'b'
    myCharactors.push(randomSlot)
    const totalExtraLevel = 10;
    const [extraLevel, setExtraLevel] = useState(10);

    useEffect(() => {
        console.log("読み込み中........")
    },[thisCharacter])
    
    return(<>
        {/* padding: 20,  */}
        <Box style={{textAlign: 'center', width: 200}}>
            <div style={{textAlign: 'center', fontSize: 20, marginBottom: 30}}>残り時間</div>
            <div style={{textAlign: 'center'}}><UrgeWithPleasureComponent /></div>
        </Box>
        <Container style={{backgroundColor: '#EDFFBE', marginTop: '10%', marginBottom: '10%'}}>
            <PlayerYou/>
            <div style={{height: 100}}/>
            <PlayerI myCharactors={myCharactors} thisCharacter={thisCharacter} setThisCharacter={setThisCharacter}
                    totalExtraLevel={totalExtraLevel} extraLevel={extraLevel} setExtraLevel={setExtraLevel} />
        </Container>
    </>)
}
