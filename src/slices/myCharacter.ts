import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Store';

interface IMyCharacter {
    id: number;
    name: string;
    imgURI: string;
    characterType: String;
    level: number;
    bondLevel: number;
    rarity: number;
    attributeIds: number[];
}

interface IMyCharacters {
    battleCharacters: IMyCharacter[];
}

const initialState: IMyCharacters = { battleCharacters: [] };
const myCharacterSlice = createSlice({
    name: 'myCharacter',
    initialState,
    reducers: {
        setBattleCharacters(state, action: PayloadAction<IMyCharacter[]>) {
            state.battleCharacters = action.payload;
        },
        addBattleCharacters(state, action: PayloadAction<IMyCharacter>) {
            if (state.battleCharacters.length < 4) {
                state.battleCharacters.push(action.payload);
            }
        },
        removeBattleCharacters(state, action: PayloadAction<IMyCharacter>) {
            state.battleCharacters = state.battleCharacters.filter(character => character.id !== action.payload.id);
        },
        updateBattleCharacters(state, action: PayloadAction<IMyCharacter[]>) {
            const ownedCharacters = action.payload;
            for (let ownedIdx = 0; ownedIdx < ownedCharacters.length; ownedIdx++) {
                const battleIdx = state.battleCharacters.findIndex(character => character.id === ownedCharacters[ownedIdx].id);
                if (battleIdx >= 0) {
                    state.battleCharacters[battleIdx] = ownedCharacters[ownedIdx];
                }
            }
        },
        initializeBattleCharacters(state)  {
            state.battleCharacters = [];
        },
    },
});

export const selectMyCharacter = (state: RootState): IMyCharacters => state.myCharacter;
export const { setBattleCharacters, addBattleCharacters, removeBattleCharacters, updateBattleCharacters, initializeBattleCharacters } = myCharacterSlice.actions;
export default myCharacterSlice.reducer;
