import colors from '@constants/colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  //Text Styles
  textXLarge: {
    color: colors.primaryText,
    fontSize: 18,
  },
  textLarge: {
    color: colors.primaryText,
    fontSize: 16,
  },
  textMedium: {
    color: colors.primaryText,
    fontSize: 14,
  },
  textSmall: {
    color: colors.primaryText,
    fontSize: 12,
  },
  //View Styles
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.backgroundColor,
  },
  fullContainer: {flex: 1, backgroundColor: colors.white},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vSeperator: {
    height: 10,
  },
  hSeperator: {
    width: 5,
  },
});
