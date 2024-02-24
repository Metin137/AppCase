import React, {useEffect, useMemo, useState} from 'react';
import {View, FlatList} from 'react-native';
import colors from '@constants/colors';
import commonStyles from '@utils/commonStyles';
import {Filter} from 'lucide-react-native';
import {
  AppBar,
  CustomActionsheet,
  TextButton,
  CommentActionsheet,
  EmptyComponent,
} from '@components/index';
import {useDispatch, useSelector} from 'react-redux';
const dayjs = require('dayjs');
import {PostSliceType, StoreType} from 'src/types/storeTypes';
import {getPosts, setPostFilter} from '@redux/slices/PostSlice';
import {AppDispatch} from '@redux/store';
import FirebaseRepository from 'src/repositories/FirebaseRepository';
import {RefreshControl} from 'react-native-gesture-handler';
import {PostSection, CardItem} from './components';
import {PostType} from 'src/types/postTypes';

const HomeScreen = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [commentActionsheetV, setCommentActionsheetV] = useState(false);
  const [selectedPostKey, setSelectedPostKey] = useState<string | null>();

  const posts = useSelector((state: StoreType) => state.PostState.posts);
  const isLoading = useSelector(
    (state: StoreType) => state.PostState.isLoading,
  );
  const selectedFilter = useSelector(
    (state: StoreType) => state.PostState.filter,
  );

  const dispatch = useDispatch<AppDispatch>();

  const filters = useMemo(
    () => [
      {text: 'Tarihe Göre', value: 'date'},
      {text: 'En Çok Beğenilenler', value: 'likeCount'},
      {text: 'En Çok Yorumlananlar', value: 'commentCount'},
    ],
    [],
  );

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch, selectedFilter]);

  const onLogOut = async () => {
    await FirebaseRepository.logOut();
  };

  const customActionsheetOnSelect = (e: string) => {
    dispatch(setPostFilter(e as PostSliceType['filter']));
    setShowFilter(false);
  };

  const onPressComments = (key: string) => {
    setSelectedPostKey(key);
    setCommentActionsheetV(true);
  };

  const renderItem = ({
    item: {key, name, date, content, likeCount, commentCount, postImage},
  }: {
    item: PostType;
  }) => (
    <CardItem
      postKey={key}
      name={name}
      date={dayjs(date.toDate()).fromNow()}
      content={content}
      likeCount={likeCount}
      commentCount={commentCount}
      postImage={postImage}
      onPressComments={() => onPressComments(key)}
    />
  );

  const listHeaderComponent = () => (
    <>
      <PostSection />
      <View style={commonStyles.vSeperator} />
      <TextButton
        textStyle={{color: colors.secondaryText}}
        icon={<Filter size={15} color={colors.secondaryText} />}
        text={'Filtrele'}
        onPress={() => setShowFilter(true)}
      />
    </>
  );

  return (
    <View style={commonStyles.fullContainer}>
      <CustomActionsheet
        isOpen={showFilter}
        onClose={setShowFilter}
        items={filters}
        selected={selectedFilter as string}
        onSelected={customActionsheetOnSelect}
      />
      <CommentActionsheet
        isOpen={commentActionsheetV}
        onClose={setCommentActionsheetV}
        postKey={selectedPostKey!}
      />

      <AppBar onLogOut={onLogOut} />

      <View style={commonStyles.fullContainer}>
        <FlatList
          keyExtractor={item => item.key}
          style={commonStyles.fullContainer}
          contentContainerStyle={{padding: 10}}
          refreshControl={
            <RefreshControl
              progressViewOffset={10}
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={isLoading}
              onRefresh={async () => dispatch(getPosts())}
            />
          }
          data={posts}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          ListHeaderComponent={listHeaderComponent}
          ListEmptyComponent={() => (
            <EmptyComponent text="Hiç Post Bulunamadı!" />
          )}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
