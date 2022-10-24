import Container from '@mui/material/Container';
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '../../icons/avatar_1.png'


function NFTCharactorCard({id}){
    console.log("ああああああああああ")
    return(<>
        <Paper elevation={3}　style={{backgroundColor: '#FFBEDA', height: 200}}>
            トークン
        </Paper>
    </>)
}

function PlayerYou(){
    const myCharactors = [1,2,3,4]
    const randomSlot = 'a'
    myCharactors.push(randomSlot)
    return(<>
        <Container>
            <div style={{ textAlign: 'right', verticalAlign: 'middle'}}>
                プレイヤーA
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

function PlayerI(){
    const myCharactors = [5,6,7,8]
    const randomSlot = 'b'
    myCharactors.push(randomSlot)

    return(<>
    <Container>
        <Grid container spacing={{ xs: 5, md: 5 }} style={{textAlign: 'center'}} columns={{ xs: 10, sm: 10, md: 10 }}>
            {myCharactors.map((id, index) => (
                <Grid item xs={2} sm={2} md={2} key={index}>
                    <NFTCharactorCard id={id}/>
                </Grid>
            ))}
        </Grid>
        <div style={{marginLeft: 'auto', marginRight: 0}}>
            左よせええええ
        </div>
    </Container>
    </>)
}

export default function BattleMain(){
    console.log("読み込み中........")
    return(<>
        <Container style={{backgroundColor: '#EDFFBE', marginTop: '10%'}}>
            <PlayerYou/>
            <div style={{height: 100}}/>
            <PlayerI/>
            ああああああああああああああ
        </Container>
    </>)
}
