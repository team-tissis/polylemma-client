import React, { useState, useEffect } from 'react';
import './card.css';
import 'react-tabs/style/react-tabs.css';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { getOwnedCharacterWithIDList , getAllCharacterInfo} from '../../fetch_sol/token.js';
import characterInfo from "./character_info.json";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function NFTCard({character}){
    const thisCharacterAbility = character.abilityIds[0];
    const charaType = characterInfo.characterType[character.characterType];

    return(<>
        <div class="card_parent" style={{backgroundColor: characterInfo.attributes[thisCharacterAbility]["backgroundColor"]}} >
            <div class="card_name">
                キャラクター名をここに書く
            </div>
            <div class="box">
                <p>{ character.level }</p>
            </div>
            <div class="character_type_box" 
                style={{backgroundColor: charaType['backgroundColor'], borderColor: charaType['borderColor']}}>
                { charaType['jaName'] }
            </div>
            <div class="img_box" >
                <img className='img_div' src="https://www.picng.com/upload/sun/png_sun_7636.png" alt="sample"/>
            </div>
            <div class="attribute_box">
                { characterInfo.attributes[thisCharacterAbility]["title"] }
            </div>
            <div class="detail_box">
                <div style={{margin: 10}}>
                    { characterInfo.attributes[thisCharacterAbility]["description"] }
                </div>
            </div>
        </div>
    </>)
}


export default function CharacterBook() {
    const [allCharacters, setAllCharacters] = useState([]);

    useEffect(() => {(async function() {
        setAllCharacters(await getAllCharacterInfo())
    })();}, []);

    return(<>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
                <>{allCharacters.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <NFTCard character={character} key={index} />
                    </Grid>
                ))}</>
            </Grid>
        </Box>
    </>)
}
