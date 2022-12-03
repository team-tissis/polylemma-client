import React , { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { balanceOf } from 'fetch_sol/coin.js';
import SwipeableTemporaryDrawer from 'components/applications/drawer'


export default function Header() {
    const [currentCoin, setCurrentCoin] = useState();

    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
    })();}, []);

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const drawerWidth = 380;

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        }),
    }));

    return (<>
        <Box sx={{ display: 'flex'}} style={{height: 60, backgroundColor: 'grey'}}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Polylemma
                    </Typography>
                    <Button variant="outlined" color="inherit" style={{marginLeft: 20}}>
                        所持コイン: {`${currentCoin} PLM`}
                    </Button>
                    <SwipeableTemporaryDrawer/>
                </Toolbar>
            </AppBar>
        </Box>
    </>);
}
