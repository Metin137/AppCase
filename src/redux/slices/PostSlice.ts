import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {PayloadAction} from '@reduxjs/toolkit/react';
import FirebaseRepository, {
  PostDocType,
} from 'src/repositories/FirebaseRepository';
import {CommentType, PostType} from 'src/types/postTypes';
import {PostSliceType} from 'src/types/storeTypes';

export const getPosts = createAsyncThunk('PostState/getPosts', async () => {
  const response = await FirebaseRepository.getPosts();
  return response;
});

export const getComments = createAsyncThunk(
  'PostState/getComments',
  async ({uid, postKey}: PostDocType) => {
    const response = await FirebaseRepository.getComments({uid, postKey});
    return response;
  },
);

const initialState: PostSliceType = {
  isLoading: false,
  posts: [],
  comments: [],
  error: '',
  filter: null,
};

export const postSlice = createSlice({
  name: 'PostState',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
    },
    setPostFilter: (state, action: PayloadAction<PostSliceType['filter']>) => {
      state.filter = action.payload;
    },
    removePostState: state => {
      state.isLoading = initialState.isLoading;
      state.posts = initialState.posts;
      state.error = initialState.error;
    },
  },
  extraReducers: builder => {
    //Async Func
    //Posts
    builder.addCase(getPosts.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      getPosts.fulfilled,
      (state, action: PayloadAction<PostType[]>) => {
        const data = action.payload;
        const filter = state.filter;

        const filterData = data.sort((a, b) => {
          if (filter == 'date') {
            return b.date.toMillis() - a.date.toMillis();
          } else if (filter == 'likeCount') {
            return Number(b.likeCount) - Number(a.likeCount);
          } else if (filter == 'commentCount') {
            return Number(b.commentCount) - Number(a.commentCount);
          }
          return 0;
        });

        state.posts = filterData;
        state.isLoading = false;
      },
    );
    builder.addCase(getPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //Comments
    builder.addCase(getComments.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      getComments.fulfilled,
      (state, action: PayloadAction<CommentType[]>) => {
        const data = action.payload;

        const filterData = data.sort((a, b) => {
          return b.date.toMillis() - a.date.toMillis();
        });

        state.comments = filterData;
        state.isLoading = false;
      },
    );
    builder.addCase(getComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const {setLoading, setPostFilter, setPosts, removePostState} =
  postSlice.actions;

export default postSlice.reducer;
