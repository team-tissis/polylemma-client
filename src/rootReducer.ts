import { combineReducers } from 'redux';
import currentWalletAddressReducer from './slices/user.ts';
import currentMyCharacterReducer from './slices/myCharacter.ts';

export default combineReducers({ 
  walletAddress: currentWalletAddressReducer,
  myCharacter: currentMyCharacterReducer
});
