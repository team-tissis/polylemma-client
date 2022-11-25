import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import characterInfo from "assets/character_info.json";
import { balanceOf } from 'fetch_sol/coin.js';
import { updateLevel, getNecessaryExp, getCurrentCharacterInfo, getOwnedCharacterWithIDList } from 'fetch_sol/token.js';

function bottomBoxstyle() {
    return {
        zIndex: 30,
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

function NFTCard({character, setNecessaryExp, selectedTokenId, setSelectedTokenId, setLevelBefore}) {
    const thisCharacterAttribute = character.attributeIds[0];
    const charaType = characterInfo.characterType[character.characterType];
    const _backgroundColor = (selectedTokenId === character.id) ? 'grey' : 'white'
    const borderColor = (selectedTokenId === character.id) ? 'black' : 'silver'
    const cardBackColor = (selectedTokenId === character.id) ? 'orange' : '#FFDBC9'

    const handleClickCharacter = async (id) => {
        setNecessaryExp(await getNecessaryExp(id));
        setSelectedTokenId(id);
        const characterBefore = await getCurrentCharacterInfo(id);
        setLevelBefore(characterBefore.level);
    }

    return(<>
        <div className="card_parent" style={{backgroundColor: characterInfo.attributes[thisCharacterAttribute]["backgroundColor"]}}
            onClick={ () => handleClickCharacter(character.id) } >
            <div className="card_name">
                { character.name }
            </div>
            <div className="box" style={{borderColor: borderColor, backgroundColor: cardBackColor, padding: 10}}>
                レベル: { character.level }<br/>
                絆レベル: { character.bondLevel }
            </div>
            <div className="character_type_box"
                style={{backgroundColor: charaType['backgroundColor'], borderColor: charaType['borderColor']}}>
                { charaType['jaName'] }
            </div>
            <div className="img_box" style={{backgroundColor: _backgroundColor}}>
                <img className='img_div' src={ character.imgURI } style={{width: '90%', height: 'auto'}} alt="sample"/>
            </div>
            <div className="attribute_box">
                レア度 {character.rarity} / { characterInfo.attributes[thisCharacterAttribute]["title"] }
            </div>
            <div className="detail_box">
                <div style={{margin: 10}}>
                    { characterInfo.attributes[thisCharacterAttribute]["description"] }
                </div>
            </div>
        </div>
    </>);
}
export default function ModelTraining(){
    const [isLoading, setIsLoading] = useState(0);
    const [selectedTokenId, setSelectedTokenId] = useState();
    const [levelBefore, setLevelBefore] = useState();
    const [necessaryExp, setNecessaryExp] = useState();
    const [currentCoin, setCurrentCoin] = useState();
    const [myCharacterList, setMyCharacterList] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {(async function() {
        setMyCharacterList(await getOwnedCharacterWithIDList())
        setCurrentCoin(await balanceOf());
    })();}, [isLoading]);

    // コインを使用してレベルアップさせる
    const handleClickLevelUp = async () => {
        // トークンが足りなかった場合snackbarを表示
        if (currentCoin < necessaryExp) {
            const message = "コインが足りないです、チャージしてください。";
            enqueueSnackbar(message, {
                autoHideDuration: 1500,
                variant: 'error',
            });
            return
        } else {
            try {
                await updateLevel(selectedTokenId);
                setNecessaryExp(await getNecessaryExp(selectedTokenId));
                // isLoadingが更新されると画面を再描画するように設定 AND LvUp後にisLoadingを更新
                const characterBefore = await getCurrentCharacterInfo(selectedTokenId);
                setLevelBefore(characterBefore.level);
                setIsLoading((prev) => prev + 1)
            } catch (e) {
                if (e.message.substr(0, 18) === "transaction failed") {
                    alert("トランザクションが失敗しました。ガス代が安すぎる可能性があります。");
                } else {
                    alert("不明なエラーが発生しました。");
                }
            }
        }
    }

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    // 画面サイズを取得
    var windowWidth = window.innerWidth;

    return(<>
        <h1>キャラ一覧</h1>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 6, sm: 12, md: 12 }}>
            {myCharacterList.map((character, index) => (<>
                <Grid item xs={3} sm={3} md={3} key={index}>
                    <NFTCard character={character}  setNecessaryExp={setNecessaryExp}
                        selectedTokenId={selectedTokenId} setSelectedTokenId={setSelectedTokenId} setLevelBefore={setLevelBefore}/>
                </Grid>
            </>))}
        </Grid>
        </Box>
        {selectedTokenId &&
            <Box style={ bottomBoxstyle() }>
                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={11} sm={2} md={2}>キャラID {selectedTokenId}</Grid>
                    <Grid item xs={1} sm={6} md={6}/>

                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={4} sm={3} md={3}>レベル</Grid>
                    <Grid item xs={1} sm={1} md={1}>{levelBefore}</Grid>
                    <Grid item xs={2} sm={1} md={1}><>→</></Grid>
                    <Grid item xs={1} sm={1} md={1}>{levelBefore+1}</Grid>
                    <Grid item xs={1} sm={4} md={4}/>
                </Grid>

                <Grid container style={{fontSize: 24}} spacing={{ xs: 5, md: 5 }}>
                    <Grid item xs={1} sm={3} md={3}/>
                    <Grid item xs={5} sm={3} md={3}>レベルアップに必要なコイン数</Grid>
                    <Grid item xs={1} sm={1} md={1}>{necessaryExp}</Grid>
                    <Grid item xs={4} sm={1} md={1}>コイン</Grid>
                    <Grid item xs={1} sm={2} md={2}/>
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
                    <Grid item xs={1} sm={1} md={1}/>
                </Grid>
            </Box>
        }
    </>)
}
