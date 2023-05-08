import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "Store";

interface IBattleInfo {
  battleId: null | number;
  isCOM: null | boolean;     // コンピューターと対戦する際に使用
  comAddress: null | number; // コンピューターと対戦する際に使用
  myPlayerId: null | number;
  myPlayerSeed: null | string;
  myChoice: null | number;
  myLevelPoint: null | number;
  isChoiceRevealed: boolean;
  myBlindingFactor: null | string;
  isBlindingFactorUsed: boolean;
}

const initialState: IBattleInfo = {
  battleId: null,
  isCOM: null,
  comAddress: null,
  myPlayerId: null,
  myPlayerSeed: null,
  myChoice: null,
  myLevelPoint: null,
  isChoiceRevealed: true,
  myBlindingFactor: null,
  isBlindingFactorUsed: true,
};

const ANVIL_INIT_ACCOUNTS: string[] = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
  "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
  "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
  "0x976ea74026e726554db657fa54763abd0c3a0aa9",
  "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
  "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
  "0xa0ee7a142d267c1f36714e4a8f75612f20a79720"
]

const battleInfoSlice = createSlice({
  name: "battleInfo",
  initialState,
  reducers: {
    setBattleId(state, action: PayloadAction<number>) {
      state.battleId = action.payload;
    },
    setComputerInfo(state, action: PayloadAction<string[]>) {
      // addressを2つ受け取り、ANVIL_INIT_ACCOUNTSの中に該当するアドレスがあるか探す。
      // 存在した場合、コンピューターのアドレスをセットする
      const aliceAddress = action.payload[0].toLowerCase();
      const bobAddress = action.payload[1].toLowerCase();
      const myAddress = action.payload[2].toLowerCase();
      var searchAddress;
      if (myAddress == bobAddress) {
        searchAddress = aliceAddress
      } else {
        searchAddress = bobAddress
      }
      const index = ANVIL_INIT_ACCOUNTS.indexOf(searchAddress);
      if (index !== -1) {
        state.isCOM = true;
        state.comAddress = index;
      }
    },
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
    setMyLevelPoint(state, action: PayloadAction<number>) {
      state.myLevelPoint = action.payload;
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
    initializeBattle(state) {
      state.battleId = null;
      state.isCOM = null
      state.comAddress = null
      state.myPlayerId = null
      state.myPlayerSeed = null
      state.myChoice = null
      state.myLevelPoint = null
      state.isChoiceRevealed = true
      state.myBlindingFactor =  null
      state.isBlindingFactorUsed = true
    },
  },
});

export const selectBattleInfo = (state: RootState): IBattleInfo =>
  state.battleInfo;
export const {
  setBattleId, 
  setComputerInfo,
  setMyPlayerId,
  setMyPlayerSeed,
  setMyChoice,
  setMyLevelPoint,
  setChoiceUsed,
  setMyBlindingFactor,
  setBlindingFactorUsed,
  initializeBattle,
} = battleInfoSlice.actions;
export default battleInfoSlice.reducer;
