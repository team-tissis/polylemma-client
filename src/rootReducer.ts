import { combineReducers } from 'redux';
import currentWalletAddressReducer from './slices/user.ts';

export default combineReducers({ 
  walletAddress: currentWalletAddressReducer
});
