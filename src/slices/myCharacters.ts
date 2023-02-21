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

interface IMyCharactersPerWallet {
    walletAdress: string;
    battleCharacters: IMyCharacter[];
}

interface IMyCharacters {
    currentWalletAdress: string;
    characters: IMyCharactersPerWallet[];
}

const initialState: IMyCharacters = { currentWalletAdress: "", characters: [] };
const myCharactersSlice = createSlice({
    name: 'myCharacters',
    initialState,
    reducers: {
        setBattleCharacters(state, action: PayloadAction<IMyCharactersPerWallet[]>) {
            state.characters = action.payload;
        },
        addBattleCharacters(state, action: PayloadAction<IMyCharactersPerWallet>) {
            if (state.characters.length < 4) {
                state.characters.push(action.payload);
            }
        },
        removeBattleCharacters(state, action: PayloadAction<IMyCharactersPerWallet>) {
            // 特定のウォレットアドレスのキャラクターを初期化
            // state.characters = state.characters.filter(character => character.id !== action.payload.id);
        },
        updateBattleCharacters(state, action: PayloadAction<IMyCharactersPerWallet>) {
            // 特定のウォレットアドレスのキャラクターを更新する
            // const ownedCharacters = action.payload;
            // const isUpdated = [];
            // for (let battleIdx = 0; battleIdx < state.characters.length; battleIdx++) {
            //     isUpdated.push(false);
            // }
            // for (let ownedIdx = 0; ownedIdx < ownedCharacters.length; ownedIdx++) {
            //     const battleIdx = state.characters.findIndex(character => character.id === ownedCharacters[ownedIdx].id);
            //     if (battleIdx >= 0) {
            //         isUpdated[battleIdx] = true;
            //         state.characters[battleIdx] = ownedCharacters[ownedIdx];
            //     }
            // }
            // state.characters = state.characters.filter((character, index) => isUpdated[index]);
        },
        initializeBattleCharacters(state)  {
            state = initialState;
        },
    },
});

export const selectMyCharacter = (state: RootState): IMyCharacters {
    
    state.currentWalletAdress: "", state.characters: []
};

// export const selectMyCharacter = (state: RootState): IMyCharacters => state.myCharacters;
export const { setBattleCharacters, addBattleCharacters, removeBattleCharacters, updateBattleCharacters, initializeBattleCharacters } = myCharactersSlice.actions;
export default myCharactersSlice.reducer;
