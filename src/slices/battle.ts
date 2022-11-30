import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Store';

interface IBattleInfo {
    myPlayerId: null | number;
    myPlayerSeed: null | string;
    myChoice: null | number;
    isChoiceRevealed: boolean;
    myBlindingFactor: null | string;
    isBlindingFactorUsed: boolean;
}

const initialState: IBattleInfo = { myPlayerId: null, myPlayerSeed: null, myChoice: null, isChoiceRevealed: true, myBlindingFactor: null, isBlindingFactorUsed: true };
const battleInfoSlice = createSlice({
    name: 'battleInfo',
    initialState,
    reducers: {
        setMyPlayerId(state, action: PayloadAction<number>) {
            state.myPlayerId = action.payload;
        },
        setMyPlayerSeed(state, action: PayloadAction<string>) {
            state.myPlayerSeed = action.payload;
        },
        setMyChoice(state, action: PayloadAction<number>) {
            state.myChoice = action.payload;
            state.isChoiceRevealed = false;
        },
        setChoiceUsed(state) {
            state.isChoiceRevealed = true;
        },
        setMyBlindingFactor(state, action: PayloadAction<string>) {
            state.myBlindingFactor = action.payload;
            state.isBlindingFactorUsed = false;
        },
        setBlindingFactorUsed(state) {
            state.isBlindingFactorUsed = true;
        },
        initializeBattle(state)  {
            state.myPlayerId = null;
            state.myPlayerSeed = null;
            state.myChoice = null;
            state.isChoiceRevealed = true;
            state.myBlindingFactor = null;
            state.isBlindingFactorUsed = true;
        },
    },
});

export const selectBattleInfo = (state: RootState): IBattleInfo => state.battleInfo;
export const { setMyPlayerId, setMyPlayerSeed, setMyChoice, setChoiceUsed, setMyBlindingFactor, setBlindingFactorUsed, initializeBattle } = battleInfoSlice.actions;
export default battleInfoSlice.reducer;
