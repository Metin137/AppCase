import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import commonStyles from '@utils/commonStyles';
import {hp, wp} from '@utils/screenSize';
import colors from '@constants/colors';
import {Lock, User} from 'lucide-react-native';
import {InputSection, Button} from '@components/index';
import {useForm} from 'react-hook-form';
import {KeyboardAvoidingView, useToast} from '@gluestack-ui/themed';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import withLoading, {WithLoadingProps} from '@utils/LoadingHoc';
import FirebaseRepository from 'src/repositories/FirebaseRepository';
import {showToast} from '@utils/Toast';

interface FormData {
  userName: string;
  password: string;
}

const errorStates: {[key: string]: string} = {
  'auth/invalid-credential': 'Kullanıcı Bilgileri Yanlış!',
  'auth/invalid-email': 'Email formatı yanlış',
};

const formSchema = yup
  .object()
  .shape({
    userName: yup
      .string()
      .email('Lütfen Email formatında yazınız!')
      .required('Zorunlu Alan!'),
    password: yup.string().min(6, 'Min 6 karakter!').required('Zorunlu Alan!'),
  })
  .required();

const LoginScreen = ({
  isLoading,
  startLoading,
  stopLoading,
}: WithLoadingProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {userName: '', password: ''},
    resolver: yupResolver(formSchema),
  });
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const {userName, password} = data;
      startLoading();
      const response = await FirebaseRepository.login({userName, password});
      const uid = response.user.uid;
      await FirebaseRepository.createUser({uid, data});
      stopLoading();
    } catch (error: any) {
      stopLoading();
      showToast({toast, text: errorStates[error.code] ?? ''});
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={commonStyles.fullContainer}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={commonStyles.container}>
          <View style={styles.logoView}>
            <Image
              source={require('@assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <InputSection
            name="userName"
            control={control}
            error={errors.userName}
            label="Kullanıcı Adı"
            icon={<User size={20} color={colors.secondaryText} />}
          />
          <View style={styles.vSeperator} />
          <InputSection
            name="password"
            control={control}
            error={errors.password}
            label="Şifre"
            icon={<Lock size={20} color={colors.secondaryText} />}
          />
          <View style={{height: 40}} />

          <Button
            disabled={isLoading} // we can use isValid condition but if we do this we can't see the error messages
            text="Giriş"
            style={{height: 60}}
            textStyle={{fontSize: 18}}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withLoading(LoginScreen) as FC;

const styles = StyleSheet.create({
  scrollView: {paddingBottom: 30},
  logoView: {
    paddingVertical: wp(10), //we use wp for better responsibilty,
  },
  logo: {
    width: '100%',
    height: hp(25),
  },
  vSeperator: {
    height: 5,
  },
});
