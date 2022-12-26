import { combineReducers } from 'redux';
import currentWalletAddressReducer from 'slices/user.ts';
import myCharactersReducer from 'slices/myCharacters.ts';
import battleInfoReducer from 'slices/battle.ts';

export default combineReducers({
    walletAddress: currentWalletAddressReducer,
    myCharacters: myCharactersReducer,
    battleInfo: battleInfoReducer
});
