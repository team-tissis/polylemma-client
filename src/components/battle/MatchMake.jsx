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
import { selectMyCharacter } from 'slices/myCharacter.ts';
import { getContract } from 'fetch_sol/utils.js';
import { getCurrentStamina, getStaminaPerBattle, subscIsExpired } from 'fetch_sol/dealer.js';
import { requestChallenge, getProposalList } from 'fetch_sol/match_organizer.js';
import { eventBattleStarted } from 'fetch_sol/battle_field.js';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function BattleAccount({proposalAccount}){
    const myCharacters = useSelector(selectMyCharacter);
    const [open, setOpen] = useState(false);

    async function handleClickStartBattle () {
        if ((await getCurrentStamina()) < (await getStaminaPerBattle())) {
            // スタミナがあるか確認
            alert("スタミナが足りません。チャージしてください。");
        } else if ((await subscIsExpired()) === true) {
            // サブスクの確認
            alert("サブスクリプションの期間が終了しました。更新して再度バトルに臨んでください。");
        } else {
            const fixedSlotsOfChallenger = myCharacters.battleCharacters.map(character => character.id);
            await requestChallenge(proposalAccount.home, fixedSlotsOfChallenger);
        }
    };

    return(<>
        <Card onClick={() => setOpen(true)}>
            <CardActionArea>
                <CardMedia component="img" height="200"
                    image="https://www.picng.com/upload/sun/png_sun_7636.png" alt="green iguana" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">アカウント</Typography>
                    <Typography variant="body1" color="text.primary">レベル: {proposalAccount.totalLevel}</Typography>
                    <Typography variant="body1" color="text.primary">要求レベル下限: {proposalAccount.lowerBound}</Typography>
                    <Typography variant="body1" color="text.primary">要求レベル上限: {proposalAccount.upperBound}</Typography>
                    <Typography variant="body1" color="text.primary">アドレス: {proposalAccount.home}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
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
                <Button onClick={() => setOpen(false)}>やめる</Button>
                <Button onClick={() => handleClickStartBattle()} autoFocus>
                    対戦する
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}


export default function MatchMake() {
    const navigate = useNavigate();
    const [proposalAccounts, setProposalAccounts] = useState([]);
    const [matched, setMatched] = useState(false);

    useEffect(() => {(async function() {
        const { signer } = getContract("PLMMatchOrganizer");
        const myAddress = await signer.getAddress();
        eventBattleStarted(myAddress, setMatched, false);

        setProposalAccounts(await getProposalList());
    })();}, []);

    useEffect(() => {(async function() {
        if (matched) {
            navigate('/battle_main');
        }
    })();}, [matched]);

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
            <>{proposalAccounts.map((proposalAccount, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                    <BattleAccount proposalAccount={proposalAccount}/>
                </Grid>
            ))}</>
        </Grid>
    </Box>
    </>)
}
