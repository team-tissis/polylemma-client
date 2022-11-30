import { combineReducers } from 'redux';
import currentWalletAddressReducer from 'slices/user.ts';
import currentMyCharacterReducer from 'slices/myCharacter.ts';
import battleInfoReducer from 'slices/battle.ts';

export default combineReducers({
    walletAddress: currentWalletAddressReducer,
    myCharacter: currentMyCharacterReducer,
    battleInfo: battleInfoReducer
});
