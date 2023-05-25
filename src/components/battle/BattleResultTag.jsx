import * as React from 'react';
import { useState } from "react"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import DialogContentText from '@mui/material/DialogContentText';


export default function BattleResultTag({myAddress, battleResultDialog, setBattleResultDialog, roundResults, round, battleInfo}) {
    const navigate = useNavigate();
    
    function backHome() {
        setBattleResultDialog({open: false, result: ""})
        navigate('../');
        window.location.reload()
    }
    return (<>
        <div>
            <Dialog
                open={battleResultDialog.open}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{textAlign: 'center'}}>バトル結果 {battleResultDialog.result}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                <Card variant="outlined" style={{marginRight: 20, padding: 10, lineHeight: 2}}>
                    <Grid container>
                        <Grid container>
                            <Grid item xs={6} md={6}></Grid>
                            <Grid item xs={6} md={6}>攻撃力</Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={3} md={3}>ラウンド</Grid>
                            <Grid item xs={3} md={3}>勝敗</Grid>
                            <Grid item xs={3} md={3}>自分</Grid>
                            <Grid item xs={3} md={3}>相手</Grid>
                        </Grid>
                        {roundResults.map((roundResult, index) => (
                            index < round && <Grid container key={index}>
                                <Grid item xs={3} md={3}>{index + 1}</Grid>
                                <Grid item xs={3} md={3}>{roundResult.isDraw ? <>△</> : (myAddress === roundResult.winner) ? <>○</> : <>×</>}</Grid>
                                <Grid item xs={3} md={3}>{(myAddress === roundResult.winner) ? roundResult.winnerDamage : roundResult.loserDamage}</Grid>
                                <Grid item xs={3} md={3}>{(myAddress === roundResult.winner) ? roundResult.loserDamage : roundResult.winnerDamage}</Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => backHome()}>
                    ホーム画面に戻る
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    </>)
}
