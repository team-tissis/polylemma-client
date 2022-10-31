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
  values: IMyCharacter[];
}
const initialState: IMyCharacterList = { values: [] };
const currentMyCharacterSlice = createSlice({
  name: 'currentMyCharacter',
  initialState,
  reducers: {
    setCurrentMyCharacter: (state, action: any) => {
      function createData(
          id: number,
          rarity: number,
          level: number,
          characterType: string,
          abilityIds: number[]
      ): IMyCharacter {
          return { id, rarity, level , characterType, abilityIds};
      }
      const stateData: IMyCharacter[] = action.payload.map(function(actionData){
          return createData( actionData.id, actionData.rarity, actionData.level, actionData.characterType, actionData.abilityIds)
      })  
      return {
        ...state,
        values: stateData
      }
    },
    myCharacterRemove: (state) => {
      return {
        ...state,
        values: []
      }
    },
  },
});
export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter.values;
export const { setCurrentMyCharacter, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
