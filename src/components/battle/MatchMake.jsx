import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import { selectMyCharacter } from 'slices/myCharacters.ts';
import { useSnackbar } from 'notistack';
import { getContract } from 'fetch_sol/utils.js';
import { getCurrentStamina, getStaminaPerBattle, subscIsExpired } from 'fetch_sol/dealer.js';
import { requestChallenge, getProposalList } from 'fetch_sol/match_organizer.js';
import { eventBattleStarted } from 'fetch_sol/battle_field.js';
import PersonIcon from '@mui/icons-material/Person';
import LoadingDOM from 'components/applications/loading';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function BattleAccount({proposalAccount, setLoadingStatus}){
    const { enqueueSnackbar } = useSnackbar();
    const myCharacters = useSelector(selectMyCharacter);
    const [open, setOpen] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    async function handleClickStartBattle (setIsStarting) {
        setLoadingStatus({isLoading: true, message: `${proposalAccount.home} との対戦の準備中です。`});
        setIsStarting(true);
        if ((await getCurrentStamina()) < (await getStaminaPerBattle())) {
            // スタミナがあるか確認
            alert("スタミナが足りません。チャージしてください。");
            setIsStarting(false);
        } else if ((await subscIsExpired()) === true) {
            // サブスクの確認
            alert("サブスクリプションの期間が終了しました。更新して再度バトルに臨んでください。");
            setIsStarting(false);
        } else {
            try {
                const fixedSlotsOfChallenger = myCharacters.battleCharacters.map(character => character.id);
                await requestChallenge(proposalAccount.home, fixedSlotsOfChallenger);
                const message = "相手とマッチしました！";
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'success',
                });
            } catch (e) {
                setIsStarting(false);
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。バトル状態をリセットしてみてください。");
                }
            }
        }
        setLoadingStatus({isLoading: false, message: null});
    };

    return(<>
        <Card onClick={() => setOpen(true)} >
            <CardActionArea>
                <CardContent>
                    <Typography variant="body1" color="text.primary"><PersonIcon/></Typography>
                    <Typography variant="body1" color="text.primary">
                        アドレス: <Chip label={proposalAccount.home} color="primary" component="span" />
                    </Typography>
                    <Typography variant="body1" color="text.primary">レベル: {proposalAccount.totalLevel}</Typography>
                    <Typography variant="body1" color="text.primary">要求レベル下限: {proposalAccount.lowerBound}</Typography>
                    <Typography variant="body1" color="text.primary">要求レベル上限: {proposalAccount.upperBound}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        <Dialog
            open={open}
            // onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                以下のアカウントとバトルしますか？
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component="div">
                    <Typography variant="body1" color="text.primary">アドレス: {proposalAccount.home}</Typography>
                    <Typography variant="body1" color="text.primary">レベル: {proposalAccount.totalLevel}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} disabled={isStarting} variant="contained">キャンセル</Button>
                <Button onClick={() => handleClickStartBattle(setIsStarting)} disabled={isStarting} variant="contained" color="primary">
                    バトル開始
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}


export default function MatchMake() {
    const navigate = useNavigate();
    const [proposalAccounts, setProposalAccounts] = useState([]);
    const [matched, setMatched] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState({isLoading: false, message: null});

    useEffect(() => {(async function() {
        setLoadingStatus({isLoading: true, message: null});
        const { signer } = getContract("PLMMatchOrganizer");
        const myAddress = await signer.getAddress();
        eventBattleStarted(myAddress, setMatched, false);

        setProposalAccounts(await getProposalList());
        setLoadingStatus({isLoading: false, message: null});
    })();}, []);

    useEffect(() => {(async function() {
        if (matched) {
            navigate('/battle_main');
        }
    })();}, [matched]);

    return(<>
        <LoadingDOM isLoading={loadingStatus.isLoading} message={loadingStatus.message}/>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                <>{proposalAccounts.map((proposalAccount, index) => (
                    <Grid item xs={12} sm={4} md={4} key={index}>
                        <BattleAccount proposalAccount={proposalAccount} setLoadingStatus={setLoadingStatus}/>
                    </Grid>
                ))}</>
            </Grid>
        </Box>
        <Button variant="contained" size="large" onClick={() => navigate('../')}>
            メインページに戻る
        </Button>
    </>)
}
