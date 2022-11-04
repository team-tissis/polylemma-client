import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

// console.log(`${numRounds+1} Round: Winner ${winner} ${winnerDamage} vs Loser ${loser} ${loserDamage}.`);
// 2 Round: Winner 0 4 vs Loser 1 1.
// const users = { 0: 'alice', 1: 'bob' };

const USERS = { 0: 'Alice', 1: 'Bob' };
// 対戦結果を表示するためのREDUX
interface IRoundResult {
    numRounds: number;
    isDraw: boolean;
    winner: number;
    loser: number;
    winnerDamage: number;
    loserDamage: number;
}

interface IRoundResultList {
    latestRound: number;
    resultList: IRoundResult[];
}

const initialState: IRoundResultList = { latestRound: 0, resultList: [] };
const currentRoundResultSlice = createSlice({
  name: 'currentRoundResult',
  initialState,
  reducers: {
    oneRoundDone(state, action: PayloadAction<IRoundResult>) {
        state.resultList = [...state.resultList, action.payload]
        state.latestRound++;
    },
    roundResultReset(state)  {
      state.latestRound = 0;
      state.resultList = [];
    },
  },
});

export const selectRoundResult = (state: RootState): IRoundResultList => state.currentRoundResult;
export const { oneRoundDone, roundResultReset } = currentRoundResultSlice.actions;
export default currentRoundResultSlice.reducer;
