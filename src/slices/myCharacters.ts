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

interface IAddressCharacter {
    walletAddress: string;
    character: IMyCharacter;
}

interface IAddressCharacterList {
    walletAddress: string;
    battleCharacters: IMyCharacter[];
}

interface IMyCharacters {
    currentAddress: string | null
    battleCharacters: IMyCharacter[];
    charactersList: IAddressCharacterList[];
}

const initialState: IMyCharacters = { 
    currentAddress: null ,  // 現在のアドレス
    battleCharacters: [],   // 現在のアドレスに紐づいたキャラクター
    charactersList: []      // 全てのアドレスに紐付いたキャラクターリスト
};

const myCharactersSlice = createSlice({
    name: 'myCharacters',
    initialState,
    reducers: {
        setBattleCharacters(state, action: PayloadAction<IAddressCharacterList>) {
            state.currentAddress = action.payload.walletAddress
            state.battleCharacters = action.payload.battleCharacters;
            state.charactersList.push(action.payload)
        },
        initCharacterList(state, action: PayloadAction<string>){
            const currentAddress : string = action.payload;
            var thisAddressCharacters =  state.charactersList.filter(charactersList => charactersList.walletAddress == currentAddress);
            if (thisAddressCharacters.length > 0) {
                state.battleCharacters = thisAddressCharacters[0].battleCharacters;
            }
            state.currentAddress = currentAddress;
        },
        updateInitCharacter(state, action: PayloadAction<IAddressCharacter>){
            const currentAddress : string = action.payload.walletAddress;
            const newCharacter : IMyCharacter = action.payload.character;
            var updatedCharacters : IMyCharacter[] = state.battleCharacters
            // check the selected character is in the "state.battleCharacters"
            const isExist = updatedCharacters.some(char => char.id == newCharacter.id);
            if (isExist) {
                // remove character
                updatedCharacters = updatedCharacters.filter(char => char.id !== newCharacter.id);
            } else {
                if (state.battleCharacters.length === 4)  return;
                // push character, and sort by character_id
                updatedCharacters.push(newCharacter)
                updatedCharacters = updatedCharacters.sort((charA, charB) => charA.id - charB.id);
            }
            state.battleCharacters = updatedCharacters;

            // update "charactersList"
            if (state.charactersList.length == 0) {
                const characterList : IAddressCharacterList = {
                    walletAddress: currentAddress,
                    battleCharacters: updatedCharacters
                }
                state.charactersList = [ characterList ];
            } else {
                const updatedCharactersList = state.charactersList.map(addressCharacters => {
                    if (addressCharacters.walletAddress === currentAddress) {
                      return {...addressCharacters, battleCharacters: updatedCharacters};
                    }
                    return addressCharacters;
                });
                state.charactersList = updatedCharactersList;
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
            state = initialState;
        },
    },
});

export const selectMyCharacter = (state: RootState): IMyCharacters => state.myCharacters;
export const { initCharacterList, setBattleCharacters, removeBattleCharacters, 
    updateInitCharacter, updateBattleCharacters, initializeBattleCharacters } = myCharactersSlice.actions;
export default myCharactersSlice.reducer;
