import * as React from 'react';
import { Text, View } from 'react-native';


export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

export function EVNScreen() {
  return (
    <View style={styles.container}>
      <Text>EVN</Text>
      <Text>Module đang được nghiên cứu!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});