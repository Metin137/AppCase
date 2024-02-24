import React from 'react';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {Provider} from 'react-redux';
import {store} from '@redux/store';
import Router from 'src/routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

//locale config
import * as dayjs from 'dayjs';
import 'dayjs/locale/tr';
dayjs.locale('tr');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <GluestackUIProvider config={config}>
          <Router />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
