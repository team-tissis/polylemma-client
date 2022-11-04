import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IMyCharacter {
  id: number;
  index:  number;
  name: string;
  imgURI: string;
  level: number;
  rarity: number;
  isRandomSlot: boolean;
  battleDone: boolean;
  attributeIds: null | number[];
  characterType: String;
}
interface IMyCharacterList {
  charactersList: IMyCharacter[];
  hasRandomSlot: boolean;
  tmpMyPlayerSeed: null | string;
}

const initialState: IMyCharacterList = { charactersList: [] , hasRandomSlot: false , tmpMyPlayerSeed: null};
const currentMyCharacterSlice = createSlice({
  name: 'currentMyCharacter',
  initialState,
  reducers: {
    setCurrentMyCharacter(state, action: PayloadAction<IMyCharacter[]>) {
      // TODO: 各キャラにindexを振る
      const _tmpCharacterList = action.payload;
      const resultCharacterList: IMyCharacter[] = []
      for (let charaIndex = 0; charaIndex < _tmpCharacterList.length - 1; charaIndex++) {
        // _tmpCharacterList[charaIndex].index = charaIndex
        resultCharacterList.push({
            ..._tmpCharacterList[charaIndex],
            index: charaIndex
        })
      }
      state.charactersList = resultCharacterList
      state.hasRandomSlot = true;
    },
    setTmpMyPlayerSeed(state, action: PayloadAction<string>) {
      state.tmpMyPlayerSeed = action.payload
    },
    addRandomSlotToCurrentMyCharacter(state, action: PayloadAction<IMyCharacter>) {
    // addRandomSlotToCurrentMyCharacter(state, action: any) {
      state.charactersList = [...state.charactersList, action.payload]
      state.hasRandomSlot = true;
      // indexを割り振る
      for (let charaIndex = 0; charaIndex < state.charactersList.length - 1; charaIndex++) {
        state.charactersList[charaIndex].index = charaIndex
      }
    },
    notInBattleVerifyCharacters(state) {
      state.hasRandomSlot = false;
      const resetedMyCharacters = state.charactersList.filter((character, index) => {
        return character.isRandomSlot === false;
      });
      // バトルステータスをfalseにする
      resetedMyCharacters.forEach(character => character.battleDone = false);
      state.charactersList = resetedMyCharacters;
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
export const { setCurrentMyCharacter, addRandomSlotToCurrentMyCharacter, setTmpMyPlayerSeed,
                notInBattleVerifyCharacters, choiceCharacterInBattle, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
