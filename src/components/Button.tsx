import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '@constants/colors';
import commonStyles from '@utils/commonStyles';

interface ButtonProps {
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Button = ({onPress, text, style, textStyle, disabled}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          ...styles.button,
          backgroundColor: disabled ? colors.disabled : colors.primary,
        },
        style,
      ]}>
      <Text
        style={[{...commonStyles.textMedium, color: colors.white}, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
