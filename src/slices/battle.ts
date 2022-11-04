import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IBattle {
    status: number;
    nonce: string[];
    seed: string[];
    doneCharacterIndexes: number[];
}

interface IEachBattleStatus {
    thisNonce: string;
    thisSeed: string;
    thisCharacterIndex: number;
}

const initialState: IBattle = { status: 0, nonce: [], seed: [], doneCharacterIndexes: [] };
const currentBattleSlice = createSlice({
  name: 'currentBattle',
  initialState,
  reducers: {
    setCurrentBattle(state, action: PayloadAction<IBattle>) {
        // TODO something
    },
    setOneBattle(state, action: PayloadAction<IEachBattleStatus>) {
        state.nonce = [...state.nonce, action.payload.thisNonce];
        state.seed = [...state.seed, action.payload.thisSeed];
        state.doneCharacterIndexes = [...state.doneCharacterIndexes, action.payload.thisCharacterIndex];
    },
    battleRemove(state)  {
      state.status = 0;
      state.nonce = [];
      state.seed = [];
      state.doneCharacterIndexes = [];
    },
  },
});

export const selectBattleStatus = (state: RootState): IBattle => state.currentBattle;
export const { setOneBattle, battleRemove } = currentBattleSlice.actions;
export default currentBattleSlice.reducer;
