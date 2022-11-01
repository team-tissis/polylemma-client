import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IMyCharacter {
  abilityIds: null | number[];
  characterType: String;
  id: number;
  level: number;
  rarity: number;
}
interface IMyCharacterList {
  charactersList: IMyCharacter[];
}

// const initialState: IMyCharacter[] = [];
const initialState: IMyCharacterList = { charactersList: [] };
const currentMyCharacterSlice = createSlice({
  name: 'currentMyCharacter',
  initialState,
  reducers: {
    setCurrentMyCharacter(state, action: PayloadAction<IMyCharacter[]>) {
      state.charactersList = action.payload
    },
    myCharacterRemove(state)  {
      state.charactersList= []
    },
  },
});

// export const selectMyCharacter = (state: RootState): IMyCharacter[] => state.myCharacter;
export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter;
export const { setCurrentMyCharacter, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
