import HighchartsReactNative from '@highcharts/highcharts-react-native';
import {format, subDays, addDays} from 'date-fns';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import {
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import ThuyvanURL from '../../services/thitruongdien/thuyvanURL';
import {Appstyles} from '../../styles/AppStyle';
import {findNhamay} from '../thitruongdien/findName';
import {Thuyvan, ThuyvanNgayD} from './chartOptions';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
const width = Dimensions.get('window').width;
export function Bieudothuyvan(props) {
  //const [scrollToIndex, setScrollToIndex] = useState(0);
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    isDate: false,
    data: [],
    hochua: null,
    dataHochua: [],
    dataThuyvan: {},
    chartOptions: null,
    chartDataNgayD: null,
    scrollToIndex: 0,
  });
  const [ref, setRef] = useState(null);
  //const position = useRef(new Animated.ValueXY()).current;
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

  useEffect(() => {
    const onInit = async () => {
      let dataHochua = [];
      await http
        .get(ThuyvanURL.GetThongTinHoChua())
        .then(res => {
          const data = res.data;
          if (data) {
            data.map((item, index) => {
              dataHochua.push({label: item.tenHoChua, value: item.idHochua});
            });
          }
        })
        .catch(error => {});
      fetchData(allState.ngayxem, dataHochua, dataHochua[0].value, 0);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, dataHochua, hochua, scrollToIndex) => {
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
    let data = [];
    let chartDataNgayD = ThuyvanNgayD.chartOptions;
    let chartOptions = Thuyvan.chartOptions;
    let chartData = [];
    let dataThuyvan = {};
    let minMN = 150;
    await http
      .post(ThuyvanURL.GetThongTinThuyVan(), {
        IdHoChua: hochua,
        Ngay: ngayxem,
      })
      .then(res => {
        const dataTV = res.data[0];
        if (dataTV) {
          dataThuyvan = dataTV;
        }
      })
      .catch(err => {});
    const idNmay = findNhamay(hochua);
    await http
      .post(ThuyvanURL.GetDataBieuDoThuyVan(), {
        IdNhaMay: idNmay,
      })
      .then(async res => {
        data = res.data;
        //console.log('GetDataBieuDoThuyVan', data);
        if (data) {
          let mma0 = {name: 'Giới hạn A0', data: []};
          let mnqt1 = {name: 'Giới hạn trên', data: []};
          let mnqt2 = {name: 'Giới hạn dưới', data: []};
          let mnbct = {name: 'Bộ Công Thương', data: []};
          let mnct = {name: 'Mực nước chết', data: []};
          let mnvh = {name: 'Thực tế (đầu ngày)', data: []};
          let mnls = {name: 'Năm trước', data: []};
          //let chuky = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          data.map((item, index) => {
            const time = new Date(item.thoiGian);
            const nDate = addDays(time, 1);
            const intTime = Date.parse(nDate);
            mma0.data.push([intTime, item.mucNuocGioiHanA0]);
            mnqt1.data.push([intTime, item.mucNuocQuyTrinhLenHoTren]);
            mnqt2.data.push([intTime, item.mucNuocQuyTrinhLenHoDuoi]);
            mnbct.data.push([intTime, item.mucNuocBCT]);
            mnct.data.push([intTime, item.mucNuocChet]);
            mnvh.data.push([intTime, item.mucNuocThucTeVanHanh]);
            mnls.data.push([intTime, item.mucNuocThucTeVanHanh_LichSu]);
            minMN = item.mucNuocChet;
          });
          //console.log('Thực tế (đầu ngày)', mnvh.data);
          //let isTrung = mnvh.data[0][0];
          //console.log('isTrung mnvh', isTrung);
          // mnvh.data.map((a, index)=>{
          //   if(isTrung ===0){
          //     isTrung = a[0]
          //   } else if(isTrung == a[0]){
          //     console.log(a[0]);
          //   }
          //   isTrung = a[0]
          // });
          // add data tochart
          chartData.push(mma0);
          chartData.push(mnqt1);
          chartData.push(mnqt2);
          chartData.push(mnbct);

          chartData.push(mnct);
          chartData.push(mnvh);
          chartData.push(mnls);
          //console.log(chartData);
          //chartOptions.xAxis.categories = chuky;
          chartOptions.yAxis.min = minMN - 5;
          chartOptions.series = chartData;
          chartOptions.series[0].visible = false;
          //console.log('GetDataBieuDoThuyVan:', mnbct);
          chartOptions.series[3].visible = false;
        }
      })
      .catch(err => {});

      await http.post(ThuyvanURL.GetThongTinThuyVanNgayD(),{
        Ngay: format(new Date(), 'dd-MM-yyyy'),
        IdHoChua: hochua,
      }).then(async(res)=>{
        
        let data = res.data;
        //console.log('IdHoChua: '+ hochua, data);
        let minData = 999999;
        let qChayMay = [];
        let qve = [];
        let series = [];
        data.map((item, index) => {
          if (minData > item.qve) {
            minData = item.qve;
          }
          const d = new Date(item.thoiGian);
          if (Platform.OS === 'ios') {
            d.setHours(d.getHours() + 7);
          }
          const iNode1 = [d.getTime(), item.qChayMay];
          const iNode2 = [d.getTime(), item.qve];
          qChayMay.push(iNode1);
          qve.push(iNode2);
        });
        series.push({ 
          name: 'Q Về (m³/s)',
          data: qve
        });
        series.push({ 
          name: 'Mực nước hồ (m)',
          yAxis: 1,
          data: qChayMay
        });
        chartDataNgayD.yAxis.min = minData - 10;
        chartDataNgayD.series = series;
        
      }).catch(err => {
        series.push({ 
          name: 'Q Về (m³/s)',
          data: []
        });
        series.push({ 
          name: 'Mực nước hồ (m)',
          data: []
        });
        chartDataNgayD.series = series;
      });


    setAllState({
      ...allState,
      data,
      ngayxem,
      loading: false,
      isDate: false,
      hochua,
      dataHochua,
      dataThuyvan,
      chartOptions,
      chartDataNgayD,
      scrollToIndex,
    });
    if (ref && scrollToIndex !== -1) {
      ref.scrollTo({
        x: (width / 6) * scrollToIndex,
        y: 0,
        animated: true,
      });
    }
  };

  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    let ngayxem = format(date, 'dd-MM-yyyy');
    fetchData(
      ngayxem,
      allState.dataHochua,
      allState.hochua,
      allState.scrollToIndex,
    );
  };

  const changeHochua = hochua => {
    //setAllState({...allState, hochua});
    const index = allState.dataHochua.findIndex(item => item.value === hochua);
    fetchData(allState.ngayxem, allState.dataHochua, hochua, index);
    //console.log(a);
  };

  const onSwipeLeft = (gestureState, dataHochua, hochua) => {
    let index = dataHochua.findIndex(item => item.value === hochua);
    let next = null;
    if (index < allState.dataHochua.length - 1) {
      index = index + 1;
      next = dataHochua[index];
    } else {
      index = 0;
      next = dataHochua[0];
    }
    //setAllState({...allState, hochua: next.value});
    if (next) {
      fetchData(allState.ngayxem, dataHochua, next.value, index);
    }
  };

  const onSwipeRight = (gestureState, dataHochua, hochua) => {
    let index = dataHochua.findIndex(item => item.value === hochua);
    let next = null;
    if (index > 0) {
      index = index - 1;
      next = dataHochua[index];
    } else {
      index = dataHochua.length - 1;
      next = dataHochua[index];
    }
    //setAllState({...allState, hochua: next.value});
    if (next) {
      fetchData(allState.ngayxem, allState.dataHochua, next.value, index);
    }
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          let x = gestureState.dx;
          let y = gestureState.dy;
          if (Math.abs(x) > Math.abs(y)) {
            if (x >= 0) {
              const listHo = allState.dataHochua;
              const idCurrent = allState.hochua;
              onSwipeRight(gestureState, listHo, idCurrent);
              //console.log('onPanResponderRelease x right:');
            } else {
              const listHo = allState.dataHochua;
              const idCurrent = allState.hochua;
              onSwipeLeft(gestureState, listHo, idCurrent);
              //console.log('onPanResponderRelease x left:');
            }
          } else {
            // if (y >= 0) {
            //   this.props.onSwipePerformed('down');
            // } else {
            //   this.props.onSwipePerformed('up');
            // }
          }
        },
      }),
    [allState],
  );

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
        {allState.loading ? (
          <LoadingView />
        ) : (
          // <SwipeGesture
          // gestureStyle={styles.container}
          // onSwipePerformed={onSwipePerformed}>

          <Animated.ScrollView
            style={{flex: 1, paddingBottom: 8}}
            {...panResponder.panHandlers}>
            <View style={{flex: 1, paddingTop: 8, paddingBottom: 8}}>
              <HighchartsReactNative
                styles={styles.highchar}
                options={allState.chartOptions}
              />
            </View>
            <View>
            <View style={{flex: 1, marginLeft: 8, marginHorizontal: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>(m³/s)</Text>
              <Text>(m)</Text>
            </View>
            <HighchartsReactNative
                styles={styles.highchar}
                options={allState.chartDataNgayD}
              />
            </View>
            <View style={styles.boxMucnuoc}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>MN Giới hạn A0</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: COLOR.GREEN}]}>
                    {allState.dataThuyvan.mucNuocGioiHanA0} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>MN Quy trình liên hồ trên</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#F7A000'}]}>
                    {allState.dataThuyvan.mucNuocQuyTrinhLenHoTren} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>MN Quy trình liên hồ dưới</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: COLOR.RED_S}]}>
                    {allState.dataThuyvan.mucNuocQuyTrinhLenHoDuoi} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Mực nước BCT</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#A72CA9'}]}>
                    {allState.dataThuyvan.mucNuocBCT} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Mực nước chết</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={styles.textVal}>
                    {allState.dataThuyvan.mucNuocChet} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>MN Dâng bình thường</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={styles.textVal}>
                    {allState.dataThuyvan.mucNuocDangBinhThuong} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>
                    MN Thực tế vận hành (đầu ngày)
                  </Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#3F0060'}]}>
                    {allState.dataThuyvan.mucNuocThucTeVanHanh} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>
                    MN Thực tế vận hành năm trước
                  </Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#9754A4'}]}>
                    {allState.dataThuyvan.mucNuocThucTeVanHanh_LichSu} m
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Lưu lượng nước về</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#9754A4'}]}>
                    {allState.dataThuyvan.luuLuongNuocVe} m³/s
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Lưu lượng nước về ngày hiện tại</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#9754A4'}]}>
                    {allState.dataThuyvan.luuLuongNuocVeNgayD} m³/s
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Tần suất</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#9754A4'}]}>
                    {allState.dataThuyvan.tanSuat} %
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Dung tích hữu ích</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#072468'}]}>
                    {allState.dataThuyvan.dungTichHuuIch?.toFixed(1)} tr.m³
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.colChuky}>
                  <Text style={styles.textHead}>Sản lượng hữu ích</Text>
                </View>
                <View style={styles.colGiatri}>
                  <Text style={[styles.textVal, {color: '#5BA08E'}]}>
                    {allState.dataThuyvan.sanLuongHuuIch?.toFixed(1)} tr.kWh
                  </Text>
                </View>
              </View>
            </View>
          </Animated.ScrollView>
          // </SwipeGesture>
        )}
        <DateTimePickerModal
          headerTextIOS="Chọn tháng năm"
          isVisible={allState.isDate}
          mode="date"
          isDarkModeEnabled={isDark}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </SafeAreaView>
  );
}

const pickerStyle = {
  inputIOS: {
    color: '#FFF',
    paddingHorizontal: 10,
    width: 200,
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: '#000074',
    height: 30,
  },
  inputIOSContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputAndroid: {
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: 'red',
    width: 200,
    borderRadius: 25,
    backgroundColor: '#000074',
    height: 30,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
