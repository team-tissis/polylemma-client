import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IBattle {
    status: number;
    nonce: string[];
    seed: string[];
    doneCharacterIds: number[];
}

interface IEachBattleStatus {
    thisNonce: string;
    thisSeed: string;
    thisCharacterId: number;
}

const initialState: IBattle = { status: 0, nonce: [], seed: [], doneCharacterIds: [] };
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
        state.doneCharacterIds = [...state.doneCharacterIds, action.payload.thisCharacterId];
    },
    battleRemove(state)  {
      state.status = initialState.status;
      state.nonce = initialState.nonce;
      state.seed = initialState.seed;
      state.doneCharacterIds = initialState.doneCharacterIds;
    },
  },
});

export const selectBattleStatus = (state: RootState): IBattle => state.currentBattle;
export const { setOneBattle, battleRemove } = currentBattleSlice.actions;
export default currentBattleSlice.reducer;
