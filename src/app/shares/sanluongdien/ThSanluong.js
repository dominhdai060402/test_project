import _ from 'lodash';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Appearance,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import {LoadingView} from '../../components/Components';
import {useFetchAPI, createDataBieudo, createDataBieudoTD, createDataBieudoND} from './HookEvent';
import {COLOR} from '../../../env/config';
import {Appstyles} from '../../styles/AppStyle';
import MenuStyle from '../../styles/MenuStyle';
import {format} from 'date-fns';
import {OptionSanluong} from './ChartOption';
import { Stylescs } from '../thitruongdien/Stylescs';
import { formatNumber, numberFormat } from '../../../util/format';

// react-native-circular-progress
// react-native-progress-circle
// geremih react-native-circular-action-menu

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
export const ThSanluong = ({navigation}) => {
  const [allState, setAllState] = useState({
    isDate: false,
    date: new Date(),
    timeFocus: 'D',
    dataBieudo: {},
    chartND: null,
    chartTD: null,
    dataBox: {},
    dataND: {},
    dataTD: {},
    loading: false,
  });

  let fetchData = useFetchAPI(allState.date);
  //console.log('fetchData:', fetchData);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Sản lượng</Text>
          <Text style={{ color: '#000', fontSize: 11 }}>Thống kê sản lượng luỹ kế</Text>
        </View>
      )
    });

  }, [navigation, allState]);


  useEffect(() => {
    setAllState({
      ...allState, 
      dataBieudo: fetchData.chartNam, 
      chartND: fetchData.chartND,
      chartTD: fetchData.chartTD,
      dataBox: fetchData.tSLNgay,
    });
    // return () => {
    //   fetchData = {
    //     slNgay: [],
    //     slThang: [],
    //     slNam: [],
    //     slMuakho: [],
    //     tSLThang: [],
    //     tSLNam: [],
    //     chartNam: null,
    //     loading: true,
    //     error: '',
    //   };
      
    // };
  }, [fetchData]);

  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    const sDate = format(date, 'dd-MM-yyyy');
    setAllState({isDate: false, date});
  };

  const onChangeTimeND = (timeFocus) => {
    setAllState({...allState, timeFocus, loading: true});
    const renderPie = () => {
      if(timeFocus === 'D') {
        const dataBieudo = createDataBieudo(fetchData.tSLNgay);
        const chartND = createDataBieudoND(fetchData.tSLNgay);
        const chartTD = createDataBieudoTD(fetchData.tSLNgay);
        const dataBox = fetchData.tSLNgay;

        setAllState({...allState, dataBieudo, chartND, chartTD, dataBox, timeFocus, loading: false});
      } else if(timeFocus ==='M'){
        const dataBieudo = createDataBieudo(fetchData.tSLThang);
        const chartND = createDataBieudoND(fetchData.tSLThang);
        const chartTD = createDataBieudoTD(fetchData.tSLThang);

        const dataBox = fetchData.tSLThang;
        setAllState({...allState, dataBieudo, chartND, chartTD, dataBox, timeFocus, loading: false});
      } else {
        const dataBieudo = createDataBieudo(fetchData.tSLNam);
        const chartND = createDataBieudoND(fetchData.tSLNam);
        const chartTD = createDataBieudoTD(fetchData.tSLNam);
        const dataBox = fetchData.tSLNam;

        setAllState({...allState, dataBieudo, chartND, chartTD, dataBox, timeFocus, loading: false});
      }
    }
    setTimeout(renderPie, 1);
  }

  return (
    <SafeAreaView style={Appstyles.screen}>
      <ScrollView style={Appstyles.container} showsVerticalScrollIndicator={false}>
      <View style={[Stylescs.headerG1,{paddingLeft: 8}]}>
            <Icon
              name={'heart-rate'}
              color={'#109618'}
              size={20}
              type="light"
            />
            <Text style={{ fontSize: 16, padding: 8 }}>Genco1</Text>
            <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('Sanluongluyke')}>
              <Text style={{color: COLOR.GOOG_BLUE, textAlign: 'right'}}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        <View style={MenuStyle.box_content}>
          {fetchData.loading ? (
            <LoadingView />
          ) : (
            <View style={{flex: 1}} >
              
              <View style={{flex: 1}}>
               
                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[4].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Genco1</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#c6bcfb', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[4].tyLe}%`, backgroundColor: '#8d79f6', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[4].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[4].tyLe < 20 ? 30 : fetchData.tSLNam[4].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[4].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[4].tyLe < 20 ? 20 : fetchData.tSLNam[4].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#8d79f6' }}>
                      {fetchData.tSLNam[4].tyLe}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 64 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[2].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Trực thuộc</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#c6bcfb', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[2].tyLe}%`, backgroundColor: '#8d79f6', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[2].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[2].tyLe < 25 ? 35 : fetchData.tSLNam[4].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[2].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[2].tyLe < 20 ? 24 : fetchData.tSLNam[2].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#8d79f6' }}>{fetchData.tSLNam[2].tyLe}%</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 128}}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[3].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Liên kết</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#c6bcfb', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[3].tyLe}%`, backgroundColor: '#8d79f6', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[3].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[3].tyLe < 30 ? 40 : fetchData.tSLNam[4].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[3].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[3].tyLe < 20 ? 32: fetchData.tSLNam[3].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#8d79f6' }}>{fetchData.tSLNam[3].tyLe}%</Text>
                    </View>
                  </View>
                </View>

              
                <View style={{height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    {allState.loading ? (
                      <LoadingView />
                    ): (
                       <HighchartsReactNative
                       styles={styles.highchar}
                       options={allState.dataBieudo}
                     />
                    )}
                 
                  </View>
                  <View style={{width: 100}}>
                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Genco1</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[4]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, marginTop: 8, marginBottom: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Trực thuộc</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[2]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Liên kết</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[3]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>
                  </View>
                </View>

              </View>
              <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, marginTop: 16, justifyContent: 'space-between', padding: 2 }}>
                  <TouchableOpacity style={allState.timeFocus === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('D')}>
                    <Text>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('M')}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('Y')}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
              </View>

                {/* Khoi nhiet dien */}
                <View style={[Stylescs.headerG1,{paddingLeft: 8, marginLeft: -8, marginRight: -8, marginTop:16}]}>
                <Icon
                  name={'heart-rate'}
                  color={'#109618'}
                  size={20}
                  type="light"
                />
                <Text style={{ fontSize: 16, padding: 8 }}>Nhiệt điện</Text>
                <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('SLtheonhamayND')}>
                  <Text style={{color: COLOR.GOOG_BLUE, textAlign: 'right'}}>Chi tiết</Text>
                </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[1].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1, marginTop: 12 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Tổng khối nhiệt điện</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#85abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[1].tyLe}%`, backgroundColor: '#407ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[1].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[5].tyLe < 20 ? 30 : fetchData.tSLNam[1].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[1].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[1].tyLe < 20 ? 20 : fetchData.tSLNam[1].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#407ccc' }}>
                      {fetchData.tSLNam[4].tyLe}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 64 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[5].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Trực thuộc</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#85abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[5].tyLe}%`, backgroundColor: '#407ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[5].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[5].tyLe < 25 ? 30 : fetchData.tSLNam[4].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[5].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[5].tyLe < 20 ? 24 : fetchData.tSLNam[5].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#407ccc' }}>{fetchData.tSLNam[5].tyLe}%</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 128}}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[6].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Liên kết</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#85abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[6].tyLe}%`, backgroundColor: '#407ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[6].thucHien)}</Text>
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[6].tyLe < 30 ? 40 : fetchData.tSLNam[1].tyLe}%`}}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[6].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[6].tyLe < 20 ? 32: fetchData.tSLNam[6].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#407ccc' }}>{fetchData.tSLNam[6].tyLe}%</Text>
                    </View>
                  </View>
                </View>
                <View style={{height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    {allState.loading ? (
                      <LoadingView />
                    ): (
                       <HighchartsReactNative
                       styles={styles.highchar}
                       options={allState.chartND}
                     />
                    )}
                 
                  </View>
                  <View style={{width: 100}}>
                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Tổng</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[1]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, marginTop: 8, marginBottom: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Trực thuộc</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[5]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Liên kết</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[6]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, marginTop: 16, justifyContent: 'space-between', padding: 2 }}>
                  <TouchableOpacity style={allState.timeFocus === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('D')}>
                    <Text>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('M')}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('Y')}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
              </View>

                {/* Khoi thuỷ  dien */}
                <View style={[Stylescs.headerG1,{paddingLeft: 8, marginLeft: -8, marginRight: -8, marginTop:16}]}>
                <Icon
                  name={'heart-rate'}
                  color={'#109618'}
                  size={20}
                  type="light"
                />
                <Text style={{ fontSize: 16, padding: 8 }}>Thuỷ điện</Text>
                <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('SLtheonhamay')}>
                  <Text style={{color: COLOR.GOOG_BLUE, textAlign: 'right'}}>Chi tiết</Text>
                </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[0].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1, marginTop: 12 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Tổng khối thuỷ điện</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[0].tyLe}%`, backgroundColor: '#00754a', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[0].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[0].tyLe < 25 ? 30 : fetchData.tSLNam[0].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[0].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[0].tyLe < 20 ? 20 : fetchData.tSLNam[0].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#00754a' }}>
                      {fetchData.tSLNam[4].tyLe}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 64 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[7].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Trực thuộc</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[7].tyLe}%`, backgroundColor: '#00754a', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[7].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[7].tyLe < 30 ? 30 : fetchData.tSLNam[0].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[7].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[5].tyLe < 20 ? 24 : fetchData.tSLNam[7].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#00754a' }}>{fetchData.tSLNam[7].tyLe}%</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 128}}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(fetchData.tSLNam[8].keHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Liên kết</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[8].tyLe}%`, backgroundColor: '#00754a', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[8].thucHien)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${fetchData.tSLNam[8].tyLe < 30 ? 30 : fetchData.tSLNam[0].tyLe}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{formatNumber(fetchData.tSLNam[8].thucHien)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${fetchData.tSLNam[6].tyLe < 20 ? 32: fetchData.tSLNam[8].tyLe}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#00754a' }}>{fetchData.tSLNam[8].tyLe}%</Text>
                    </View>
                  </View>
                </View>

                <View style={{height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    {allState.loading ? (
                      <LoadingView />
                    ): (
                       <HighchartsReactNative
                       styles={styles.highchar}
                       options={allState.chartTD}
                     />
                    )}
                 
                  </View>
                  <View style={{width: 100}}>
                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Tổng</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[0]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, marginTop: 8, marginBottom: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Trực thuộc</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[7]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius: 8, padding: 8}}>
                      <Text style={{fontSize: 12, marginTop: 8}}>Liên kết</Text>
                      <Text style={{fontSize: 10, marginTop: 2}}>Kế hoạch</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}>
                      <Text style={{textAlign: 'center', color: '#ec8a8f', fontWeight: 'bold'}}>{numberFormat(allState.dataBox[8]?.keHoach)}</Text>
                      <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tr.kWh</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, marginTop: 16, justifyContent: 'space-between', padding: 2 }}>
                  <TouchableOpacity style={allState.timeFocus === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('D')}>
                    <Text>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('M')}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('Y')}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <DateTimePickerModal
          headerTextIOS="Chọn tháng năm"
          isVisible={allState.isDate}
          mode="date"
          isDarkModeEnabled={isDark}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  highchar: {
    justifyContent: 'center',
    flex: 1,
    height: 500,
  },
  item_time: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item_time_focus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
});
