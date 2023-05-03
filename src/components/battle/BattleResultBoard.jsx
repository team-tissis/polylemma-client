import * as React from 'react';
import { useState } from "react"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';


export default function BattleResultBoard({battleResult, roundResults,round, battleInfo, battleResultBoardOpen, setBattleResultBoardOpen}){
    return <>
        <Dialog
            open={battleResultBoardOpen}
            onClose={() => setBattleResultBoardOpen(false) }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                バトル結果一覧
            </DialogTitle>
            <DialogContent>
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
                            <Grid item xs={3} md={3}>{roundResult.isDraw ? <>△</> : (battleInfo.myPlayerId === roundResult.winner) ? <>○</> : <>×</>}</Grid>
                            <Grid item xs={3} md={3}>{(battleInfo.myPlayerId === roundResult.winner) ? roundResult.winnerDamage : roundResult.loserDamage}</Grid>
                            <Grid item xs={3} md={3}>{(battleInfo.myPlayerId === roundResult.winner) ? roundResult.loserDamage : roundResult.winnerDamage}</Grid>
                        </Grid>
                    ))}
                </Grid>
            </Card>
            {battleResult &&
                <Card variant="outlined" style={{marginRight: 20, padding: 10}}>
                    <Grid container spacing={3}>
                        <Grid item xs={4} md={4}>勝敗</Grid>
                        <Grid item xs={4} md={4}>自分</Grid>
                        <Grid item xs={4} md={4}>相手</Grid>

                        <Grid item xs={4} md={4}>{battleResult.isDraw ? <>△</> : (battleInfo.myPlayerId === battleResult.winner) ? <>○</> : <>×</>}</Grid>
                        <Grid item xs={4} md={4}>{(battleInfo.myPlayerId === battleResult.winner) ? battleResult.winnerCount : battleResult.loserCount}</Grid>
                        <Grid item xs={4} md={4}>{(battleInfo.myPlayerId === battleResult.winner) ? battleResult.loserCount : battleResult.winnerCount}</Grid>
                    </Grid>
                </Card>
            }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setBattleResultBoardOpen(false)} autoFocus>
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
