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
        console.log({バトルの確認: action.payload})
      state = action.payload
      state.status = 1;
    },
    // 1戦終わるごとに、nonceとseedとdoneCharacterIdsの追加を行う
    // PayloadAction<IEachBattleStatus>
    setOneBattle(state, action: PayloadAction<IBattle>) {
        console.log({旧ステート: state, アクション: action.payload})
        // ここに追加していく
        // state = action.payload
        const newState: IBattle = {
            status: state.status,
            nonce: ['hoge'],
            seed: ['fuga'],
            doneCharacterIds: [1]
        }
        state = newState;
        // state = {
        //     status: state.status,
        //     nonce: [...state.nonce, 'hoge'],
        //     seed: [...state.seed, 'fuga'],
        //     doneCharacterIds: [...state.doneCharacterIds, 1],
        // }
    },
    battleRemove(state)  {
      state = initialState;
    },
  },
});

export const selectBattleStatus = (state: RootState): IBattle => state.currentBattle;
export const { setCurrentBattle, setOneBattle, battleRemove } = currentBattleSlice.actions;
export default currentBattleSlice.reducer;
