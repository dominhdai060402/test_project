import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState, useRef} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
  AppState,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {configureFontAwesomePro} from 'react-native-fontawesome-pro';
import * as Keychain from 'react-native-keychain';
import Orientation from 'react-native-orientation-locker';
import {AuthContext} from './src/app/AuthContext';
import AuthForm from './src/app/authen/AuthForm';
import AuthStore from './src/app/authen/AuthStore';
import AuthSupport from './src/app/authen/AuthSupport';
import {ProgressBar} from './src/app/components/Components';
import AppPhone from './src/app/phone/AppPhone';
import AppAuthen from './src/app/services/authen/AppAuthen';
import {SplashScreen} from './src/app/SplashScreen';
import AppTablet from './src/app/tablet/AppTablet';
import {Icttheme} from './src/util/nativebaseTheme';

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'transparent',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const AppStack = createStackNavigator();

const App = () => {
  const [support, setSupport] = useState(false);
  const [loading, setloading] = useState(false);
  // const [isPortrait, setIsPortrait] = useState(
  //   Orientation.getInitialOrientation().startsWith('PORTRAIT') ? true : false,
  // );

  configureFontAwesomePro('light');
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    if (DeviceInfo.isTablet()) {
      Orientation.lockToLandscape();
    } else {
      //Orientation.lockToPortrait();
      //npm start -- --reset-cache
    }
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        const aToc = await AsyncStorage.getItem('@auth-autoID');
        if (aToc) {
          const auth = JSON.parse(aToc);
          auth.logout = false;
          AsyncStorage.setItem('@auth-autoID', JSON.stringify(auth));
        }
      } catch (e) {
        // Restoring token failed
      }


      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const onReceived = notification => {};

  const onOpened = openResult => {
  }

  const onIds = device => {
    console.log('Device info: ', device);
  };

  const authContext = React.useMemo(
    () => ({
      isSupport: async isSupport => {
        setSupport(isSupport);
      },
      signIn: async data => {
        setloading(true);
        await AppAuthen.login(data.loginname, data.password)
          .then(async rs => {
            const rsdata = rs.data;
            //console.log(rsdata);
            if (rsdata) {
              await AsyncStorage.setItem('@auth-user', JSON.stringify(rsdata));
              const ndata = {USERNAME: data.loginname, token: rsdata.token};
              Keychain.setGenericPassword(data.loginname, data.password);
              if (ndata.token) {
                AsyncStorage.setItem(
                  '@auth-Token',
                  JSON.stringify(rsdata.token),
                );
              }
              const userData = AuthStore.createAppInfor(rsdata);
              const aToc = await AsyncStorage.getItem('@auth-autoID');
              if (aToc) {
                const auth = JSON.parse(aToc);
                auth.username = ndata.USERNAME;
                AsyncStorage.setItem('@auth-autoID', JSON.stringify(auth));
              } else {
                const auth = {
                  username: ndata.USERNAME,
                  touchID: false,
                  logout: false,
                };
                AsyncStorage.setItem('@auth-autoID', JSON.stringify(auth));
              }

              dispatch({type: 'SIGN_IN', token: ndata.token});
            } else {
              Alert.alert('' + rs.data.Message);
            }
          })
          .catch(err => {
            Alert.alert('' + err);
          });
        setloading(false);
      },
      signOut: async () => {
        AsyncStorage.removeItem('@auth-Token');
        AsyncStorage.removeItem('@auth-user');
        const aToc = await AsyncStorage.getItem('@auth-autoID');
        if (aToc) {
          const auth = JSON.parse(aToc);
          auth.logout = true;
          AsyncStorage.setItem('@auth-autoID', JSON.stringify(auth));
        }
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  const renderApp = () => {
    return (
      <NavigationContainer theme={MyTheme}>
        <ImageBackground
          style={styles.imageStyle}
          resizeMode="cover"
          source={{
            uri: 'https://appmobile.evngenco1.vn/images/bg_app_3.png',
          }}>
          <AppStack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}>
            {state.isLoading ? (
              <AppStack.Screen
                name="Splash"
                component={SplashScreen}
                options={{headerShown: false}}
              />
            ) : state.userToken == null ? (
              support ? (
                <AppStack.Screen
                  name="AuthSupport"
                  component={AuthSupport}
                  options={{
                    headerShown: false,
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                  }}
                />
              ) : (
                <AppStack.Screen
                  name="AuthSupport"
                  component={AuthSupport}
                  options={{
                    headerShown: false,
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                  }}
                />
              )
            ) : DeviceInfo.isTablet() ? (
              <AppStack.Screen
                name="AppTablet"
                component={AppTablet}
                options={{headerShown: false}}
              />
            ) : (
              <AppStack.Screen
                name="AppPhone"
                component={AppPhone}
                options={{headerShown: false}}
              />
            )}
          </AppStack.Navigator>
        </ImageBackground>
      </NavigationContainer>
    );
  };

  return (
    <>
      {/* <Provider store={store}> */}
      <NativeBaseProvider theme={Icttheme}>
        <AuthContext.Provider value={authContext}>
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView
              style={{flex: 1}}
              enabled
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <View style={styles.container}>
                <StatusBar
                  barStyle={'dark-content'}
                  backgroundColor="transparent"
                  translucent={true}
                />
                {loading && <ProgressBar />}
                {renderApp()}
                <FlashMessage position="top" />
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.container}>
              <StatusBar
                barStyle={'dark-content'}
                backgroundColor="transparent"
                translucent={true}
              />
              {loading && <ProgressBar />}
              {renderApp()}
              <FlashMessage position="top" />
            </View>
          )}
        </AuthContext.Provider>
      </NativeBaseProvider>
      {/* </Provider> */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    flex: 0,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageStyle: {
    flex: 1,
    resizeMode: 'cover',
  },
});

