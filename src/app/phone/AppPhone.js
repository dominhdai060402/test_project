import {useNetInfo} from '@react-native-community/netinfo';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform, Linking} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {COLOR, API} from '../../env/config';
import Axios from 'axios';
import {AppHeaderNone} from './AppHeader';
import StackInforFactory from './Information/InforFactory';
import StackSetting from './Setting/SettingApp';
import StackTTDien from './TTDien/StackTTDien';
import codePush from 'react-native-code-push';

const Tab = createBottomTabNavigator();

export default function AppPhone({navigation}) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const netInfo = useNetInfo();

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const checkNetWork = async () => {};
    checkNetWork();
  }, [netInfo]);

  const _handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      codePush.sync({
        updateDialog: true,
        installMode: codePush.InstallMode.IMMEDIATE,
      });
      let update = false;
      await Axios.get(API.CHECK_VERSION)
        .then(res => {
          const verData = res.data;
          if (API.VERSION.localeCompare(verData.versionApp) === -1) {
            update = true;
          }
        })
        .catch(error => console.log(error));
      if (update) {
        if (Platform.OS === 'ios') {
          Linking.openURL(API.UPDATE).catch(err =>
            console.error('An error occurred', err),
          );
        } else {
          navigation.navigate('StackSetting', {update: true});
        }
      }
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return (
    <Tab.Navigator
      initialRouteName={'StackTTDien'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLOR.HEARDER,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#D3D3D3',
        },
      }}>

      <Tab.Screen
        name="StackTTDien"
        component={StackTTDien}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" type={'solid'} color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="StackInforFactory"
        component={StackInforFactory}
        options={{
          tabBarLabel: 'Bản đồ',
          tabBarIcon: ({color, size}) => (
            <Icon name="info-circle" type={'solid'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="StackSetting"
        component={StackSetting}
        options={{
          headerTitle: () => <AppHeaderNone appName={'Cài đặt hệ thống'} />,
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({color, size}) => (
            <Icon name="user-cog" type={'solid'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
