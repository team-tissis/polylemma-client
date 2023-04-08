import { SatelliteAlt } from '@mui/icons-material';
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

interface IAddressCharacters {
    walletAddress: string;
    battleCharacters: IMyCharacter[];
}

interface IMyCharacters {
    currentAddress: string | null
    battleCharacters: IMyCharacter[];
    charactersList: IAddressCharacters[];
}

const initialState: IMyCharacters = { 
    currentAddress: null , 
    battleCharacters: [], 
    charactersList: []
};

const myCharactersSlice = createSlice({
    name: 'myCharacters',
    initialState,
    reducers: {
        setBattleCharacters(state, action: PayloadAction<IMyCharacter[]>) {
            state.battleCharacters = action.payload;
        },
        addBattleCharacters(state, action: PayloadAction<IMyCharacter>) {
            const len = state.battleCharacters.length;
            const current_id = action.payload.id;
            if (len === 0) {
                state.battleCharacters.push(action.payload);
            } else if (len === 1) {
                if (current_id > state.battleCharacters[0].id) {
                    state.battleCharacters.push(action.payload);
                } else {
                    state.battleCharacters.push(state.battleCharacters[0]);
                    state.battleCharacters[0] = action.payload;
                }
            } else if (len === 2) {
                if (current_id > state.battleCharacters[1].id) {
                    state.battleCharacters.push(action.payload);
                } else if (current_id > state.battleCharacters[0].id) {
                    state.battleCharacters.push(state.battleCharacters[1]);
                    state.battleCharacters[1] = action.payload;
                } else {
                    state.battleCharacters.push(state.battleCharacters[1]);
                    state.battleCharacters[1] = state.battleCharacters[0];
                    state.battleCharacters[0] = action.payload;
                }
            } else if (len === 3) {
                if (current_id > state.battleCharacters[2].id) {
                    state.battleCharacters.push(action.payload);
                } else if (current_id > state.battleCharacters[1].id) {
                    state.battleCharacters.push(state.battleCharacters[2]);
                    state.battleCharacters[2] = action.payload;
                } else if (current_id > state.battleCharacters[0].id) {
                    state.battleCharacters.push(state.battleCharacters[2]);
                    state.battleCharacters[2] = state.battleCharacters[1];
                    state.battleCharacters[1] = action.payload;
                } else {
                    state.battleCharacters.push(state.battleCharacters[2]);
                    state.battleCharacters[2] = state.battleCharacters[1];
                    state.battleCharacters[1] = state.battleCharacters[0];
                    state.battleCharacters[0] = action.payload;
                }
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
