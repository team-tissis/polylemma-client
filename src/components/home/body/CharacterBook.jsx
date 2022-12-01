import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import 'css/card.css';
import { totalSupply, getAllTokenOwned, getAllCharacterInfo, getNumberOfOwnedTokens } from 'fetch_sol/token.js';
import characterInfo from "assets/character_info.json";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function CharacterCard({character, myOwnedCharacters}){
    const characterAttribute = characterInfo.attributes[character.attributeIds[0]];
    const characterType = characterInfo.characterType[character.characterType];
    const isOwned = myOwnedCharacters.includes(character.id);
    const addedClassName = isOwned ? "" : " card_not_mine";

    return(<>
        <div className="card_parent" style={{backgroundColor: characterAttribute["backgroundColor"]}} >
            <div className="card_name">
                { character.name }
            </div>

            <div className="box" style={{padding: 10}}>
                レベル: { character.level }
                {isOwned && <>
                <br/>
                絆レベル: { character.bondLevel }
                </>}
            </div>

            <div className="character_type_box"
                style={{backgroundColor: characterType['backgroundColor'], borderColor: characterType['borderColor']}}>
                { characterType['jaName'] }
            </div>

            <div className="img_box">
                <img className={'img_div'+addedClassName} src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="sample"/>
            </div>

            <div className="attribute_box">
                レア度 {character.rarity}<br/>
                { characterAttribute["title"] }
            </div>

            <div className="detail_box">
                <div style={{margin: 10}}>
                    { characterAttribute["description"] }
                </div>
            </div>
        </div>
    </>)
}


export default function CharacterBook() {
    const [allCharacters, setAllCharacters] = useState([]);
    const [myOwnedCharacters, setMyOwnedCharacters] = useState([]);

    const [numTotalToken, setNumTotalToken] = useState();
    const [numMyToken, setNumMyToken] = useState();

    useEffect(() => {(async function() {
        setNumTotalToken(await totalSupply());
        setNumMyToken(await getNumberOfOwnedTokens());
    })();}, []);

    useEffect(() => {(async function() {
        setAllCharacters(await getAllCharacterInfo());
        setMyOwnedCharacters(await getAllTokenOwned());
    })();}, []);

    return(<>
        <div>
            持ってるキャラは濃く、持っていないキャラは薄く表示されます。
        </div>
        <div>
            合計のキャラの数: {numTotalToken}
        </div>
        <div>
            自分のキャラの数: {numMyToken}
        </div>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
                <>{allCharacters.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <CharacterCard character={character} myOwnedCharacters={myOwnedCharacters} key={index}/>
                    </Grid>
                ))}</>
            </Grid>
        </Box>
    </>)
}
