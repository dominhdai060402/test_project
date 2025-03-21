// import { useNetInfo } from '@react-native-community/netinfo';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import React, { useEffect, useRef, useState } from 'react';
// import { AppState, Dimensions, StyleSheet, View } from 'react-native';
// import { COLOR } from '../../env/config';
// import { AppConfig, AppMenu } from '../AppMenu';
// import { DrawerContent } from './DrawerContent';

// function HomeScreen({navigation}) {
//   const source = {
//     uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
//     cache: true,
//   };
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <View style={styles.container}>
        
//       </View>
//     </View>
//   );
// }

// const Drawer = createDrawerNavigator();
// //
// export default function AppTablet() {
//   const appState = useRef(AppState.currentState);
//   const [appStateVisible, setAppStateVisible] = useState(appState.current);
//   const [drawerWidth, setDrawerWidth] = useState(AppConfig.drawerMin);
//   const netInfo = useNetInfo();

//   useEffect(() => {
//     AppState.addEventListener('change', _handleAppStateChange);
//     return () => {
//       AppState.removeEventListener('change', _handleAppStateChange);
//     };
//   }, []);

//   useEffect(() => {
//     const checkNetWork = async () => {};
//     checkNetWork();
//   }, [netInfo]);

//   const _handleAppStateChange = async nextAppState => {
//     if (
//       appState.current.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//     }
//     appState.current = nextAppState;
//     setAppStateVisible(appState.current);
//   };

//   const openSizeDrawer = drawerWidth => {
//     setDrawerWidth(drawerWidth);
//   };

//   return (
//     <View style={{flex: 1}}>
//       {Platform.OS === 'ios' ? (
//         <View style={{height: 20, backgroundColor: COLOR.HEARDER}} />
//       ) : null}

//       <Drawer.Navigator
//         drawerContent={props => (
//           <DrawerContent
//             openSizeDrawer={openSizeDrawer.bind(this)}
   
//             {...props}
//           />
//         )}
//         initialRouteName={HomeScreen}
//         drawerType="permanent"
//         drawerStyle={{width: drawerWidth}}>
//         <Drawer.Screen name="HomeScreen" component={HomeScreen} />
//       </Drawer.Navigator>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginTop: 25,
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// });
