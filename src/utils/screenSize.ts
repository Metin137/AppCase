import {Dimensions} from 'react-native';

export const screenSize = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const wp = (percent: number) => screenSize['width'] * (percent / 100);
export const hp = (percent: number) => screenSize['height'] * (percent / 100);
