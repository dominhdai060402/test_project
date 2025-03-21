// import { DrawerContentScrollView } from '@react-navigation/drawer';
// import React, { useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-fontawesome-pro';
// import { COLOR } from '../../env/config';
// import { AppMenu } from '../AppMenu';
// import { AuthContext } from '../AuthContext';

// export function DrawerContent(props) {
//   const [fullWidth, setFullWidth] = useState(false);

//   const {signOut} = React.useContext(AuthContext);

//   const gotoNavigate = screen => {
//     setSelected(screen);
//     if (screen == 'Setting') {
//       props.navigation.navigate(screen, {
//         update: false,
//       });
//     } else {
//       props.navigation.reset({
//         index: 0,
//         routes: [{name: screen}],
//       });
//     }
//   };

//   const drawerFull = () => {
//     if (!fullWidth) {
//       setFullWidth(true);
//       props.openSizeDrawer(AppMenu.drawerMax);
//     } else {
//       setFullWidth(false);
//       props.openSizeDrawer(AppMenu.drawerMin);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <DrawerContentScrollView {...props}>
//         <View style={styles.drawerContent}>
//           <View style={styles.userInfoSection}>
//             <View style={{flexDirection: 'row'}}>
//               <TouchableOpacity onPress={() => drawerFull()}>
//                 <Icon name="bars" size={30} color="#1E4293" type="light" />
//               </TouchableOpacity>
//               {fullWidth ? (
//                 <View style={styles.caption}>
//                   <Text style={styles.title}>{props.fullName}</Text>
//                   <Text style={{fontSize: 11}}>{phong.TEN_PB}</Text>
//                 </View>
//               ) : null}
//             </View>
//           </View>

//           {/* Hệ thống quản lý nhân sự */}
//           {/* <Drawer.Section style={styles.drawerSection} title='Nhân sự'>
//            {RunApp.AppEmployee.menu.map((item)=> (
//               <DrawerItem key={item.screen}
//                 style={selected === item.screen? styles.activeItem: styles.noneItem}
//                 icon={({color, size}) => (
//                   <View>
//                     <Icon name={item.icon} color={selected === item.screen ? '#126dd8' :'#1E4293'}  type={'light'} size={25}/>
//                     <Badge status='error' containerStyle={{position: 'absolute', top: -5, right: -15}} value='99' />
//                   </View>
//                 )}
//                 labelStyle={selected === item.screen ? styles.activeLabel: ''} label={item.name}
//                 onPress={() => gotoNavigate(item.screen)}/>
//               )
//             )} 
//           </Drawer.Section>*/}
//           {/* Hệ thống quản tiện ích văn phòng */}
//           {/* <Drawer.Section style={styles.drawerSection} title='Văn phòng'>
//             {appUser.utilityMenu.map((item)=> (
//               <DrawerItem key={item.tabscreen}
//                 style={selected === item.screen? styles.activeItem: styles.noneItem}
//                 icon={({color, size}) => (
//                   <View>
//                     <Icon name={item.icon} color={selected === item.tabscreen ? '#126dd8' :'#1E4293'}  type={'light'} size={25}/>
//                     {item.counter && <Badge status='error' containerStyle={{position: 'absolute', top: -5, right: -15}} value='99' />}
//                   </View>
//                 )}
//                 labelStyle={selected === item.tabscreen ? styles.activeLabel: ''} label={item.name}
//                 onPress={() => gotoNavigate(item.tabscreen)}/>
//               )
//             )}
//           </Drawer.Section> */}
//         </View>
//       </DrawerContentScrollView>

//       <View style={styles.logoutSection}>
//         <TouchableOpacity
//           onPress={signOut}
//           style={{flexDirection: 'row', paddingBottom: 20, paddingTop: 20}}>
//           <Icon name="power-off" size={30} color="#cc2e00" type="light" />
//           {fullWidth ? (
//             <Text style={{marginLeft: 26, color: '#1E4293'}}> Đăng xuất</Text>
//           ) : null}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContent: {
//     flex: 1,
//   },
//   userInfoSection: {
//     paddingLeft: 20,
//     height: 50,
//     justifyContent: 'center',
//   },
//   appInfoSection: {
//     paddingLeft: 20,
//     justifyContent: 'center',
//   },
//   logoutSection: {
//     borderTopWidth: 1,
//     borderTopColor: COLOR.BORDER,
//     paddingLeft: 20,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 14,
//   },
//   row: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   section: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   paragraph: {
//     fontWeight: 'bold',
//     marginRight: 3,
//   },
//   drawerSection: {
//     borderTopColor: COLOR.BORDER,
//     //marginTop: 15,
//   },
//   utilitySection: {
//     borderBottomWidth: 0,
//   },
//   bottomDrawerSection: {
//     marginBottom: -1,
//     borderTopColor: COLOR.BORDER,
//     borderTopWidth: 1,
//   },
//   preference: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
//   activeLabel: {
//     color: '#126dd8',
//     fontWeight: 'bold',
//   },
//   noneItem: {
//     borderLeftWidth: 5,
//     borderLeftColor: 'transparent',
//   },
//   activeItem: {
//     borderLeftWidth: 5,
//     borderLeftColor: '#126dd8',
//     backgroundColor: '#92a9c4',
//   },
//   appName: {
//     padding: 20,
//   },
// });
