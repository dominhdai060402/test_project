import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-fontawesome-pro';
import {COLOR} from '../../../env/config';
import {RighIcon, SettingIcon} from '../../components/Components';
import {SettingScreen} from '../../SettingScreen';
import {Appstyles} from '../../styles/AppStyle';
import MenuStyle from '../../styles/MenuStyle';
import {AppHeader} from '../AppHeader';
//import {Vietnam} from '../../../assets/img/Vietnam_location_map2.svg'; 
import {SvgUri} from 'react-native-svg';
import { useDisclose, Actionsheet } from 'native-base';
import {DataFactoryDT, DataFactoryTD} from './Thongtinnhamay'
import { numberFormat } from '../../../util/format';

function HomeScreen({navigation}) {
  const [inforDetail, setInforDetail] = useState({type: 2,tomays: []});
  const {isOpen, onOpen, onClose} = useDisclose();
  const dataND = DataFactoryDT;
  const dataTD = DataFactoryTD;
  const onShow = (nhamay)=>{
    if(nhamay === inforDetail) {
      nhamay = '';
    }
    setInforDetail(nhamay);
  }

  const onOpendSheet =(data, index)=>{
    data.index = index;
    setInforDetail(data);
    onOpen();
  }

  return (
    <SafeAreaView style={[Appstyles.screen, {backgroundColor: '#e0e0e0'}]}>
      <View style={{position: 'absolute', top: 350, zIndex: 3, elevation: 3, width: 96}}>
        <Text style={{textAlign: 'center', color: '#f9936e'}}>
          Bản đồ các nhà máy trực thuộc Genco1
        </Text>
      </View>
      <View style={styles.info}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.g1Infor}>7.786</Text>
          <Text style={{marginTop: 12, color: '#FFF', fontSize: 10}}>MW</Text>
        </View>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>
          Genco1
        </Text>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>
          Công suất thiết kế
        </Text>
      </View>

      {/* Điểm các nhà máy */}
      {/* <View style={[styles.pointNodeR,{right: 164,top: 132}]}>
        <View style={styles.pointR}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNode,{right: 12,top: 136}]} onPress={()=>onOpendSheet(dataND[0],0)}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>{dataND[0].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>{numberFormat(dataND[0].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.factoryNode,{right: 12,top: 178}]} onPress={()=>onOpendSheet(dataND[3],0)}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>{dataND[3].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>{numberFormat(dataND[3].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      
      {/* <View style={[styles.pointNodeR,{right: 218,top: 218}]}>
        <View style={styles.pointR}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNode,{right: 72,top: 250}]} onPress={()=>onOpendSheet(dataND[1],0)}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>{dataND[1].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>{numberFormat(dataND[1].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>

      {/* <View style={[styles.pointNodeP,{right: 268,top: 216}]}>
        <View style={styles.pointP}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 270}]} onPress={()=>onOpendSheet(dataTD[0],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[0].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[0].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 305}]} onPress={()=>onOpendSheet(dataTD[5],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[5].tomays[0].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[5].tomays[0].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>


      {/* <View style={[styles.pointNodeP,{right: 118,top: 382}]}>
        <View style={styles.pointP}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNodeTD,{right: 8,top: 400}]} onPress={()=>onOpendSheet(dataTD[1],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[1].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[1].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>


      {/* <View style={[styles.pointNodeP,{right: 90,bottom: 232}]}>
        <View style={styles.pointP}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 448}]} onPress={()=>onOpendSheet(dataTD[2],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[2].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[2].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 484}]} onPress={()=>onOpendSheet(dataTD[3],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[3].tomays[0].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[3].tomays[0].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 520}]} onPress={()=>onOpendSheet(dataTD[3],1)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[3].tomays[1].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[3].tomays[1].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 556}]} onPress={()=>onOpendSheet(dataTD[4],0)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[4].tomays[0].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[4].tomays[0].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{left: 8,top: 592}]} onPress={()=>onOpendSheet(dataTD[4],1)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[4].tomays[1].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[4].tomays[1].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{right: 8,top: 470}]} onPress={()=>onOpendSheet(dataTD[4],2)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[4].tomays[2].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[4].tomays[2].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{right: 8,top: 505}]} onPress={()=>onOpendSheet(dataTD[4],3)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[4].tomays[3].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[4].tomays[3].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNodeTD,{right: 8,top: 540}]} onPress={()=>onOpendSheet(dataTD[5],1)}>
        <Text style={{paddingLeft: 8, color: '#FFF', fontSize: 12}}>{dataTD[5].tomays[1].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>{numberFormat(dataTD[5].tomays[1].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>


      {/* <View style={[styles.pointNodeP,{right: 108,bottom: 204}]}>
        <View style={styles.pointP}></View>
      </View>

      <View style={[styles.pointNodeP,{right: 132,bottom: 220}]}>
        <View style={styles.pointP}></View>
      </View>

      <View style={[styles.pointNodeY,{right: 132,bottom: 192}]}>
        <View style={styles.pointY}></View>
      </View>

      <View style={[styles.pointNodeR,{right: 188,bottom: 136}]}>
        <View style={styles.pointR}></View>
      </View> */}
      <TouchableOpacity style={[styles.factoryNode,{right: 48,bottom: 110}]} onPress={()=>onOpendSheet(dataND[2],0)}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>{dataND[2].ten}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>{numberFormat(dataND[2].congsuat)} </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.factoryNode,{right: 64,bottom: 64}]}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>D.Hải 2 </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>1.245 </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.factoryNode,{right: 64,bottom: 26}]}>
        <Text style={{paddingLeft: 8, color: '#363975', fontSize: 12}}>D.Hải 3MR </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#f55c1b', fontWeight: 'bold'}}>688 </Text>
          <Text style={{color: '#363975', paddingRight: 8, fontSize: 10, marginTop: 4}}>MW</Text>
        </View>
      </TouchableOpacity> */}

    <Image style={{width: '100%', height: '100%'}} resizeMode='cover' source={require('../../../assets/img/bg_node_factory.png')}></Image>
      {/* <SvgUri
        //resizeMode="cover"
        //style={{marginTop: -50}}
        width="100%"
        height="100%"
        uri="https://upload.wikimedia.org/wikipedia/commons/3/3f/Vietnam_location_map.svg"
      /> */}
       <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <View style={{height: 300, width: '100%', marginLeft:8, marginRight: 8}}>
            <Text style={{fontWeight: 'bold'}}>{inforDetail.fullName}</Text>
            <Text style={{marginTop: 8}}>{inforDetail.diachi}</Text>
            {inforDetail?.type === 2 && (
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 8}}>Công suất thiết kế: </Text>
              <Text style={{marginTop: 8, fontWeight: 'bold'}}>{numberFormat(inforDetail.congsuat)} MW</Text>
            </View>
            )}
            <View style={{height: 1, backgroundColor: '#9498bc', marginTop:8}}></View>
            {inforDetail?.type === 2 ? (
            <View>
              <Text style={{marginTop: 8, marginBottom: 4}}>Công suất thiết kế theo tổ máy</Text>
              {inforDetail?.tomays.map((item, index)=>(
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between',paddingTop:4, paddingBottom: 4}}>
                  <View style={{flex: 1}}><Text>{item.ten}: {item.congsuat}</Text></View>
                  <View style={{flex: 1}}><Text>Pmin: {item.pmin}</Text></View>
                  <View style={{flex: 1}}><Text>Pmax: {item.pmax}</Text></View>
                </View>
              ))}
            </View>
            ): (
              <View>
                <Text style={{marginTop: 8, marginBottom: 4, fontWeight: 'bold'}}>Nhà máy thuỷ điện {inforDetail?.tomays[inforDetail?.index].ten}</Text>
                <Text style={{marginBottom: 4}}>Địa chỉ: {inforDetail?.tomays[inforDetail?.index].diachi}</Text>
                <Text style={{marginBottom: 4}}>Tổ máy: {inforDetail?.tomays[inforDetail?.index].tomay}</Text>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between',paddingTop:4, paddingBottom: 4}}>
                  <View style={{flex: 1}}><Text>Công suất: {inforDetail?.tomays[inforDetail?.index].congsuat}</Text></View>
                  <View style={{flex: 1}}><Text>Pmin: {inforDetail?.tomays[inforDetail?.index].pmin}</Text></View>
                  <View style={{flex: 1}}><Text>Pmax: {inforDetail?.tomays[inforDetail?.index].pmax}</Text></View>
                </View>
             
              </View>
            )}
          </View> 
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function StackInforFactory() {
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
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          borderTopWidth: 0,
        },
        headerShown: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({navigation, route}) => ({
          headerTitle: () => (
            <View>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 14}}>
                Bản đồ
              </Text>
              <Text style={{color: '#000', fontSize: 11}}>
                Bản đồ các nhà máy Genco1
              </Text>
            </View>
          ),
          //headerRight: () => <RighIcon />,
          //headerLeft: navigation => <SettingIcon navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerTitle: 'Cài đặt'}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  g1Infor: {
    padding: 8,
    paddingBottom: 0,
    paddingRight: 2,
    color: '#FFF',
    fontWeight: 'bold',
  },
  info: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 12, 100, 0.3)',
    bottom: 8,
    zIndex: 3,
    elevation: 3,
    width: 124,
    borderRadius: 8,
    paddingBottom: 8,
    left: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointR: {
    width: 6,
    height: 6,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  pointNodeR: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255,0,0, 0.3)',
    zIndex: 3,
    elevation: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  factoryNode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: '#feb8a1',
    alignItems: 'center',
    zIndex: 3,
    elevation: 3,
    borderRadius: 25,
    width: 140,
    height: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  factoryNodeTD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: '#039703',
    alignItems: 'center',
    zIndex: 3,
    elevation: 3,
    borderRadius: 25,
    width: 140,
    height: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  pointP: {
    width: 6,
    height: 6,
    backgroundColor: '#039703',
    borderRadius: 50,
  },
  pointNodeP: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: 'rgba(3, 151, 3, 0.3)',
    zIndex: 3,
    elevation: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  pointY: {
    width: 6,
    height: 6,
    backgroundColor: '#FE6B1C',
    borderRadius: 50,
  },
  pointNodeY: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: 'rgba(254, 107, 28, 0.3)',
    zIndex: 3,
    elevation: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  infoDetail: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    zIndex: 5,
    elevation: 5,
    width: 300,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default StackInforFactory;
