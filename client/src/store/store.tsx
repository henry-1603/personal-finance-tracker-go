// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from './user/userSlice';
import checkoutReducer from './checkout/checkoutSlice';
import cartReducer from './cart/cartSlice';

import { PersistConfig } from 'redux-persist';

// Define the persist config
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  checkout: checkoutReducer,
  cart : cartReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and allow non-serializable values
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create a persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
