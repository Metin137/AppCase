import {View, Platform} from 'react-native';
import React, {FC, useState} from 'react';
import {PostInput, Button} from '@components/index';
import commonStyles from '@utils/commonStyles';
import {useForm} from 'react-hook-form';
import withLoading, {WithLoadingProps} from '@utils/LoadingHoc';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {createUniqKey, getItemOfArray} from '@utils/customFunctions';
import {useToast} from '@gluestack-ui/themed';
import FirebaseRepository from 'src/repositories/FirebaseRepository';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@redux/store';
import {StoreType} from 'src/types/storeTypes';
import {firebase} from '@react-native-firebase/auth';
import {PostType} from 'src/types/postTypes';
import {getPosts} from '@redux/slices/PostSlice';
import colors from '@constants/colors';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {showToast} from '@utils/Toast';

interface FormData {
  content: string;
}

const PostSection = ({
  isLoading,
  startLoading,
  stopLoading,
}: WithLoadingProps) => {
  const [image, setImage] = useState<string | null>();

  const {
    control,
    handleSubmit,
    resetField,
    formState: {errors, isValid},
  } = useForm<FormData>();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const AuthState = useSelector((state: StoreType) => state.AuthState);

  const uid = AuthState.uid!;
  const userName = AuthState.userName!;

  const selectImage = async () => {
    try {
      const options: ImageLibraryOptions = {
        maxWidth: 2000,
        maxHeight: 2000,
        mediaType: 'photo',
        includeBase64: true,
        includeExtra: true,
      };
      const result = await launchImageLibrary(options);
      const file = getItemOfArray<Asset>({array: result?.assets, index: 0});

      if (file == null) return;
      setImage(file.uri);
      showToast({toast, text: 'Resim eklendi'});
    } catch (error) {
      showToast({toast, text: 'Bir Sorun Oluştu!'});
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      startLoading();
      const {content} = data;
      const key = createUniqKey();
      const url = await uploadImage(key);
      const date =
        firebase.firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp;

      const postData: Partial<PostType> = {
        commentCount: 0,
        content,
        date,
        postImage: url,
        likeCount: 0,
        name: userName?.split('@')[0] ?? userName ?? '',
        uid,
      };

      await FirebaseRepository.createPost({uid, postKey: key, data: postData});

      showToast({toast, text: 'Gönderi paylaşıldı'});
      resetField('content');
      stopLoading();
      dispatch(getPosts());
    } catch (error) {
      showToast({toast, text: 'Bir Sorun Oluştu!'});
      stopLoading();
    }
  };

  const uploadImage = async (ref: string) => {
    try {
      if (image == null) return '';
      const uploadUri =
        Platform.OS === 'ios' ? image.replace('file://', '') : image;
      const url = await FirebaseRepository.uploadPostImage({
        fileRef: ref,
        file: uploadUri,
      });
      setImage(null);
      return url;
    } catch (e) {
      showToast({toast, text: 'Bir Sorun Oluştu!'});
      return '';
    }
  };

  return (
    <>
      <PostInput
        name="content"
        control={control}
        rules={{
          required: 'Zorunlu',
        }}
        error={errors.content}
        onPressIcon={selectImage}
        iconColor={image != null ? colors.green : colors.secondaryText}
      />

      <View style={commonStyles.vSeperator} />

      <Button
        disabled={!isValid || isLoading}
        text="Gönder"
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default withLoading(PostSection) as FC;
