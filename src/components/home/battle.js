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

function NFTCard({id, selectedData, setStateChange, setSelectedData, isChanging}){
    console.log({selectedData: selectedData, param: id})
    var color = 'white'
    if( isChanging && selectedData.includes(id)){
        color = '#CCFFFF'
    }

    function handleChange(){
        const _selecteddatas = selectedData;
        if (selectedData.includes(id)){
            const popedDatas = _selecteddatas.filter((data, index) => {
                return data != id
            });
            setSelectedData(popedDatas)
        }else{
            if(_selecteddatas.length >= selectedNum){
                console.log("メインキャラクターは4体までです")
            }else{
                _selecteddatas.push(id)
                setSelectedData(_selecteddatas)
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
            <Typography gutterBottom variant="h5" component="div">キャラ{id}</Typography>
            <Typography variant="body1" color="text.primary">レア度: AA</Typography>
            <Typography variant="body1" color="text.primary">属性: AA</Typography>
            <Typography variant="body1" color="text.primary">レベル: AA</Typography>
            <Typography variant="body1" color="text.primary">特性: AA</Typography>
            </CardContent>
        </CardActionArea>
    </Card>
    )
}

export default function Battle() {
    const initData = [0,1,2,3,4,5,6,7,8,9,10];
    const [mainCharacters, setMainCharacters] = useState([0,1,2,3]);
    const [selectedData, setSelectedData] = useState([0,1,2,3]);
    const [isChanging, setIsChanging] = useState(false);
    const [stateChange, setStateChange] = useState(0);
    const navigate = useNavigate();
    

    useEffect(() => {
        /* 第1引数には実行させたい副作用関数を記述*/
        console.log('副作用関数が実行されました！')
    },[stateChange])

    function handleUpdate(){
        setMainCharacters(selectedData)
        setIsChanging(false)
        setStateChange((prev) => prev + 1)
    }

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {isChanging ? 
                <>{initData.map((param, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard id={param} selectedData={selectedData} setStateChange={setStateChange}
                            setSelectedData={setSelectedData} isChanging={isChanging}/>
                    </Grid>
                ))}</>
                :
                <>{selectedData.map((param, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard id={param} selectedData={selectedData} setStateChange={setStateChange}
                            setSelectedData={setSelectedData} isChanging={isChanging}/>
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
        <Button variant="contained" size="large" style={ style() } onClick={() => navigate('/battle_main')} disabled={isChanging}>
          バトルへ
        </Button>
    </>)
}
