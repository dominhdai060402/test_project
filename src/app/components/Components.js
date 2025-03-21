import React from 'react';
import {TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import {COLOR} from '../../env/config';

export function LoadingView() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Đang tải dữ liệu...</Text>
      <ActivityIndicator size="large" color="#EA4335" />
    </View>
  );
}

export function ProgressBar() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 0.3,
        zIndex: 999,
        width: '100%',
        height: '100%',
      }}>
      <ActivityIndicator size="large" color="#EA4335" />
    </View>
  );
}

export function SettingIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Setting', {
      update: false,
    })}>
      <Icon
        name="cog"
        color="#FFF"
        size={25}
        type="light"
        containerStyle={{paddingLeft: 16}}
      />
    </TouchableOpacity>
  );
}
// onPress={() => navigation.navigate('AuthForm')}
export function LogoutIcon() {
  const {signOut} = React.useContext(AuthContext);
  //const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={signOut}>
      <Icon
        name="power-off"
        color={COLOR.HEARDER}
        size={25}
        type="light"
        containerStyle={{paddingRight: 16}}
      />
    </TouchableOpacity>
  );
}

export function RighIcon() {
  //const {signOut} = React.useContext(AuthContext);
  //const navigation = useNavigation();
  return (
    <TouchableOpacity>
      <Icon
        name="power-off"
        color={COLOR.HEARDER}
        size={25}
        type="light"
        containerStyle={{paddingRight: 16}}
      />
    </TouchableOpacity>
  );
}

export const Separator = () => {
  return (
    <View style={{height: 1, width: '100%', backgroundColor: '#CED0CE'}} />
  );
};

export const SeparatorRed = () => {
  return <View style={{height: 1, width: '100%', backgroundColor: 'red'}} />;
};

export const ListEmpty = (message) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{message}</Text>
    </View>
  );
};
