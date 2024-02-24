import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {CommentType, PostType} from 'src/types/postTypes';

const posts = 'posts';
const users = 'users';

const firebasePaths = {
  // All firebase collection and doc paths
  getComments: <T>(uid: T, postKey: T): string =>
    `users/${uid}/posts/${postKey}/comments`,
  postDoc: <T>(uid: T, postKey: T): string => `users/${uid}/posts/${postKey}`,
  sendComment: <T>(uid: T, postKey: T, commentKey: T): string =>
    `users/${uid}/posts/${postKey}/comments/${commentKey}`,
};

interface PostDocType {
  uid: string;
  postKey: string;
}

interface CreatePostType extends PostDocType {
  data: Partial<PostType>;
}

interface SendCommentsType extends PostDocType {
  commentKey: string;
  data: Partial<CommentType>;
}

interface UpdateLikeType extends PostDocType {
  like: number;
}

interface UpdateCommentCount extends PostDocType {
  commentCount: number;
}

interface DeletePostImageType {
  fileRef: string;
}

interface UploadPostImageType {
  fileRef: string;
  file: string;
}

interface LoginType {
  userName: string;
  password: string;
}
interface CreateUserType {
  uid: string;
  data: LoginType;
}

const getPosts = async () => {
  const data: any = [];
  await firestore()
    .collectionGroup(posts)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        data.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
    });
  return data as PostType[];
};

const getComments = async ({uid, postKey}: PostDocType) => {
  const data: any = [];
  await firestore()
    .collection(firebasePaths.getComments<string>(uid, postKey))
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        data.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
    });

  return data as CommentType[];
};

const createPost = async ({uid, postKey, data}: CreatePostType) => {
  return await firebase
    .firestore()
    .doc(firebasePaths.postDoc<string>(uid, postKey))
    .set(data);
};

const sendComments = async ({
  uid,
  postKey,
  commentKey,
  data,
}: SendCommentsType) => {
  return await firebase
    .firestore()
    .doc(firebasePaths.sendComment<string>(uid, postKey, commentKey))
    .set(data);
};

const updateLike = async ({uid, postKey, like}: UpdateLikeType) => {
  return await firebase
    .firestore()
    .doc(firebasePaths.postDoc<string>(uid, postKey))
    .update({
      likeCount: like,
    });
};

const updateCommentCount = async ({
  uid,
  postKey,
  commentCount,
}: UpdateCommentCount) => {
  return await firebase
    .firestore()
    .doc(firebasePaths.postDoc<string>(uid, postKey))
    .update({
      commentCount,
    });
};

const deletePost = async ({uid, postKey}: PostDocType) => {
  return await firebase
    .firestore()
    .doc(firebasePaths.postDoc<string>(uid, postKey))
    .delete();
};

const deletePostImage = async ({fileRef}: DeletePostImageType) => {
  let imageRef = storage().ref(fileRef);
  return await imageRef.delete();
};

const uploadPostImage = async ({fileRef, file}: UploadPostImageType) => {
  const imageRef = storage().ref(fileRef);
  await imageRef.putFile(file);

  const url = await imageRef.getDownloadURL().catch(error => {
    throw error;
  });
  return url;
};

const logOut = async () => {
  await auth().signOut();
};

const login = async ({userName, password}: LoginType) => {
  return await auth().signInWithEmailAndPassword(userName, password);
};

const createUser = async ({uid, data}: CreateUserType) => {
  return await firebase.firestore().collection(users).doc(uid).set(data);
};

export type {PostDocType, LoginType};

export default {
  createPost,
  updateLike,
  updateCommentCount,
  deletePost,
  deletePostImage,
  uploadPostImage,
  getPosts,
  sendComments,
  getComments,
  createUser,
  login,
  logOut,
};
