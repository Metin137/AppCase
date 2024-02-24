import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface PostType {
  key: string;
  uid: string;
  name: string;
  likeCount: number;
  commentCount: number;
  content: string;
  date: FirebaseFirestoreTypes.Timestamp;
  postImage?: string;
}

interface CommentType {
  key: string;
  uid: string;
  name: string;
  content: string;
  date: FirebaseFirestoreTypes.Timestamp;
}

export type {PostType, CommentType};
