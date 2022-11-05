import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

// interface IMyCharacter {
interface IBattleCharacter {
    index:  number;
    name: string;
    imgURI: string;
    characterType: String;
    level: number;
    bondLevel: null | number;
    rarity: number;
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
    requestCharacterList: IMyCharacter[];
    hasRandomSlot: boolean;
    tmpMyPlayerSeed: null | string;
}

const initialState: IMyCharacterList = { charactersList: [] , requestCharacterList: [], hasRandomSlot: false , tmpMyPlayerSeed: null};
const currentMyCharacterSlice = createSlice({
    name: 'currentMyCharacter',
    initialState,
    reducers: {
        set4Characters(state, action: PayloadAction<IMyCharacter[]>) {
            // TODO: 各キャラにindexを振る
            state.requestCharacterList = action.payload;
            // 実際の対戦キャラは初期化
            state.charactersList = []
        },
        // set5BattleCharacter(state, action: PayloadAction<IMyCharacter[]>) {
        set5BattleCharacter(state, action: PayloadAction<IBattleCharacter[]>) {
            // TODO: 各キャラにindexを振る
            console.log({実際の対戦が始まった際の5体のキャクター: action.payload})
            const _tmpCharacterList = action.payload;
            const resultCharacterList: IBattleCharacter[] = []
            for (let charaIndex = 0; charaIndex < _tmpCharacterList.length; charaIndex++) {
                // _tmpCharacterList[charaIndex].index = charaIndex
                resultCharacterList.push({
                    ..._tmpCharacterList[charaIndex],
                    index: charaIndex
                })
            }
            console.log({VER2_実際の対戦が始まった際の5体のキャクター: resultCharacterList})
            state.charactersList = resultCharacterList
            state.hasRandomSlot = true;
        },
        setTmpMyPlayerSeed(state, action: PayloadAction<string>) {
            state.tmpMyPlayerSeed = action.payload
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
export const { set4Characters, set5BattleCharacter, addRandomSlotToCurrentMyCharacter, setTmpMyPlayerSeed,
                notInBattleVerifyCharacters, choiceCharacterInBattle, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
