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
    latestRound: null | number;
    resultList: IRoundResult[];
}

const initialState: IRoundResultList = { latestRound: null, resultList: [] };
const currentRoundResultSlice = createSlice({
  name: 'currentRoundResult',
  initialState,
  reducers: {
    oneRoundDone(state, action: PayloadAction<IRoundResult>) {
        const _thisRoundRes = action.payload;
        console.log(`保存の最新のラウンドは ${state.latestRound}  で今回のラウンドは　${_thisRoundRes.numRounds}`);
        if(state.latestRound == null){
          console.log("初回の更新......")
          state.resultList = [...state.resultList, action.payload]
          state.latestRound = _thisRoundRes.numRounds;
        } else if (state.latestRound < _thisRoundRes.numRounds){
          console.log("n回目のの更新......")
          state.resultList = [...state.resultList, action.payload]
          state.latestRound = _thisRoundRes.numRounds;
        }
        // if((state.latestRound == null) || (state.latestRound < _thisRoundRes.numRounds)){
        //   state.resultList = [...state.resultList, action.payload]
        //   state.latestRound = _thisRoundRes.numRounds;
        // }
    },
    roundResultReset(state)  {
      state.latestRound = null;
      state.resultList = [];
    },
  },
});

export const selectRoundResult = (state: RootState): IRoundResultList => state.currentRoundResult;
export const { oneRoundDone, roundResultReset } = currentRoundResultSlice.actions;
export default currentRoundResultSlice.reducer;
