import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  subTotal: number | null;
  totalTax: number | null | any;
  totalAmount: number | null;
  averageDiscount: number | null;
  couponCode: string | null;
}

const initialState: UserState = {
  subTotal: 0,
  totalAmount: 0,
  totalTax: 0,
  averageDiscount: 0,
  couponCode: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSubTotal: (state, action: PayloadAction<number>) => {
      state.subTotal = action.payload;
    },
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
    setTotalTaxStore: (state, action: PayloadAction<number | any| undefined>) => {
      state.totalTax = action.payload ?? 0;
    },
    setAverageDiscount: (state, action: PayloadAction<number | undefined>) => {
      state.averageDiscount = action.payload ?? 0; // Default to 0 if undefined
    },
    setCouponCode: (state, action: PayloadAction<string | undefined>) => {
      state.couponCode = action.payload ?? ""; // Default to empty string if undefined
    },
  },
});

export const { setSubTotal, setTotalAmount, setTotalTaxStore, setAverageDiscount, setCouponCode } = checkoutSlice.actions;
export default checkoutSlice.reducer;
