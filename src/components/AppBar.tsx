import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import colors from '@constants/colors';
import commonStyles from '@utils/commonStyles';
import {wp} from '@utils/screenSize';
import {LogOut} from 'lucide-react-native';

interface AppBarProps {
  title?: string;
  onLogOut?: () => void;
}

const AppBar = ({title = 'AppCase', onLogOut}: AppBarProps) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={{width: 25}} />
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{...commonStyles.textXLarge, color: colors.white}}>
          {title}
        </Text>
      </View>
      <TouchableOpacity onPress={onLogOut}>
        <LogOut size={25} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
