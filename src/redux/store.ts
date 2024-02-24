import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from '@redux/slices/AuthSlice';
import {StoreType} from 'src/types/storeTypes';
import PostReducer from '@redux/slices/PostSlice';

export const store = configureStore<StoreType>({
  reducer: {
    AuthState: AuthReducer,
    PostState: PostReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        //You have to add this config for firebase timestap date format othervise you will get error on log.
        ignoredActions: [
          'PostState/getPosts/fulfilled',
          'PostState/getComments/fulfilled',
        ],
        ignoredActionPaths: ['payload.date'],
        ignoredPaths: ['PostState.posts', 'PostState.comments'],
      },
    }),
});
export type AppDispatch = typeof store.dispatch;
