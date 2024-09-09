// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  customerRoleId: string | null;
  cartCount: number;
}

const initialState: UserState = {
  customerRoleId: null,
  cartCount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCustomerRoleId: (state, action: PayloadAction<string>) => {
      state.customerRoleId = action.payload;
    },
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
  },
});

export const { setCustomerRoleId, setCartCount } = userSlice.actions;
export default userSlice.reducer;
