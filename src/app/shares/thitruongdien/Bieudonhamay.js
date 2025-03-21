
import _ from 'lodash';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { format, parse } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-fontawesome-pro';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Appearance,
  SafeAreaView,
  Platform,
} from 'react-native';
// import Orientation from 'react-native-orientation-locker';
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import { TTDOptions, TTDspOptions } from './chartOptions';
import { Appstyles } from '../../styles/AppStyle';
import { numberFormat } from '../../../util/format';
import TextTicker from 'react-native-text-ticker';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function Bieudonhamay(props) {
  const item = props.route.params.item;

  const chartMW = useRef(null);
  const [allState, setAllState] = useState({
    loading: true,
    data: [],
    message: '',
    ngayxem: format(new Date(), 'dd-MM-yyyy'),
    isDate: false,
    lgTomay: [],
    lgTomayvl: [],
    chartOptions: null,
    thongtin: [],
    thongbao: null,
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      // headerRight: () => (
      //   <TouchableOpacity onPress={() => setAllState({...allState, isDate: true})}>
      //     <Icon name={'calendar-alt'} color={'#000'} size={20} type="light" containerStyle={{ paddingRight: 16 }} />
      //   </TouchableOpacity>
      // ),
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Công suất</Text>
          <Text style={{ color: '#000', fontSize: 12 }}>Ngày: {allState.ngayxem}</Text>
        </View>
      )
    });

  }, [props.navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      // Orientation.lockToLandscape();
      fetchData(allState.ngayxem, false);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, update) => {
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
    let chartData = TTDspOptions.chartOptions;
    let lgTomay = [
      {
        name: 'Tổng công suất',
        color: COLOR.GREEN,
      },
    ];
    let lgTomayvl = [
      {
        name: item.congSuatScada?.toFixed(1),
        color: COLOR.GREEN,
      },
    ];
    let series = [];
    let thongtin = [];
    let thongbao = null;

    await http.get(TtdURL.GetTinHieuScada()).then((res) => {
      //console.log('Thong bao:', res.data);
      thongbao = res.data;
    }).catch((error) => {

    });
    //console.log('Daaaaaaaaaa: ', (new Date()).getTime());

    await http
      .post(TtdURL.GetDataBieuDoCongSuat(), {
        idnhamay: item.idNhaMay,
        Ngay: ngayxem,
      })
      .then(async res => {
        let data = res.data;
        //console.log('api/Scada/GetDataBieuDoCongSuat: ', data);
        let minData = 999999;
        if (data) {
          //let xAxis = [];
          //console.log('---------------', data);
          data.map((item, index) => {
            let total = 0;
            let tenToMay = '';
            let dataTomay = [];
            const nItems = _.orderBy(item, ['tdht'], ['esc']);
            data[index] = nItems;
            let ihm = '';
            const nLen = nItems.length;
            nItems.map((wh, i) => {
              total += wh.congSuat ? wh.congSuat : 0;
              if (i === 0) {
                tenToMay = wh.tenToMay;
              }
              const d = new Date(wh.tdht);
              if (Platform.OS === 'ios') {
                d.setHours(d.getHours() + 7);
              }
              if (i === nLen - 1 && data.thongTinToMay) {
                thongtin.push(tenToMay + ': ' + data.thongTinToMay);
              }
              //d.setHours(d.getHours() + 7);
              //const hs = format(new Date(wh.tdht).toUTCString(), 'hh:ss');
              // if (ihm === '' || ihm !== hs) {
              //   ihm = hs;
              // if (index === 0) {
              //   xAxis.push(hs);
              // }
              if (minData > wh.congSuat) {
                minData = wh.congSuat;
              }
              const iNode = [d.getTime(), wh.congSuat];
              dataTomay.push(iNode);
              //}
            });
            const tomay = {
              name: tenToMay,
              color: 'orange',
            };
            lgTomay.push(tomay);

            const tomayvl = {
              name: total / 100,
              color: 'orange',
            };
            lgTomayvl.push(tomayvl);
            // PUSH data vao bieu do
            series.push({
              name: tenToMay,
              data: dataTomay,
            });
          });
          //console.log('xAxis: ', xAxis);
          //console.log('lgTomayvl: ', series);
          //chartData.xAxis.categories = xAxis;
          chartData.yAxis.min = minData - 10;
          chartData.series = series;
          //console.log('chartData: ', series);
        } else {
        }
      })
      .catch(err => {
        chartData.series = series;
        thongtin.push(`${err}`);
        console.log(err);
      });

    setAllState({
      ...allState,
      loading: false,
      data: [],
      message: ``,
      lgTomay,
      lgTomayvl,
      ngayxem,
      isDate: false,
      chartOptions: chartData,
      thongtin, thongbao
    });
  };

  const hideDatePicker = () => {
    setAllState({ ...allState, isDate: false });
  };

  const handleConfirm = date => {
    const sDate = format(date, 'dd-MM-yyyy');
    if (sDate !== allState.ngayxem) {
      fetchData(sDate, true);
    }
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        {allState.loading ? (
          <LoadingView />
        ) : (
          <View style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
            <View style={{ backgroundColor: '#f2f1f6', height: 82 }}>
              <View
                style={{
                  backgroundColor: '#FFF',
                  height: 32,
                  margin: 8,
                  borderRadius: 50,
                  justifyContent: 'center',
                }}>
                <TextTicker
                  style={{ padding: 8 }}
                  duration={50000}
                  loop
                  bounce
                  shouldAnimateTreshold={40}
                  repeatSpacer={50}
                  marqueeDelay={20}>
                  {allState.thongbao}
                </TextTicker>
                {/* <Text style={{paddingLeft: 8, paddingRight: 8}}>
                  {allState.thongbao}
                </Text> */}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    paddingLeft: 8,
                    paddingTop: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name={'chart-bar'}
                    color={COLOR.ORANGE}
                    size={20}
                    type="light"
                  />
                  <Text
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      fontWeight: 'bold',
                    }}>
                    {item.tenNhaMay.toUpperCase()}
                  </Text>
                </View>
                <Text style={{ textAlign: 'right', alignSelf: 'flex-end', paddingRight: 8, fontWeight: 'bold', color: COLOR.GOOG_BLUE }}>
                  {numberFormat(item.congSuatScada)} MW
                </Text>
              </View>
            </View>
            <View style={styles.vlegend}>
              <View style={styles.vlegendBox}>
                {item.tomays.map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      textAlign: 'left',
                      padding: 8,
                    }}>
                    Công suất tổ máy {item.tenToMay}
                  </Text>
                ))}
              </View>
              <View style={styles.vlegendBox}>
                {item.tomays.map((item, index) => (
                  <View key={index}
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text

                      style={{
                        textAlign: 'right',
                        padding: 8,
                        paddingRight: 0,
                        color: COLOR.GOOG_BLUE,
                        fontWeight: 'bold',
                        textDecorationLine: item.online
                          ? 'underline'
                          : 'none',
                      }}>
                      {numberFormat(item.congSuatScada)}
                    </Text>
                    <Text
                      style={{
                        padding: 8,
                        paddingLeft: 8,
                        color: COLOR.LIGHT_GREY,
                        fontSize: 12,
                      }}>
                      MW
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {allState.thongtin.map((item, index) => (
              <View key={index} style={{ padding: 8 }}>
                <Text style={{ color: COLOR.RED }}>{item}</Text>
              </View>
            ))}
            <View style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <View style={{ left: 0, width: '50%' }}>
                  <Text
                    style={{ textAlign: 'left', paddingLeft: 8, fontSize: 12 }}>
                    (MW)
                  </Text>
                </View>
                <View style={{ right: 0, width: '50%' }}>
                  <Text></Text>
                </View>
              </View>
              <HighchartsReactNative
                ref={chartMW}
                styles={styles.highchar}
                options={allState.chartOptions}
              />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  highchar: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
  },
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: '#f2f1f6',
    borderRadius: 8,
  },
  vlegendBox: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
});
