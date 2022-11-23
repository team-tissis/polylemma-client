import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Store';

interface IBattleCharacter {
    index:  number;
    name: string;
    imgURI: string;
    characterType: String;
    level: number;
    bondLevel: number;
    rarity: number;
    attributeIds: null | number[];
    isRandomSlot: boolean;
    battleDone: boolean;
}

interface IOpponentBattleCharacter {
    index: number;
    name: null | string;
    imgURI: null | string;
    characterType: null | String;
    level: null | number;
    bondLevel: null | number;
    rarity: null | number;
    attributeIds: null | number[];
    isRandomSlot: boolean;
    battleDone: boolean;
}

interface IMyCharacter {
    id: number;
    index:  number;
    name: string;
    imgURI: string;
    characterType: String;
    level: number;
    bondLevel: number;
    rarity: number;
    attributeIds: null | number[];
}

interface IMyCharacterList {
    charactersList: IBattleCharacter[];
    otherCharactersList: IOpponentBattleCharacter[];
    // otherCharactersList: IBattleCharacter[];
    requestCharacterList: IMyCharacter[];
    hasRandomSlot: boolean;
    tmpMyPlayerSeed: null | string;
    playerId: null | number;
}

const initialState: IMyCharacterList = { charactersList: [] ,otherCharactersList: [],
                    requestCharacterList: [], hasRandomSlot: false , tmpMyPlayerSeed: null, playerId: null};
const currentMyCharacterSlice = createSlice({
    name: 'currentMyCharacter',
    initialState,
    reducers: {
        set4Characters(state, action: PayloadAction<IMyCharacter[]>) {
            // TODO: 各キャラにindexを振る
            state.requestCharacterList = action.payload;
            // 実際の対戦キャラは初期化
            state.charactersList = []
            state.otherCharactersList = []
            state.hasRandomSlot = false;
            state.tmpMyPlayerSeed = null;
            state.playerId = null;
        },
        // set5BattleCharacter(state, action: PayloadAction<IMyCharacter[]>) {
        set5BattleCharacter(state, action: PayloadAction<IBattleCharacter[]>) {
            // TODO: 各キャラにindexを振る
            const _tmpCharacterList = action.payload;
            const resultCharacterList: IBattleCharacter[] = []
            for (let charaIndex = 0; charaIndex < _tmpCharacterList.length; charaIndex++) {
                // _tmpCharacterList[charaIndex].index = charaIndex
                resultCharacterList.push({
                    ..._tmpCharacterList[charaIndex],
                    index: charaIndex
                })
            }
            state.charactersList = resultCharacterList
            state.hasRandomSlot = true;
        },
        setOthersBattleCharacter(state, action: PayloadAction<IOpponentBattleCharacter[]>) {
            // TODO: 各キャラにindexを振る
            state.otherCharactersList = action.payload;
        },
        // 相手キャラクターのバトルが終了したものを更新する
        choiceOtherCharacterInBattle(state, action: PayloadAction<number>) {
            // TODO: 各キャラにindexを振る
            const _otherCharacterIndex: number = action.payload
            state.otherCharactersList[_otherCharacterIndex].battleDone = true;
        },
        // 相手キャラがRSを使用した際に、RSの詳細情報を更新する
        setOpponentRsFullInfo(state, action: PayloadAction<IOpponentBattleCharacter>) {
            // TODO: 各キャラにindexを振る
            const charactersExceptRs = state.otherCharactersList.filter((character, index) => {
                return character.isRandomSlot === false
            });
            // RSを配列の最後に挿入する
            state.otherCharactersList = [...charactersExceptRs, action.payload]
        },
        setTmpMyPlayerSeed(state, action: PayloadAction<string>) {
            state.tmpMyPlayerSeed = action.payload;
        },
        setPlayerId(state, action: PayloadAction<number>) {
            state.playerId = action.payload;
        },
        addRandomSlotToCurrentMyCharacter(state, action: PayloadAction<IBattleCharacter>) {
            state.charactersList = [...state.charactersList, action.payload]
            state.hasRandomSlot = true;
            // indexを割り振る
            for (let charaIndex = 0; charaIndex < state.charactersList.length - 1; charaIndex++) {
                state.charactersList[charaIndex].index = charaIndex
            }
        },
        notInBattleVerifyCharacters(state) {
            state.hasRandomSlot = false;
            state.tmpMyPlayerSeed = null;
        },
        choiceCharacterInBattle(state, action: PayloadAction<number>) {
            const _characterIndex: number = action.payload
            state.charactersList[_characterIndex].battleDone = true;
        },
        myCharacterRemove(state)  {
            state.charactersList= []
            state.hasRandomSlot = false;
        },
    },
});

export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter;
export const { set4Characters, set5BattleCharacter, addRandomSlotToCurrentMyCharacter, setTmpMyPlayerSeed, setPlayerId, setOpponentRsFullInfo,
                choiceOtherCharacterInBattle, setOthersBattleCharacter , notInBattleVerifyCharacters, choiceCharacterInBattle,
                myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
