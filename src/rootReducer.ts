import { combineReducers } from 'redux';
import currentWalletAddressReducer from 'slices/User';
import currentMyCharacterReducer from 'slices/myCharacter';
import currentBattleReducer from 'slices/Battle';
import currentRoundResultReducer from 'slices/roundResult';


export default combineReducers({ 
  walletAddress: currentWalletAddressReducer,
  myCharacter: currentMyCharacterReducer,
  currentBattle: currentBattleReducer,
  currentRoundResult: currentRoundResultReducer
});
