import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CouponApplicationResponse } from "../../types/client/ShoppingCartType";

interface CartState {
  couponApply: boolean;
  couponData: Partial<CouponApplicationResponse>;
}

const initialState: CartState = {
  couponApply: false,
  couponData: {
    appliedCouponCode: "",
    total: 0,
    finalSum: 0,
    totalQuantity: 0,
    discountAmount: 0,
    couponStatus: "valid", // Default to 'valid' or 'invalid' as appropriate
    message: "", 
    applicableWithOffers : false,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCouponApply: (state, action: PayloadAction<boolean>) => {
      state.couponApply = action.payload;
    },
    setCouponData: (
      state,
      action: PayloadAction<CouponApplicationResponse>
    ) => {
      state.couponData = {
        ...state.couponData,
        ...action.payload,
      };
    },
  },
});

export const { setCouponApply, setCouponData } = cartSlice.actions;

export default cartSlice.reducer;
