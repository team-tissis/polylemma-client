import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import characterInfo from "assets/character_info.json";
import { balanceOf } from 'fetch_sol/coin.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import { updateLevel, getNecessaryExp, getCurrentCharacterInfo, getOwnedCharacterWithIDList } from 'fetch_sol/token.js';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Chip from '@mui/material/Chip';


function CharacterCard({character, selectedTokenId, setSelectedTokenId, setOpen, setSelectedCharacter, setCurrentLevel, setNecessaryExp}) {
    const characterAttribute = characterInfo.attributes[character.attributeIds[0]];
    const characterType = characterInfo.characterType[character.characterType];
    const borderColor = (selectedTokenId === character.id) ? 'black' : 'silver';
    const backgroundColor = (selectedTokenId === character.id) ? 'orange' : '#FFDBC9';
    const imgBackgroundColor = (selectedTokenId === character.id) ? 'black' : 'white';

    async function handleClickCharacter() {
        setSelectedCharacter(character);
        setSelectedTokenId(character.id);
        setCurrentLevel((await getCurrentCharacterInfo(character.id)).level);
        setNecessaryExp(await getNecessaryExp(character.id));
        setOpen(true);
    }

    return(<>
        <div className="card_parent" style={{backgroundColor: characterAttribute["backgroundColor"]}}
            onClick={() => handleClickCharacter()} >
            <div className="card_name">
                { character.name }
            </div>

            <div className="box" style={{borderColor: borderColor, backgroundColor: backgroundColor, padding: 10}}>
                ?????????: { character.level }<br/>
                ????????????: { character.bondLevel }
            </div>

            <div className="character_type_box"
                style={{backgroundColor: characterType['backgroundColor'], borderColor: characterType['borderColor']}}>
                { characterType['jaName'] }
            </div>

            <div className="img_box" style={{backgroundColor: imgBackgroundColor}}>
                <img className='img_div' src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="sample"/>
            </div>

            <div className="attribute_box">
                ????????? {character.rarity}<br/>
                { characterAttribute["title"] }
            </div>

            <div className="detail_box">
                <div style={{margin: 10}}>
                    { characterAttribute["description"] }
                </div>
            </div>
        </div>
    </>);
}

// ??????????????????????????????????????????
function DialogCharacterCard({character}) {
    const characterAttribute = characterInfo.attributes[character.attributeIds[0]];
    const characterType = characterInfo.characterType[character.characterType];

    return(<>
        <div className="card_parent" style={{backgroundColor: characterAttribute["backgroundColor"]}} >
            <div className="card_name">
                { character.name }
            </div>

            <div className="box" style={{ padding: 10}}>
                ?????????: { character.level }<br/>
                ????????????: { character.bondLevel }
            </div>

            <div className="character_type_box"
                style={{backgroundColor: characterType['backgroundColor']}}>
                { characterType['jaName'] }
            </div>

            <div className="img_box">
                <img className='img_div' src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="sample"/>
            </div>

            <div className="attribute_box">
                ????????? {character.rarity}<br/>
                { characterAttribute["title"] }
            </div>

            <div className="detail_box">
                <div style={{margin: 10}}>
                    { characterAttribute["description"] }
                </div>
            </div>
        </div>
    </>);
}


export default function Training({currentCoin, setCurrentCoin}){
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [myOwnedCharacters, setMyOwnedCharacters] = useState([]);

    const [selectedTokenId, setSelectedTokenId] = useState();
    const [selectedCharacter, setSelectedCharacter] = useState();
    const [currentLevel, setCurrentLevel] = useState();
    const [necessaryExp, setNecessaryExp] = useState();

    useEffect(() => {(async function() {
        setCurrentCoin(await balanceOf());
        setMyOwnedCharacters(await getOwnedCharacterWithIDList());
    })();}, []);

    // ???????????????????????????????????????????????????
    const handleClickLevelUp = async () => {
        setOpen(false);
        // ??????????????????????????????????????? snackbar ?????????
        if (currentCoin < necessaryExp) {
            const message = "??????????????????????????????????????????????????????????????????";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'error',
            });
        } else {
            try {
                const updatedLevel = await updateLevel(selectedTokenId);
                const message = "????????? " + updatedLevel + " ??????????????????!";
                enqueueSnackbar(message, {
                    autoHideDuration: 1500,
                    variant: 'success',
                });

                // ?????????????????????????????????????????????
                setCurrentCoin(await balanceOf());
                setMyOwnedCharacters(await getOwnedCharacterWithIDList());
            } catch (e) {
                console.log({error: e});
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("???????????????????????????????????????????????????????????????????????????????????????????????????");
                } else {
                    alert("??????????????????????????????????????????");
                }
            }
        }
    }

    const steps = [
        `??????(Lv. ${currentLevel})`,
        `?????????????????????(Lv. ${currentLevel + 1})`
    ];

    return(<>
        <h1>???????????????</h1>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
                {myOwnedCharacters.map((character, index) => (
                    <Grid item xs={3} sm={3} md={3} key={index}>
                        <CharacterCard character={character} selectedTokenId={selectedTokenId} setSelectedTokenId={setSelectedTokenId}
                            setSelectedCharacter={setSelectedCharacter} setOpen={setOpen}
                            setCurrentLevel={setCurrentLevel} setNecessaryExp={setNecessaryExp}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
        {selectedCharacter && <>
        <Dialog onClose={() => setOpen(false)} open={open} style={{margin: 20, padding: 20}}>
            <List sx={{ pt: 0 }} style={{margin: 20, padding: 20}}>
                <ListItem style={{minWidth: 345}}>
                    <DialogCharacterCard character={selectedCharacter}/>
                </ListItem>
                <ListItem style={{minWidth: 345}}>
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={0} alternativeLabel>
                            {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                            ))}
                        </Stepper>
                    </Box>
                </ListItem>
                <ListItem  style={{minWidth: 345}}>
                    ??????????????????????????????????????????: <Chip label={`${necessaryExp} PLM`} variant="outlined" component="span" /><br/>
                </ListItem>
            </List>
            <DialogActions>
                <Button variant="contained" onClick={() => setOpen(false)}>??????</Button>
                <Button variant="contained" onClick={ async () => await handleClickLevelUp()}>?????????????????????</Button>
            </DialogActions>
        </Dialog>
        </>}
    </>)
}
