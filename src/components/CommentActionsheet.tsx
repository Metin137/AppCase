import {FlatList, Image, StyleSheet, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  useToast,
} from '@gluestack-ui/themed';
import commonStyles from '@utils/commonStyles';
import colors from '@constants/colors';
import {PostInput, EmptyComponent} from './index';
import {useForm} from 'react-hook-form';
import {Send} from 'lucide-react-native';
import FirebaseRepository from 'src/repositories/FirebaseRepository';
import {createUniqKey} from '@utils/customFunctions';
import {CommentType} from 'src/types/postTypes';
import {useDispatch, useSelector} from 'react-redux';
import {StoreType} from 'src/types/storeTypes';
import {firebase} from '@react-native-firebase/auth';
import {getComments, getPosts} from '@redux/slices/PostSlice';
import {AppDispatch} from '@redux/store';
import withLoading, {WithLoadingProps} from '@utils/LoadingHoc';
import {showToast} from '@utils/Toast';
const dayjs = require('dayjs');

interface CommentActionsheetProps {
  isOpen: boolean;
  onClose: (e: boolean) => void;
  postKey: string;
}

interface FormData {
  content: string;
}

const CommentActionsheet = ({
  isOpen,
  onClose,
  postKey,
  isLoading,
  startLoading,
  stopLoading,
}: CommentActionsheetProps & WithLoadingProps) => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: {errors},
  } = useForm<FormData>();

  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const AuthState = useSelector(({AuthState}: StoreType) => AuthState);
  const comments =
    useSelector((state: StoreType) => state.PostState.comments) ?? [];

  const uid = AuthState.uid!;
  const userName = AuthState.userName!;

  useEffect(() => {
    if (isOpen) {
      dispatch(getComments({uid, postKey}));
    }
  }, [dispatch, isOpen]);

  const sendComment = async (data: FormData) => {
    try {
      startLoading();
      const commentKey = createUniqKey();

      const commentData: Partial<CommentType> = {
        content: data.content,
        key: commentKey,
        name: userName?.split('@')[0] ?? userName ?? '',
        uid,
        date: firebase.firestore.Timestamp.now(),
      };

      await FirebaseRepository.sendComments({
        uid,
        postKey,
        commentKey,
        data: commentData,
      });

      await FirebaseRepository.updateCommentCount({
        uid,
        postKey,
        commentCount: comments.length + 1,
      });
      stopLoading();
      dispatch(getComments({uid, postKey}));
      dispatch(getPosts());
      showToast({toast, text: 'Yorum gönderildi'});
      resetField('content');
    } catch (error) {
      stopLoading();
    }
  };

  const renderItem = ({
    item: {name, content, date, key},
  }: {
    item: CommentType;
  }) => (
    <ActionsheetItem key={key} style={styles.item}>
      <View style={commonStyles.row}>
        <View style={styles.profileView}>
          <Image
            source={require('@assets/images/profile.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.itemBody}>
          <ActionsheetItemText style={commonStyles.textLarge}>
            {name}
          </ActionsheetItemText>
          <ActionsheetItemText
            style={{
              ...commonStyles.textMedium,
              color: colors.secondaryText,
            }}>
            {content}
          </ActionsheetItemText>
        </View>
        <ActionsheetItemText
          style={{
            ...commonStyles.textSmall,
            color: colors.secondaryText,
          }}>
          {dayjs(date?.toDate()).fromNow()}
        </ActionsheetItemText>
      </View>
    </ActionsheetItem>
  );

  const listHeaderComponent = () => (
    <PostInput
      name="content"
      control={control}
      rules={{
        required: 'Zorunlu',
      }}
      error={errors.content}
      onPressIcon={() => {
        if (!isLoading) handleSubmit(sendComment)();
      }}
      customIcon={<Send size={20} color={colors.primary} />}
    />
  );

  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={() => onClose(false)}
      zIndex={999}
      snapPoints={[80]}>
      <ActionsheetBackdrop />
      <ActionsheetContent zIndex={999}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View style={[commonStyles.fullContainer, {width: '100%'}]}>
          <FlatList
            keyExtractor={item => item.key}
            style={commonStyles.container}
            data={comments}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListHeaderComponent={listHeaderComponent}
            ListEmptyComponent={<EmptyComponent text="Hiç Yorum Bulunamadı!" />}
          />
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default withLoading(CommentActionsheet) as FC<CommentActionsheetProps>;

const styles = StyleSheet.create({
  profileView: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 20,
    height: 20,
  },
  item: {flexDirection: 'column', alignItems: 'flex-start'},
  itemBody: {flex: 1},
});
