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

export default function ModelTraining(){
    const initData = [0,1,2,3,4,5,6,7,8,9,10];
    const [selectedNFT, setSelectedNFT] = useState();

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
        {/* <Button variant="contained" size="large" style={ style() } >
          バトルへ
        </Button> */}
    </>)
}
