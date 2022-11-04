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
  myBlindingFactor: null | string;
  // isUpdate: boolean;
}

// const statusList: string[] = ['beforeCommitChoice', 'beforeRevealChoice'];
const initialState: IBattleStatus = { choice: 0, opponentCommit: false, myCommit: false, 
                                      mySeedRevealed: false, listenToRoundRes: 'can_choice', myBlindingFactor: null};
const currentBattleSlice = createSlice({
  name: 'currentBattle',
  initialState,
  reducers: {
    setCurrentBattle(state, action: PayloadAction<IBattleStatus>) {
      state = action.payload;
    },
    setReduxChoice(state, action: PayloadAction<number>) {
      state.choice = action.payload;
      // state = {...state, choice: action.payload}
    },
    setReduxOpponentCommit(state, action: PayloadAction<boolean>) {
      state.opponentCommit = action.payload
      // state = {...state, opponentCommit: action.payload}
    },
    setReduxMyCommit(state, action: PayloadAction<boolean>) {
      state.myCommit =  action.payload;
      // state = {...state, myCommit: action.payload}
    },
    setReduxMySeedRevealed(state, action: PayloadAction<boolean>) {
      state.mySeedRevealed =  action.payload
      // state = {...state, myCommit: action.payload}
    },
    setReduxListenToRoundRes(state, action: PayloadAction<string>) {
      state.listenToRoundRes = action.payload
      // state = {...state, listenToRoundRes: action.payload}
    },
    setReduxBlindingFactor(state, action: PayloadAction<string>) {
      state.myBlindingFactor = action.payload
      // state = {...state, listenToRoundRes: action.payload}
    },
    resetBattleStatus(state)  {
      // state = initialState;
      state.choice = 0;
      state.opponentCommit = false;
      state.myCommit = false;
      state.mySeedRevealed = false;
      state.listenToRoundRes = 'can_choice';
      state.myBlindingFactor = null;
      // state.isUpdate =  false;
    },
  },
});


export const selectBattleStatus = (state: RootState): IBattleStatus => state.currentBattle;
export const { setCurrentBattle, resetBattleStatus, setReduxChoice, setReduxOpponentCommit, setReduxBlindingFactor, 
      setReduxMyCommit, setReduxMySeedRevealed, setReduxListenToRoundRes } = currentBattleSlice.actions;
export default currentBattleSlice.reducer;
