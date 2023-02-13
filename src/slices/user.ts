import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Store';

interface IWalletAddress {
    address: null | String;
}
const initialState: IWalletAddress = { address: null };

const currentWalletAddressSlice = createSlice({
    name: 'currentWalletAddress',
    initialState,
    reducers: {
        setCurrentWalletAddress(state, action: PayloadAction<String>) {
            state.address = action.payload;
        },
        removeWalletAddress: (state) => {
            state.address = null;
        },
    },
});

export const selectCurrentWalletAddress = (state: RootState): null | String => state.walletAddress.address;
export const { setCurrentWalletAddress, removeWalletAddress } = currentWalletAddressSlice.actions;
export default currentWalletAddressSlice.reducer;
