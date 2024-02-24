import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import React from 'react';
import commonStyles from '@utils/commonStyles';
import colors from '@constants/colors';
import {
  FieldError,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

interface InputSectionProps extends TextInputProps {
  label?: string;
  icon?: React.JSX.Element;
  error?: FieldError;
  control?: any;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

const InputSection = ({
  name,
  control,
  icon,
  placeholder,
  value,
  onChangeText,
  label,
  error,
  rules,
  ...inputProps
}: InputSectionProps) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name,
    rules,
  });

  return (
    <View>
      {label != null && (
        <>
          <Text style={commonStyles.textMedium}>{label}</Text>
          <View style={styles.vSeperator} />
        </>
      )}
      <View style={styles.textInputSection}>
        <View style={styles.textInputView}>
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            placeholder={placeholder}
            value={field.value}
            onChangeText={field.onChange}
            {...inputProps}
          />
        </View>
        {icon}
      </View>
      <Text style={styles.textError}>{error != null && error.message}</Text>
    </View>
  );
};

export default InputSection;

const styles = StyleSheet.create({
  textInputSection: {
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondaryText,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  textInputView: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    color: colors.primaryText,
    height: 50,
  },
  vSeperator: {
    height: 5,
  },
  textError: {
    ...commonStyles.textMedium,
    color: colors.red,
  },
});
