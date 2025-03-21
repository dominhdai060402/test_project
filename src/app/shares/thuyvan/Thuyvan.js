import HighchartsReactNative from '@highcharts/highcharts-react-native';
import {format, subDays} from 'date-fns';
import {extendTheme, Select} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import ThuyvanURL from '../../services/thitruongdien/thuyvanURL';
import {Appstyles} from '../../styles/AppStyle';
import {findNhamay} from '../thitruongdien/findName';
import {Thuyvan} from './chartOptions';
//import { FlingGestureHandler } from 'react-native-gesture-handler/Swipeable';
import SwipeGesture from '../../components/SwipeGesture';

export const G1Thuyvan = props => {
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    isDate: false,
    data: [],
    hochua: null,
    dataHochua: [],
    dataThuyvan: {},
    chartOptions: null,
    scrollToIndex: 0,
  });
  const [ref, setRef] = useState(null);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        //
        <TouchableOpacity
          onPress={() => setAllState({...allState, isDate: true})}>
          <Icon
            name={'calendar-alt'}
            color={'#000'}
            size={20}
            type="light"
            containerStyle={{paddingRight: 16}}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 14}}>
            Thủy văn
          </Text>
          <Text style={{color: '#000', fontSize: 11}}>
            Ngày: {allState.ngayxem}
          </Text>
        </View>
      ),
    });
  }, [props.navigation, allState]);

  const onSwipePerformed = action => {
    /// action : 'left' for left swipe
    /// action : 'right' for right swipe
    /// action : 'up' for up swipe
    /// action : 'down' for down swipe

    switch (action) {
      case 'left': {
        console.log('left Swipe performed');
        break;
      }
      case 'right': {
        console.log('right Swipe performed');
        break;
      }
      case 'up': {
        console.log('up Swipe performed');
        break;
      }
      case 'down': {
        console.log('down Swipe performed');
        break;
      }
      default: {
        console.log('Undeteceted action');
      }
    }
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={{height: 42}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            ref={ref => {
              setRef(ref);
            }}>
            <View style={{backgroundColor: '#f2f1f6', flexDirection: 'row'}}>
              {allState.dataHochua.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeHochua(item.value)}
                  style={{padding: 12}}>
                  <Text
                    style={
                      allState.hochua === item.value
                        ? styles.itemfocus
                        : styles.itemNone
                    }>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <SwipeGesture
          gestureStyle={styles.container}
          onSwipePerformed={onSwipePerformed}>
          <ScrollView>
            <Text>This is react native swipe gesture</Text>
            <Text>Used to detect the user swipes and function accordingly</Text>
          </ScrollView>
        </SwipeGesture>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#FFF',
  },
  container: {
    height: '100%',
    widht: '100%',
  },
  swipesGestureContainer: {
    height: '100%',
    width: '100%',
  },
  highchar: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
    height: 500,
  },
  boxType: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#c0dcf1',
    marginLeft: 8,
    marginRight: 8,
  },
  boxMucnuoc: {
    flex: 1,
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    borderColor: '#CED0CE',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#f2f1f6',
  },
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  hochuaview: {
    justifyContent: 'center',
    alignItems: 'center',
    //paddingTop: 16,
  },
  vlegendBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  picker: {
    alignItems: 'center',
    height: 35,
    borderColor: '#004488',
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 35,
    width: 200,
  },
  colChuky: {
    justifyContent: 'center',
    width: '70%',
    paddingTop: 12,
    paddingBottom: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: '#CED0CE',
  },
  colGiatri: {
    justifyContent: 'center',
    width: '30%',
    paddingTop: 12,
    paddingBottom: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: '#CED0CE',
  },
  textVal: {
    textAlign: 'right',
    color: '#555555',
    fontWeight: 'bold',
  },
  textHead: {
    color: '#555555',
    fontWeight: 'bold',
  },
  itemfocus: {
    fontWeight: 'bold',
    color: '#000',
  },
  itemNone: {
    color: '#6c767c',
  },
});
