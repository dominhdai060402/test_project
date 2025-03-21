import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {COLOR, RouteC3} from '../../../env/config';
import {RighIcon} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {SettingScreen} from '../../SettingScreen';
import {Baocaosanxuat} from '../../shares/bcngay/Baocaosanxuat';
import {ChitietND} from '../../shares/bcngay/ChitietND';
import {ChitietTD} from '../../shares/bcngay/ChitietTD';
import {CTKTKythuat} from '../../shares/ctktkythuat/CTKTKythuat';
import {Thongtinnhansu} from '../../shares/hrms/Thongtinnhansu';
import {ChitieMTtnhamay} from '../../shares/moitruong/ChitieMTtnhamay';
import {Moitruong} from '../../shares/moitruong/Moitruong';
import {Nhienlieu} from '../../shares/nhienlieu/Nhienlieu';
import {Sanluongluyke} from '../../shares/sanluongdien/sanluongluyke';
import {ThSanluong} from '../../shares/sanluongdien/ThSanluong';
import {Suachualon} from '../../shares/suachualon/Suachualon';
import {Bieudonhamay} from '../../shares/thitruongdien/Bieudonhamay';
import Congsuathethong from '../../shares/thitruongdien/Congsuathethong';
import {TTthitruong} from '../../shares/thitruongdien/TTthitruong';
import {Bieudothuyvan} from '../../shares/thuyvan/Bieudothuyvan';
import {Appstyles} from '../../styles/AppStyle';
import {AppHeaderMain} from '../AppHeader';
import TextTicker from 'react-native-text-ticker';
import {Taichinh} from '../../shares/taichinh/Taichinh';
import {SLtheonhamay} from '../../shares/sanluongdien/SLtheonhamay';
import {SLtheonhamayND} from '../../shares/sanluongdien/SLtheonhamayND';
import { G1Thuyvan } from '../../shares/thuyvan/Thuyvan';

const {width: screenWidth} = Dimensions.get('window');
const http = new CommonHttp();
function StackTTDienHome({navigation}) {
  const [allState, setAllState] = useState({
    loading: false,
    data: null,
    news: [],
    itemNew: null,
    user: null,
    thongbao: '',
  });

  useEffect(() => {
    const onInit = async () => {
      let thongbao = '';
      let info = {};
      const user = await AsyncStorage.getItem('@auth-user');
      if (user) {
        info = JSON.parse(user);
        //console.log('value:', value);
        // setAllState({...allState, user: value});
      }

      await http
      .get(TtdURL.GetThongBaoVanHanhChiTietToMay())
      .then(res => {
        const data = res.data;
        //console.log('DATA:', data);
        data.map((item, index)=>{
          thongbao = thongbao + item.ghiChuVanHanhToMay + ', ';
        })
      })
      .catch(error => { });
      setAllState({...setAllState, thongbao, user: info})
      
    };
    onInit();
  }, []);

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.boxInfo}>
          <TextTicker
            style={{padding: 16}}
            duration={80000}
            loop
            bounce
            shouldAnimateTreshold={40}
            repeatSpacer={50}
            marqueeDelay={20}>
            {allState.thongbao}
          </TextTicker>
        </View>

        <View
          style={{
            height: 134,
            flexDirection: 'row',
            marginRight: 24,
            marginLeft: 24,
          }}>
          <View style={{flex: 1, marginTop: 20}}>
            <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
              {allState.user?.companyName}
            </Text>
            <Text style={{color: '#FFF', marginTop: 12}}>
              Xin chào: {allState.user?.username}
            </Text>
          </View>
          <View style={{width: 64}}>
            <View style={styles.avatar}>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: COLOR.HEARDER,
                }}>
                {allState.user?.username.substring(0, 1)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#f1f0f5',
            width: '100%',
            paddingTop: 32,
          }}>
          {/* Hàng 1 */}
          <View style={styles.rowFuture}>
            <TouchableOpacity
              style={styles.itemFuture}
              onPress={() => navigation.navigate('Congsuathethong')}>
              <Icon
                name={'battery-bolt'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Công suất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemCenter}
              onPress={() => navigation.navigate('TTthitruong')}>
              <Icon
                name={'waveform-path'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Thị trường điện</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemRight}
              onPress={() => navigation.navigate('Bieudothuyvan')}>
              <Icon
                name={'water-rise'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Thủy văn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowFuture}>
            <TouchableOpacity
              style={styles.itemFuture}
              onPress={() => navigation.navigate('ThSanluong')}>
              <Icon
                name={'heart-rate'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Sản lượng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemCenter}
              onPress={() => navigation.navigate('Taichinh')}>
              <Icon
                name={'analytics'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Tài chính</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemRight}
              onPress={() => navigation.navigate('Suachualon')}>
              <Icon name={'tools'} color={'#8D79F6'} size={24} type="light" />
              <Text style={styles.txtFeature}>Lịch sửa chữa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowFuture}>
            <TouchableOpacity
              style={styles.itemFuture}
              onPress={() => navigation.navigate('CTKTKythuat')}>
              <Icon
                name={'microchip'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Chỉ tiêu KTKT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemCenter}
              onPress={() => navigation.navigate('Nhienlieu')}>
              <Icon
                name={'gas-pump'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Nhiên liệu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemRight}
              onPress={() => navigation.navigate('Moitruong')}>
              <Icon
                name={'fire-smoke'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>Môi trường</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowFuture}>
            <TouchableOpacity
              style={styles.itemFuture}
              onPress={() => navigation.navigate('Baocaosanxuat')}>
              <Icon
                name={'file-chart-line'}
                color={'#8D79F6'}
                size={24}
                type="light"
              />
              <Text style={styles.txtFeature}>BCSX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemCenter}
              onPress={() => navigation.navigate('Thongtinnhansu')}>
              <Icon name={'users'} color={'#8D79F6'} size={24} type="light" />
              <Text style={styles.txtFeature}>Nhân sự</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemNone}>
              {/* <Icon name={'fire-smoke'} color={'#8D79F6'} size={24}type="light"/>
              <Text style={styles.txtFeature}>Môi trường</Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();
function StackTTDien({navigation, route}) {
  const [user, setUser] = useState();
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  //console.log('routeName:',routeName);
  useEffect(() => {
    const onInit = async () => {
      if (RouteC3.RouteTTD.includes(routeName)) {
        navigation.setOptions({tabBarVisible: false});
      } else {
        navigation.setOptions({tabBarVisible: true});
      }

      const aToc = await AsyncStorage.getItem('@auth-user');
      if (aToc) {
        const auth = JSON.parse(aToc);
        setUser(auth);
      }
    };
    onInit();
  }, [routeName]);

  return (
    <Stack.Navigator
      initialRouteName="StackTTDienHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          borderTopWidth: 0,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        //headerTransparent: true,
        headerShown: false,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="StackTTDienHome"
        component={StackTTDienHome}
        options={({navigation, route}) => ({
          //headerShown: true,
          headerTitle: () => (
            <AppHeaderMain appName={'Tổng công ty Phát điện 1'} user={user} />
          ),
          headerRight: () => <RighIcon />,
          //headerLeft: navigation => <SettingIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Congsuathethong"
        component={Congsuathethong}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Công suất',
        }}
      />

      <Stack.Screen
        name="Bieudonhamay"
        component={Bieudonhamay}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Công suất',
        }}
      />

      <Stack.Screen
        name="TTthitruong"
        component={TTthitruong}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin thị trường',
        }}
      />

      <Stack.Screen
        name="Bieudothuyvan"
        component={Bieudothuyvan}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin thuỷ văn',
        }}
      />
      <Stack.Screen
        name="G1Thuyvan"
        component={G1Thuyvan}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin thuỷ văn',
        }}
      />

      <Stack.Screen
        name="Taichinh"
        component={Taichinh}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Tài chính',
        }}
      />
      <Stack.Screen
        name="ThSanluong"
        component={ThSanluong}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Sản lượng',
        }}
      />

      <Stack.Screen
        name="SLtheonhamay"
        component={SLtheonhamay}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Sản lượng',
        }}
      />
      <Stack.Screen
        name="SLtheonhamayND"
        component={SLtheonhamayND}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Sản lượng',
        }}
      />

      <Stack.Screen
        name="Sanluongluyke"
        component={Sanluongluyke}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Sản lượng',
        }}
      />

      <Stack.Screen
        name="CTKTKythuat"
        component={CTKTKythuat}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Chỉ tiêu kinh tế kỹ thuật',
        }}
      />

      <Stack.Screen
        name="Suachualon"
        component={Suachualon}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Sửa chữa lớn',
        }}
      />

      <Stack.Screen
        name="Nhienlieu"
        component={Nhienlieu}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Cung cấp nhiên liệu',
        }}
      />

      <Stack.Screen
        name="Moitruong"
        component={Moitruong}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin môi trường',
        }}
      />

      <Stack.Screen
        name="ChitieMTtnhamay"
        component={ChitieMTtnhamay}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin môi trường',
        }}
      />
      <Stack.Screen
        name="Baocaosanxuat"
        component={Baocaosanxuat}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Báo cáo SX',
        }}
      />

      <Stack.Screen
        name="ChitietND"
        component={ChitietND}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'BCSX Khối nhiệt điện',
        }}
      />
      <Stack.Screen
        name="ChitietTD"
        component={ChitietTD}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'BCSX Khối thủy điện',
        }}
      />

      <Stack.Screen
        name="Thongtinnhansu"
        component={Thongtinnhansu}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Thông tin nhân sự',
        }}
      />

      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
          headerShown: true,
          headerTitle: 'Cài đặt',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boxShow: {
    width: '100%',
    height: 130,
    marginBottom: 8,
    marginRight: 0,
    paddingRight: 4,
  },
  boxShowFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 4,
  },
  vRowFeature: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  vFeature: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLOR.LIGHT_GREY,
  },
  itemFeature: {
    width: '33.33333%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFeature: {
    color: '#000',
    marginTop: 4,
  },

  item: {
    width: screenWidth - 60,
    height: 148,
    paddingBottom: 4,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}),
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },

  // UI 2 UI moi
  boxInfo: {
    height: 48,
    width: '95%',
    backgroundColor: '#FFF',
    borderRadius: 50,
    position: 'absolute',
    marginTop: 110,
    zIndex: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    paddingRight: 8,
    paddingLeft: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    //backgroundColor: 'rgba(0, 12, 100, 1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowFuture: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    height: 72,
    marginTop: 24,
  },

  itemFuture: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginRight: 6,
  },

  itemCenter: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginLeft: 6,
    marginRight: 6,
  },
  itemRight: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginLeft: 6,
  },
  itemNone: {
    flex: 1,
    borderRadius: 10,
    marginLeft: 6,
  },
});

export default StackTTDien;
