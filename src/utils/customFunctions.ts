import colors from '@constants/colors';
import {Toast, useToast} from '@gluestack-ui/themed';
import React from 'react';
import {Text} from 'react-native';
import commonStyles from './commonStyles';

const createUniqKey = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getItemOfArray = <T>({
  array,
  index,
}: {
  array?: T[] | null;
  index: number;
}): T | null => {
  return array != null && array?.length != 0 ? array[index] : null;
};

export {getItemOfArray, createUniqKey};
