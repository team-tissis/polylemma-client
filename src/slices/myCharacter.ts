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
    myCharacterRemove(state)  {
      state.charactersList= []
      state.hasRandomSlot = false;
    },
  },
});

// export const selectMyCharacter = (state: RootState): IMyCharacter[] => state.myCharacter;
export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter;
export const { setCurrentMyCharacter, addRandomSlotToCurrentMyCharacter, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
