import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  StyleProp,
} from 'react-native';
import React from 'react';
import commonStyles from '@utils/commonStyles';

interface TextButtonProps {
  icon: React.JSX.Element;
  text: string;
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

function TextButton({
  icon,
  text,
  onPress,
  textStyle,
  disabled,
}: TextButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[commonStyles.row, styles.button]}>
      {icon}
      <View style={commonStyles.hSeperator} />
      <Text style={[commonStyles.textMedium, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}
export default TextButton;

const styles = StyleSheet.create({
  button: {alignSelf: 'flex-start', padding: 5},
});
