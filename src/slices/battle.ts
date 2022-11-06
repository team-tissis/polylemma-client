import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

// 自分のバトルのステータスを保存する
// 何番目をchoiceしたか？
// どこまでしたか？

// commitChoice => revealChoice => 
// choiceが4の場合はRSを選択したということ
interface IBattleStatus {
  choice: number;
  opponentCommit: boolean;
  myCommit: boolean;
  mySeedRevealed: boolean;
  listenToRoundRes: string;
}

// const statusList: string[] = ['beforeCommitChoice', 'beforeRevealChoice'];
const initialState: IBattleStatus = { choice: 0, opponentCommit: false, myCommit: false, 
                                      mySeedRevealed: false, listenToRoundRes: 'can_choice'};
const currentBattleSlice = createSlice({
  name: 'currentBattle',
  initialState,
  reducers: {
    setCurrentBattle(state, action: PayloadAction<IBattleStatus>) {
      // state.choice: number;
      // state.opponentCommit: boolean;
      // state.myCommit: boolean;
      // state.mySeedRevealed: boolean;
      // state.listenToRoundRes: string;

      state = action.payload;
    },
    setReduxChoice(state, action: PayloadAction<number>) {
      state = {...state, choice: action.payload}
    },
    setReduxOpponentCommit(state, action: PayloadAction<boolean>) {
      state = {...state, opponentCommit: action.payload}
    },
    setReduxMyCommit(state, action: PayloadAction<boolean>) {
      state = {...state, myCommit: action.payload}
    },
    setReduxMySeedRevealed(state, action: PayloadAction<boolean>) {
      state = {...state, myCommit: action.payload}
    },
    setReduxListenToRoundRes(state, action: PayloadAction<string>) {
      state = {...state, listenToRoundRes: action.payload}
    },
    resetBattleStatus(state)  {
      state = initialState;
    },
  },
});


export const selectBattleStatus = (state: RootState): IBattleStatus => state.currentBattle;
export const { setCurrentBattle, resetBattleStatus, setReduxChoice, setReduxOpponentCommit, 
      setReduxMyCommit, setReduxMySeedRevealed, setReduxListenToRoundRes } = currentBattleSlice.actions;
export default currentBattleSlice.reducer;
