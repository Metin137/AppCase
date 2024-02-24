import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '@constants/colors';
import {ImagePlus} from 'lucide-react-native';
import {
  FieldError,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

interface PostInputProps extends TextInputProps {
  placeHolder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: FieldError;
  control?: any;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  onPressIcon?: () => void;
  iconColor?: string;
  customIcon?: React.JSX.Element;
}

const PostInput = ({
  placeHolder = 'Your Texts...',
  value,
  onChangeText,
  name,
  control,
  error,
  rules,
  onPressIcon,
  iconColor,
  customIcon,
  ...inputProps
}: PostInputProps) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name,
    rules,
  });

  return (
    <View
      style={[
        styles.container,
        {borderColor: error ? colors.red : colors.secondary},
      ]}>
      <TextInput
        editable
        multiline
        numberOfLines={3}
        textAlignVertical={'top'}
        style={styles.textInput}
        placeholder={placeHolder}
        placeholderTextColor={colors.secondaryText}
        value={field.value}
        onChangeText={field.onChange}
        {...inputProps}
      />
      <TouchableOpacity style={styles.iconView} onPress={onPressIcon}>
        {customIcon ?? (
          <ImagePlus size={20} color={iconColor ?? colors.secondaryText} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PostInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  textInput: {
    backgroundColor: colors.white,
    color: colors.primaryText,
    height: 80,
    paddingHorizontal: 5,
  },
  iconView: {position: 'absolute', right: 5, bottom: 5, zIndex: 999},
});
