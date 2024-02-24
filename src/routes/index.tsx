import {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '@redux/slices/AuthSlice';
import {StoreType} from 'src/types/storeTypes';
import {NavigationContainer} from '@react-navigation/native';
import {BottomBar} from '@components/index';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Home1" component={HomeScreen} />
      <Tab.Screen name="Home2" component={HomeScreen} />
      <Tab.Screen name="Home3" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function Router() {
  const AuthState = useSelector((state: StoreType) => state.AuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(e => {
      dispatch(
        setUser({
          uid: e?.uid,
          userName: e?.email,
          isLoggedIn: e != null && e?.uid != null,
        }),
      );
    });
    return subscriber;
  }, [dispatch]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeTabs">
          {AuthState.isLoggedIn ? (
            <Stack.Screen
              name="HomeTabs"
              component={MyTabs}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
