import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-fontawesome-pro';
import {COLOR} from '../../../env/config';
import {RighIcon, SettingIcon} from '../../components/Components';
import {SettingScreen} from '../../SettingScreen';
import {Appstyles} from '../../styles/AppStyle';
import MenuStyle from '../../styles/MenuStyle';
import {AppHeader} from '../AppHeader';

const Stack = createStackNavigator();

function StackSetting() {
  const [user, setUser] = useState();

  useEffect(() => {
    const onInit = async () => {
      const aToc = await AsyncStorage.getItem('@auth-user');
      if (aToc) {
        const auth = JSON.parse(aToc);
        setUser(auth);
      }
    };
    onInit();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="SettingScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          borderTopWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={({navigation, route}) => ({
          headerTitle: 'Cài đặt',
          //headerRight: () => <RighIcon />,
          headerLeft: navigation => <SettingIcon navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtGroup: {
    color: COLOR.HEARDER,
    paddingTop: 8,
    paddingBottom: 8,
  },
  txtDonvi: {
    color: COLOR.HEARDER,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'right',
  },
});

export default StackSetting;
