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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

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

function BattleAccount({id}){
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return(<>
        <Card onClick={ handleClickOpen }>
            <CardActionArea>
                <CardMedia component="img" height="200"
                    image="https://www.picng.com/upload/sun/png_sun_7636.png" alt="green iguana" />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">アカウント{id}</Typography>
                <Typography variant="body1" color="text.primary">要素1: AA</Typography>
                <Typography variant="body1" color="text.primary">要素2: AA</Typography>
                {/* <Typography variant="body1" color="text.primary">レベル: AA</Typography>
                <Typography variant="body1" color="text.primary">特性: AA</Typography> */}
                </CardContent>
            </CardActionArea>
        </Card>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            対戦を行う
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                アカウント{id}と対戦しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>やめる</Button>
            <Button onClick={() => navigate('/battle_main')} autoFocus>
                対戦する
            </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default function MatchMake() {
    const initData = [0,1,2,3,4,5,6,7,8,9,10];
    const [mainCharacters, setMainCharacters] = useState([0,1,2,3]);
    const [selectedData, setSelectedData] = useState([0,1,2,3]);
    const [isChanging, setIsChanging] = useState(false);
    const [stateChange, setStateChange] = useState(0);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        /* 第1引数には実行させたい副作用関数を記述*/
        console.log('')
    },[stateChange])

    function handleUpdate(){
        setMainCharacters(selectedData)
        setIsChanging(false)
        setStateChange((prev) => prev + 1)
    }

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
            <>{initData.map((param, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                    <BattleAccount id={param}/>
                </Grid>
            ))}</>

        </Grid>
    </Box>
    </>)
}
