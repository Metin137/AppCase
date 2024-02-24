import {CommentType, PostType} from 'src/types/postTypes';

export interface AuthSliceType {
  isLoggedIn: boolean;
  userName?: string | null;
  uid?: string | null;
  profileImage?: string | null;
}
export interface PostSliceType {
  isLoading: boolean;
  posts?: PostType[];
  comments?: CommentType[];
  filter?: 'date' | 'likeCount' | 'commentCount' | null;
  error?: string;
}

export interface StoreType {
  AuthState: AuthSliceType;
  PostState: PostSliceType;
}
