import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {TextButton} from '@components/index';
import {Heart, MessageCircleMore, Trash2} from 'lucide-react-native';
import colors from '@constants/colors';
import commonStyles from '@utils/commonStyles';
import withLoading, {WithLoadingProps} from '@utils/LoadingHoc';
import FirebaseRepository from 'src/repositories/FirebaseRepository';
import {useToast} from '@gluestack-ui/themed';
import {getPosts} from '@redux/slices/PostSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@redux/store';
import {StoreType} from 'src/types/storeTypes';
import {showToast} from '@utils/Toast';

interface CardItemProps {
  postKey: string;
  name: string;
  date: string;
  content: string;
  postImage?: string;
  likeCount: number;
  commentCount: number;
  onPressComments?: () => void;
}

function CardItem({
  postKey,
  name,
  date,
  content,
  postImage,
  likeCount,
  commentCount,
  onPressComments,
  isLoading,
  startLoading,
  stopLoading,
}: CardItemProps & WithLoadingProps) {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const AuthState = useSelector((state: StoreType) => state.AuthState);

  const uid = AuthState.uid!;

  const updateLike = async ({
    like,
    postKey,
  }: {
    like: number;
    postKey: string;
  }) => {
    try {
      startLoading();
      await FirebaseRepository.updateLike({uid, postKey, like});
      stopLoading();
      dispatch(getPosts());
    } catch (error) {
      showToast({toast, text: 'Bir Sorun Oluştu!'});
      stopLoading();
    }
  };

  const showDeletePostWarn = async (doc: string) => {
    Alert.alert('Uyarı', 'Post silinecektir. Devam etmek istiyor musunuz?', [
      {
        text: 'İptal',
      },
      {
        text: 'Evet',
        onPress: () => deletePost(doc),
      },
    ]);
  };

  const deletePost = async (postKey: string) => {
    try {
      startLoading();
      const hasImage = postImage != null && postImage != '';
      await FirebaseRepository.deletePost({uid, postKey});
      if (hasImage)
        await FirebaseRepository.deletePostImage({fileRef: postKey});

      showToast({toast, text: 'Kaldırıldı'});
      stopLoading();
      dispatch(getPosts());
    } catch (error) {
      stopLoading();
      showToast({toast, text: 'Bir Sorun Oluştu!'});
    }
  };

  return (
    <View style={styles.container}>
      <View style={commonStyles.row}>
        <View style={styles.profileView}>
          <Image
            source={require('@assets/images/profile.png')}
            style={styles.profileImage}
          />
        </View>
        <View>
          <Text style={commonStyles.textLarge}>{name}</Text>
          <Text
            style={{...commonStyles.textSmall, color: colors.secondaryText}}>
            {date}
          </Text>
        </View>
      </View>

      <View style={styles.contentView}>
        <Text style={{...commonStyles.textMedium, color: colors.secondaryText}}>
          {content}
        </Text>
      </View>

      <View>
        <Image
          source={
            postImage != null && postImage != ''
              ? {
                  uri: postImage,
                }
              : require('@assets/images/placeholder.png')
          }
          style={styles.postImage}
        />
      </View>

      <View style={styles.bottomIconView}>
        <View style={commonStyles.row}>
          <TextButton
            disabled={isLoading}
            icon={<Heart size={15} color={colors.red} />}
            text={likeCount?.toString()}
            onPress={() =>
              updateLike({
                like: Number(likeCount ?? 0) + 1,
                postKey: postKey,
              })
            }
          />
          <View
            style={{
              width: 50,
            }}
          />
          <TextButton
            disabled={isLoading}
            icon={<MessageCircleMore size={15} color={colors.primaryText} />}
            text={commentCount?.toString()}
            onPress={onPressComments}
          />
        </View>
        <TextButton
          disabled={isLoading}
          icon={<Trash2 size={15} color={colors.primaryText} />}
          text="Kaldır"
          onPress={() => showDeletePostWarn(postKey)}
        />
      </View>
    </View>
  );
}

export default withLoading(CardItem) as FC<CardItemProps>;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
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
  contentView: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  postImage: {
    width: '100%',
    height: 130,
  },
  bottomIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
