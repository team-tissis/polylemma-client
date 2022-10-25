import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface IWalletAddress {
  address: null | String;
}
const initialState: IWalletAddress = { address: null};

const currentWalletAddressSlice = createSlice({
  name: 'currentWalletAddress',
  initialState,
  reducers: {
    setCurrentWalletAddress: (state, action: PayloadAction<IWalletAddress>) => {
      state.address = action.payload;
    },
    setCurrentBalance: (state, action: PayloadAction<IWalletBalance>) => {
      state.address = action.payload;
    },
    walletAddressRemove: (state) => {
      state.address = null;
    },
  },
});

export const selectCurrentWalletAddress = (state: RootState): null | String => state.walletAddress.address;
export const { setCurrentWalletAddress, walletAddressRemove } = currentWalletAddressSlice.actions;
export default currentWalletAddressSlice.reducer;
