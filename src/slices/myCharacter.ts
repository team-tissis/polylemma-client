import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IMyCharacter {
  abilityIds: null | number[];
  characterType: String;
  id: number;
  level: number;
  rarity: number;
  isRandomSlot: boolean;
}
interface IMyCharacterList {
  charactersList: IMyCharacter[];
  hasRandomSlot: boolean;
}

const initialState: IMyCharacterList = { charactersList: [] , hasRandomSlot: false };
const currentMyCharacterSlice = createSlice({
  name: 'currentMyCharacter',
  initialState,
  reducers: {
    setCurrentMyCharacter(state, action: PayloadAction<IMyCharacter[]>) {
      state.charactersList = action.payload
    },
    // addRandomSlotToCurrentMyCharacter(state, action: PayloadAction<IMyCharacter>) {
    addRandomSlotToCurrentMyCharacter(state, action: any) {
      state.charactersList = [...state.charactersList, action.payload]
      state.hasRandomSlot = true;
    },
    notInBattleVerifyCharacters(state) {
      state.hasRandomSlot = false;
      const resetedMyCharacters = state.charactersList.filter((character, index) => {
        return character.isRandomSlot == false;
      });
      state.charactersList = resetedMyCharacters;
    },
    myCharacterRemove(state)  {
      state.charactersList= []
      state.hasRandomSlot = false;
    },
  },
});

// export const selectMyCharacter = (state: RootState): IMyCharacter[] => state.myCharacter;
export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter;
export const { setCurrentMyCharacter, addRandomSlotToCurrentMyCharacter, notInBattleVerifyCharacters, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
