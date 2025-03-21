import React from 'react';
import { Text, View } from 'react-native';
import { Appstyles } from '../styles/AppStyle';
import { COLOR } from '../../env/config';

export function AppHeader(props) {
  return (
    <View style={Appstyles.header}>
      <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
        {props.appName}
      </Text>
      <Text style={{ color: '#000', fontSize: 11, textAlign: 'center' }}>
        {props.user ? props.user.fullName : ''}
      </Text>
    </View>
  );
}

export function AppHeaderNone(props) {
  return (
    <View style={Appstyles.header}>
      <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
        {props.appName}
      </Text>
    </View>
  );
}

export function AppHeaderMain(props) {
  return (
    <View style={Appstyles.header}>
      <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>
        {props.appName}
      </Text>
    </View>
  );
}