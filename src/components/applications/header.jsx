import React , { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import { balanceOf } from 'fetch_sol/coin.js';
import HeaderDrawer from 'components/applications/drawer'

export default function Header() {
    const [currentCoin, setCurrentCoin] = useState();

    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
    })();}, []);

    return (<>
        <Box sx={{ display: 'flex'}} style={{height: 60, backgroundColor: 'grey'}}>
            <MuiAppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Polylemma
                    </Typography>
                    <Button variant="outlined" color="inherit" style={{marginLeft: 20}}>
                        所持コイン: {`${currentCoin} PLM`}
                    </Button>
                    <HeaderDrawer/>
                </Toolbar>
            </MuiAppBar>
        </Box>
    </>);
}
