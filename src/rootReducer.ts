import { combineReducers } from 'redux';
import currentWalletAddressReducer from 'slices/user.ts';
import myCharacterReducer from 'slices/myCharacter.ts';
import battleInfoReducer from 'slices/battle.ts';

export default combineReducers({
    walletAddress: currentWalletAddressReducer,
    myCharacter: myCharacterReducer,
    battleInfo: battleInfoReducer
});
