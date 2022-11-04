import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IMyCharacter {
  abilityIds: null | number[];
  characterType: String;
  id: number;
  level: number;
  rarity: number;
  isRandomSlot: boolean;
  battleDone: boolean;
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
    addRandomSlotToCurrentMyCharacter(state, action: PayloadAction<IMyCharacter>) {
    // addRandomSlotToCurrentMyCharacter(state, action: any) {
      state.charactersList = [...state.charactersList, action.payload]
      state.hasRandomSlot = true;
    },
    notInBattleVerifyCharacters(state) {
      state.hasRandomSlot = false;
      const resetedMyCharacters = state.charactersList.filter((character, index) => {
        return character.isRandomSlot == false;
      });
      // バトルステータスをfalseにする
      resetedMyCharacters.forEach(character => character.battleDone = false);
      // if(character.isRandomSlot == false){
      //   {
      //     abilityIds: character.abilityIds,
      //     characterType: character.characterType,
      //     id: character.id,
      //     level: character.level,
      //     rarity: character.rarity,
      //     isRandomSlot: character.isRandomSlot,
      //     battleDone: false
      //   }
      // }
      
      state.charactersList = resetedMyCharacters;
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

// export const selectMyCharacter = (state: RootState): IMyCharacter[] => state.myCharacter;
export const selectMyCharacter = (state: RootState): IMyCharacterList => state.myCharacter;
export const { setCurrentMyCharacter, addRandomSlotToCurrentMyCharacter, 
                notInBattleVerifyCharacters, choiceCharacterInBattle, myCharacterRemove } = currentMyCharacterSlice.actions;
export default currentMyCharacterSlice.reducer;
