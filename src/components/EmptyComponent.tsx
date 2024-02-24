import {View, Text} from 'react-native';
import React from 'react';
import commonStyles from '@utils/commonStyles';

const EmptyComponent = ({text}: {text: string}) => {
  return (
    <View style={[commonStyles.center, {marginTop: 40}]}>
      <Text style={commonStyles.textLarge}>{text}</Text>
    </View>
  );
};

export default EmptyComponent;
