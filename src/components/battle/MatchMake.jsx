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
import { useSelector } from 'react-redux';
import { selectMyCharacter } from 'slices/myCharacter.ts'
import { getProposalList, requestChallenge } from 'fetch_sol/match_organizer';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function BattleAccount({proposerToBattle}){
    const myCharacters = useSelector(selectMyCharacter);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    async function handleClickStartBattle () {
        const proposalAddressIndex = 0;
        const fixedSlotsOfChallenger = myCharacters.requestCharacterList.map(character => character.id);
        console.log({対戦を申し込む相手のアドレス: proposerToBattle[proposalAddressIndex], 
                    対戦時に使うキャラのアドレス: fixedSlotsOfChallenger})
        await requestChallenge(proposerToBattle[proposalAddressIndex], fixedSlotsOfChallenger);
        navigate('/battle_main');
    };

    return(<>
        <Card onClick={ handleClickOpen }>
            <CardActionArea>
                <CardMedia component="img" height="200"
                    image="https://www.picng.com/upload/sun/png_sun_7636.png" alt="green iguana" />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">アカウント</Typography>
                <Typography variant="body1" color="text.primary">アドレス: {proposerToBattle[0]}</Typography>
                <Typography variant="body1" color="text.primary">要求レベル下限: {proposerToBattle[1]}</Typography>
                <Typography variant="body1" color="text.primary">要求レベル上限: {proposerToBattle[2]}</Typography>
                <Typography variant="body1" color="text.primary">キャラクターレベル合計値 {proposerToBattle[3]}</Typography>
                {/* <Typography variant="body1" color="text.primary">ブロック番号: {proposerToBattle[4]}</Typography> */}
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
                アカウントと対戦しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>やめる</Button>
            <Button onClick={() => handleClickStartBattle()} autoFocus>
                対戦する
            </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default function MatchMake() {
    const [putProposalAccounts, setPutProposalAccounts] = useState([]);

    useEffect(() => {(async function() {
        setPutProposalAccounts(await getProposalList());
    })();}, []);

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
            <>{putProposalAccounts.map((proposalAccount, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                    <BattleAccount proposerToBattle={proposalAccount}/>
                </Grid>
            ))}</>
        </Grid>
    </Box>
    </>)
}
