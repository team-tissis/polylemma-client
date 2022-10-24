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
    const initData = [0,1,2,3,4,5,6,7,8,9,10];
    const [selectedNFT, setSelectedNFT] = useState();
    const [selectedId, setSelectedId] = useState(null)
    const [isOpened, setIsOpened] = useState(false)

    // トークンを使用してレベルアップさせる
    function handleLevelUp(){

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

    return(<>
        <h1>キャラ一覧</h1>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {initData.map((id, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <Card style={{backgroundColor: (id==selectedNFT) ? '#CCFFFF' : 'white'}} onClick={ () => setSelectedNFT(id) }>
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
        </Grid>
        </Box>
        {selectedNFT &&
            <Box style={ bottomBoxstyle() }>
                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={11} sm={2} md={2}>キャラ{selectedNFT}</Grid>
                    <Grid item xs={1} sm={6} md={6}/>

                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={4} sm={2} md={2}>レベル</Grid>
                    <Grid item xs={1} sm={1} md={1}>10</Grid>
                    <Grid item xs={2} sm={1} md={1}><>→</></Grid>
                    <Grid item xs={1} sm={1} md={1}>11</Grid>
                    <Grid item xs={1} sm={4} md={4}/>
                </Grid>

                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={5} sm={3} md={3}>レベルアップに必要なトークン数</Grid>
                    <Grid item xs={1} sm={1} md={1}>3</Grid>
                    <Grid item xs={4} sm={1} md={1}>トークン</Grid>
                    <Grid item xs={1} sm={4} md={4}/>
                </Grid>

                <Grid container style={{fontSize: 24, marginTop: 5}} spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid item xs={1} sm={4.5} md={4.5}/>
                    <Grid item xs={10} sm={3} md={3}>
                        <Button variant="contained" style={{width: '100%', height: 80, fontSize: 30}}>
                            確定
                        </Button>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}/>

                    <Grid item xs={1} sm={0} md={0}/>
                    <Grid item xs={10} sm={2.5} md={2.5}>
                        <Button variant="contained" style={{width: '95%', height: 60, fontSize: 25, marginRight: '5%'}}>
                        トークンを購入
                        </Button>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}/>
                </Grid>
            </Box>
        }
    </>)
}
