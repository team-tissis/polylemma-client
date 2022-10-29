import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getBalance, getAllTokenOwned, getCoinForLevelUp, getCharacterInfo, firstCharacterInfo, allCharacterInfo } from '../../fetch_sol/utils.js'
import { handleLevelUp } from '../../fetch_sol/training.js';

function bottomBoxstyle() {
    return {
        position: 'fixed',
        borderStyle: 'solid',
        borderColor: '#CCCCCC',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingTop: 10,
        passingBottom: 10,
        bottom: 0,
        left: '1%',
        width: '98%',
        fontSize: 20,
        fontWeight: 600,
        backgroundColor: '#F7F7F7'
    }
}

export default function ModelTraining(){
    const initData = [1,2,3,4,5,6,7,8,9,10];
    const [selectedTokenId, setSelectedTokenId] = useState();
    const [isOpened, setIsOpened] = useState(false);
    const [coinToBuy, setCoinToBuy] = useState(0);

    const [levelBefore, setLevelBefore] = useState();
    const [coinForLevelUp, setCoinForLevelUp] = useState();
    const [currentCoin, setCurrentCoin] = useState();

    useEffect(() => {(async function() {
        setCoinForLevelUp(await getCoinForLevelUp());
        setCurrentCoin(await getBalance());
    })();}, []);

    const handleClickCharacter = async (id) => {
        setCoinForLevelUp(await getCoinForLevelUp(id));
        setSelectedTokenId(id);
        const characterBefore = await getCharacterInfo(id);
        console.log(characterBefore);
        setLevelBefore(characterBefore.level);
    }

    // コインを使用してレベルアップさせる
    const handleClickLevelUp = async () => {
        await handleLevelUp(selectedTokenId);
        setCoinForLevelUp(await getCoinForLevelUp(selectedTokenId));

        // for debug
        await getAllTokenOwned();
        await firstCharacterInfo();
        await allCharacterInfo();
    }

    const items = [
        {id: 1, title: "タイトル1", subtitle: "サブタイトル1"},
        {id: 2, title: "タイトル2", subtitle: "サブタイトル2"},
        {id: 3, title: "タイトル3", subtitle: "サブタイトル3"},
        {id: 4, title: "タイトル4", subtitle: "サブタイトル4"},
        {id: 5, title: "タイトル5", subtitle: "サブタイトル5"},
        {id: 6, title: "タイトル6", subtitle: "サブタイトル6"},
        {id: 7, title: "タイトル7", subtitle: "サブタイトル7"},
        {id: 8, title: "タイトル8", subtitle: "サブタイトル8"}
    ]
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if ( event && event.type === 'keydown' && ((event).key === 'Tab' || (event).key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    // 画面サイズを取得
    var windowWidth = window.innerWidth;

    return(<>
        <h1>キャラ一覧</h1>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {initData.map((id, index) => (
                <Grid item xs={3} sm={3} md={3} key={index}>
                    <Card style={{backgroundColor: (id==selectedTokenId) ? '#CCFFFF' : 'white'}} onClick={ () => handleClickCharacter(id) }>
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
                </Grid>
            ))}

            <SwipeableDrawer
                style={{maxWidth: windowWidth*0.1}}
                anchor={'right'}
                open={state['right']}
                onClose={toggleDrawer('right', false)}
                onOpen={toggleDrawer('right', true)}
            >
                <Grid container style={{padding: 20}}>
                    <Grid item xs={12} sm={12} md={12}>
                        <h1>現在の所持コイン: {currentCoin} コイン</h1>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <p>新しくコインを追加で購入しますか？</p>
                    </Grid>
                    <Grid item={12}>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                            id="outlined-adornment-weight"
                            value={coinToBuy}
                            type="number"
                            onChange={(e) => setCoinToBuy(e.target.value)}
                            endAdornment={<InputAdornment position="end">コイン</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">コイン</FormHelperText>
                            ※ ここに円計算の大体の値段を動的に表示できると👍
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Button variant="contained" disableElevation style={{width: '60%'}}>
                            購入する
                        </Button>
                    </Grid>
                </Grid>
            </SwipeableDrawer>

        </Grid>
        </Box>
        {selectedTokenId &&
            <Box style={ bottomBoxstyle() }>
                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={11} sm={2} md={2}>キャラ{selectedTokenId}</Grid>
                    <Grid item xs={1} sm={6} md={6}/>

                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={4} sm={2} md={2}>レベル</Grid>
                    <Grid item xs={1} sm={1} md={1}>{levelBefore}</Grid>
                    <Grid item xs={2} sm={1} md={1}><>→</></Grid>
                    <Grid item xs={1} sm={1} md={1}>{levelBefore+1}</Grid>
                    <Grid item xs={1} sm={4} md={4}/>
                </Grid>

                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={5} sm={3} md={3}>レベルアップに必要なコイン数</Grid>
                    <Grid item xs={1} sm={1} md={1}>{coinForLevelUp}</Grid>
                    <Grid item xs={4} sm={1} md={1}>コイン</Grid>
                    <Grid item xs={1} sm={4} md={4}/>
                </Grid>

                <Grid container style={{fontSize: 24, marginTop: 5}} spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid item xs={1} sm={4.5} md={4.5}/>
                    <Grid item xs={10} sm={3} md={3}>
                        <Button variant="contained" onClick={handleClickLevelUp} style={{width: '100%', height: 80, fontSize: 30}}>
                            確定
                        </Button>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}/>

                    <Grid item xs={1} sm={0} md={0}/>
                    <Grid item xs={10} sm={2.5} md={2.5}>
                        <Button variant="contained" onClick={toggleDrawer('right', true)} style={{width: '95%', height: 60, fontSize: 25, marginRight: '5%'}}>
                            コインを購入
                        </Button>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}/>
                </Grid>
            </Box>
        }
    </>)
}
