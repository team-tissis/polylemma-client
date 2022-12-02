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
const myCharactersSlice = createSlice({
    name: 'myCharacters',
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
            const isUpdated = [];
            for (let battleIdx = 0; battleIdx < state.battleCharacters.length; battleIdx++) {
                isUpdated.push(false);
            }
            for (let ownedIdx = 0; ownedIdx < ownedCharacters.length; ownedIdx++) {
                const battleIdx = state.battleCharacters.findIndex(character => character.id === ownedCharacters[ownedIdx].id);
                if (battleIdx >= 0) {
                    isUpdated[battleIdx] = true;
                    state.battleCharacters[battleIdx] = ownedCharacters[ownedIdx];
                }
            }
            state.battleCharacters = state.battleCharacters.filter((character, index) => isUpdated[index]);
        },
        initializeBattleCharacters(state)  {
            state.battleCharacters = [];
        },
    },
});

export const selectMyCharacter = (state: RootState): IMyCharacters => state.myCharacters;
export const { setBattleCharacters, addBattleCharacters, removeBattleCharacters, updateBattleCharacters, initializeBattleCharacters } = myCharactersSlice.actions;
export default myCharactersSlice.reducer;
