import {createSlice} from '@reduxjs/toolkit';
import {PayloadAction} from '@reduxjs/toolkit/react';
import {AuthSliceType} from 'src/types/storeTypes';
import auth from '@react-native-firebase/auth';

const initialState: AuthSliceType = {
  isLoggedIn: auth().currentUser?.uid != null,
  userName: auth().currentUser?.email,
  uid: auth().currentUser?.uid,
};

export const authSlice = createSlice({
  name: 'AuthState',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthSliceType>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.uid = action.payload.uid;
      state.userName = action.payload.userName;
    },
    removeUser: state => {
      state.isLoggedIn = false;
      state.uid = null;
      state.userName = null;
    },
  },
});

export const {setUser, removeUser} = authSlice.actions;

export default authSlice.reducer;
