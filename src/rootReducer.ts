import { combineReducers } from 'redux';
import currentWalletAddressReducer from 'slices/User.ts';
import currentMyCharacterReducer from 'slices/myCharacter.ts';
import currentBattleReducer from 'slices/Battle.ts';
import currentRoundResultReducer from 'slices/roundResult.ts';


export default combineReducers({ 
  walletAddress: currentWalletAddressReducer,
  myCharacter: currentMyCharacterReducer,
  currentBattle: currentBattleReducer,
  currentRoundResult: currentRoundResultReducer
});
