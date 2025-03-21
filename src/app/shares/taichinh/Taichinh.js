import _ from 'lodash';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import {format, parse, subDays} from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-fontawesome-pro';
import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
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
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {Appstyles} from '../../styles/AppStyle';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { numberFormat2 } from '../../../util/format';
import { ChartOptions, ChartG1 } from './chartOptionsCP';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
const width = Dimensions.get('window').width;
let listNhamay = [
  {idLoaiHinh: 2, idDonVi: 0, tenNhaMay: 'Genco1'},
];

  
export function Taichinh({navigation}) {
  
  const [allState, setAllState] = useState({
    loading: true,
    isData: true,
    dataGen1: [],
    dataNhamay: [],
    message: '',
    ngayxem: format(new Date(), 'dd-MM-yyyy'),
    isDate: false,
    idLoai: 0,
    timeFocus: 'M',
    scrollToIndex: 0,
    optionsPieG1: null,
    optionsPieDTNM: null,
    optionsPieCPG1: null,
    idLoaiHinh: 0,
  });
  const [ref, setRef] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
            Tài chính
          </Text>
          <Text style={{color: '#000', fontSize: 11}}>
            Ngày: {allState.ngayxem}
          </Text>
        </View>
      ),
    });
  }, [navigation, allState]);

  useEffect(() => {
    const onInit = async () => {

      // await http
      // .get(SanluongURL.GetDanhSachThongTinNhaMay())
      // .then(res => {
      //   const data = res.data;
      //   const nItems = _.orderBy(data, ['idLoaiHinh', 'idDonVi'], ['desc', 'esc']);
      //   let iddonvi = 0;
      //   nItems.map((item, index) => {
      //     if(iddonvi ===0 || iddonvi !== item.idDonVi){
      //       listNhamay.push(item);
      //       iddonvi = item.idDonVi;
      //     }
      //   });
      // })
      // .catch(err => {
      //   console.log('errerrerrerrerrerr:', err);
      // });
      if(listNhamay.length === 1){
        await http
        .get(TtdURL.GetDanhSachNhaMayTaiChinh())
        .then(res => {
          const data = res.data;
          //console.log('errerrerrerrerrerr:', data);
          data.map((item, index) => { 
            listNhamay.push(item);
          });
          
        })
        .catch(err => {
          console.log('errerrerrerrerrerr:', err);
        });
      }
      fetchData(allState.ngayxem, 1,allState.timeFocus, 0);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, loai, timeFocus, idLoai) => {
    let optionsPieCPG1 = ChartOptions.optionsPieCPG1;
    let optionsPieG1 = ChartG1.demoCol;
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
   let dataGen1 = null;
    await http.post(TtdURL.GetTinhHinhTaiChinh(),{
      Ngay: ngayxem,
      LoaiDuLieu: loai
    }).then((res)=>{
      dataGen1 = res.data;
      //console.log('dataGen1:', dataGen1);
    }).catch((err)=>{
      console.log(err);
    })

    if(dataGen1){
      dataGen1.tyleNL = (dataGen1.chiPhiNhienLieuThucTe/dataGen1.chiPhiNhienLieuKeHoach)*100;

      //SXKD ĐIỆN
      dataGen1.tyleLNSXKDD = dataGen1.loiNhuanSXKDDienThucTe/dataGen1.loiNhuanSXKDDienKeHoach*100;
      if(dataGen1.tyleLNSXKDD > 100) dataGen1.tyleLNSXKDD = 100;
      // TỶ Giá
      dataGen1.tyleTyGia = dataGen1.loiNhuanChenhLechTyGiaThucTe/dataGen1.loiNhuanChenhLechTyGiaKeHoach*100;
      if(dataGen1.tyleTyGia > 100 || dataGen1.loiNhuanChenhLechTyGiaThucTe === 0) dataGen1.tyleTyGia = 100;
      // HĐÔNG TC
      dataGen1.tyleHDTC = dataGen1.loiNhuanHoatDongTaiChinhThucTe/dataGen1.loiNhuanHoatDongTaiChinhKeHoach*100;
      if(dataGen1.tyleHDTC > 100 || dataGen1.loiNhuanHoatDongTaiChinhThucTe === 0) dataGen1.tyleHDTC = 100;

      optionsPieG1.series[0].data[0]= Number(dataGen1.doanhThuThiTruongDien.toFixed(1)); 
      optionsPieG1.series[1].data[0] = Number(dataGen1.doanhThuCFD.toFixed(1));
      optionsPieG1.series[2].data[0] = Number(dataGen1.doanhThuKhac.toFixed(1));

      //console.log('optionsPieG1:', optionsPieG1);
      // Chi phí 
      optionsPieCPG1.series[0].data[0].y = dataGen1.chiPhiBienDoiGenCo;
      optionsPieCPG1.series[0].data[1].y = dataGen1.chiPhiCoDinhGenCo;
    }
    setAllState({
      ...allState,
      loading: false,
      dataGen1,
      ngayxem,
      isDate: false,
      timeFocus,
      optionsPieG1,
      optionsPieCPG1,
      idLoai
    });
  };

  const fetchDataNhamay = async (ngayxem, loai, timeFocus, idNhamay, idLoaiHinh) => {
    //let optionsPieG1 = ChartG1.demoCol;
    let optionsPieDTNM = ChartOptions.optionsPieG1;
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
   let dataNhamay = null;
    await http.post(TtdURL.GetTaiChinhNhaMay(),{
      Ngay: ngayxem,
      IdDonVi: idNhamay,
      LoaiDuLieu: loai
    }).then((res)=>{
      dataNhamay = res.data;
      //console.log('GetTaiChinhNhaMay:', dataNhamay);
    }).catch((err)=>{
      console.log('err', err);
    })
    if(dataNhamay){
      optionsPieDTNM.series[0].data[0].y= Number(dataNhamay.doanhThuThiTruongDien.toFixed(1)); 
      optionsPieDTNM.series[0].data[1].y = Number(dataNhamay.doanhThuCFD.toFixed(1));
      optionsPieDTNM.series[0].data[2].y = Number(dataNhamay.doanhThuKhac.toFixed(1));
    
      //console.log('optionsPieG1:', optionsPieG1);
      //SXKD ĐIỆN
      dataNhamay.tyleLNSXKDD = dataNhamay.loiNhuanSXKDDienThucTe/dataNhamay.loiNhuanSXKDDienKeHoach*100;
      if(dataNhamay.tyleLNSXKDD > 100) dataNhamay.tyleLNSXKDD = 100;
      // TỶ Giá
      dataNhamay.tyleTyGia = dataNhamay.loiNhuanChenhLechTyGiaThucTe/dataNhamay.loiNhuanChenhLechTyGiaKeHoach*100;
      if(dataNhamay.tyleTyGia > 100 || dataNhamay.loiNhuanChenhLechTyGiaThucTe === 0) dataNhamay.tyleTyGia = 100;
      // HĐÔNG TC
      dataNhamay.tyleHDTC = dataNhamay.loiNhuanHoatDongTaiChinhThucTe/dataNhamay.loiNhuanHoatDongTaiChinhKeHoach*100;
      if(dataNhamay.tyleHDTC > 100 || dataNhamay.loiNhuanHoatDongTaiChinhThucTe === 0) dataNhamay.tyleHDTC = 100;

    }

    setAllState({
      ...allState,
      loading: false,
      dataNhamay,
      ngayxem,
      isDate: false,
      timeFocus,
      idLoai: idNhamay,
      optionsPieDTNM,
      idLoaiHinh
    });
  };


  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    const sDate = format(date, 'dd-MM-yyyy');
    let loai = allState.timeFocus === 'D' ? 0 : allState.timeFocus === 'M' ? 1 : 2;
    if (sDate !== allState.ngayxem) {
      fetchData(sDate, loai, allState.timeFocus, allState.idLoai);
    }
  };

  const chonLoai = async (item, scrollToIndex) => {
    scrollToIndex = listNhamay.findIndex(a => a.idDonVi === item.idDonVi);
    setAllState({...allState, idLoai: item.idDonVi, idLoaiHinh: item.idLoaiHinh});
    let loai = allState.timeFocus === 'D' ? 0 : allState.timeFocus === 'M' ? 1 : 2;
    if(item.idDonVi === 0){
      fetchData(allState.ngayxem, loai,allState.timeFocus, 0);
    } else {
      fetchDataNhamay(allState.ngayxem, loai,allState.timeFocus, item.idDonVi, item.idLoaiHinh);
    }
    if (ref && scrollToIndex !== -1) {
      ref.scrollTo({
        x: (width / 6) * scrollToIndex,
        y: 0,
        animated: true,
      });
    }
  };

  const onChangeTimeND = (timeFocus,loai) => {
    setAllState({...allState, timeFocus});
    if(allState.idLoai === 0) {
      fetchData(allState.ngayxem, loai,timeFocus, 0);
    } else {
      fetchDataNhamay(allState.ngayxem, loai,timeFocus, allState.idLoai, allState.idLoaiHinh);
    }
  }

  const onSwipeLeft =(gestureState,  idCurrent)=>{
    let index = listNhamay.findIndex(a => a.idDonVi === idCurrent);
    let next = null;
    if (index < listNhamay.length - 1) {
      index = index + 1;
      next = listNhamay[index];
    } else {
      index = 0;
      next = listNhamay[0];
    }
    chonLoai(next, index);
  }

  const onSwipeRight =(gestureState,  idCurrent)=>{
    let index = listNhamay.findIndex(a => a.idDonVi === idCurrent);
    let next = null;
    if (index > 0) {
      index = index - 1;
      next = listNhamay[index];
    } else {
      index = listNhamay.length - 1;
      next = listNhamay[index];
    }
    chonLoai(next, index);
  }

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          let x = gestureState.dx;
          let y = gestureState.dy;
          if (Math.abs(x) > Math.abs(y)) {
            if (x >= 0) {
              const idCurrent = allState.idLoai;
              onSwipeRight(gestureState,  idCurrent);
            } else {
              const idCurrent = allState.idLoai;
              onSwipeLeft(gestureState,  idCurrent);
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
        <View style={styles.khoiItem}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={ref => {
              setRef(ref);
            }}> 
            <View style={styles.khoiItem}>
              <Icon
                name={'heart-rate'}
                color={'#109618'}
                size={20}
                type="light"
              />
              {listNhamay.map((item, index) => (
                <TouchableOpacity
                  style={{flex: 1}}
                  key={index}
                  onPress={() => chonLoai(item)}>
                  <Text
                    style={
                      allState.idLoai === item.idDonVi
                        ? styles.item_loai_focus
                        : styles.item_loai
                    }>
                    {item.tenNhaMay}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
       
        <View style={{flex: 1}}>
          {allState.loading ? (
            <LoadingView />
          ) : (
            <Animated.ScrollView style={{flex: 1, paddingBottom: 8}} {...panResponder.panHandlers}>
               
      
              {/* Chọn ngày tháng năm */}
              <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, justifyContent: 'space-between', padding: 2 }}>
                  {/* <TouchableOpacity style={allState.timeFocus === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('D',0)}>
                    <Text>Ngày</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity style={allState.timeFocus === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('M',1)}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocus === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('Y',2)}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
                </View>

              
                {/* Doanh thu G1 */}
                {allState.idLoai === 0 ? (
                <View>
                  <View style={{height: 60, flexDirection: 'row', }}>
                    <View style={{flex: 1, backgroundColor: '#F2F1F6', borderRadius: 4, marginLeft: 8, marginRight: 4, padding: 8}}>
                      <Text style={{fontSize: 12}}>Doanh thu</Text>
                      <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
                        <Text style={{color: '#FD4B11', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.tongDoanhThuGenCo)}</Text>
                        <Text style={{fontSize: 10, color: '#677278', marginTop:4}}> tỷ VNĐ</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, backgroundColor: '#F2F1F6', borderRadius: 4, marginLeft: 4, marginRight: 4, padding: 8}}>
                      <Text style={{fontSize: 12}}>Chi phí</Text>
                      <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
                        <Text style={{color: '#FD4B11', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.tongChiPhiGenCo)}</Text>
                        <Text style={{fontSize: 10, color: '#677278', marginTop:4}}> tỷ VNĐ</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, backgroundColor: '#F2F1F6', borderRadius: 4, marginLeft: 4, marginRight: 8, padding: 8}}>
                      <Text style={{fontSize: 12}}>Lợi nhuận</Text>
                      <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
                        <Text style={{color: '#FD4B11', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.tongLoiNhuan)}</Text>
                        <Text style={{fontSize: 10, color: '#677278', marginTop:4}}> tỷ VNĐ</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{padding:8}}>
                    <Text style={{fontWeight: 'bold'}}>Doanh thu</Text>
                    <View style={{backgroundColor: '#f2f1f6', borderRadius: 8, marginTop: 8}}>
                      <View style={{height: 150, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <View style={{flex: 3}}>
                          <HighchartsReactNative
                          styles={styles.highcharG1}
                          options={allState.optionsPieG1}
                          />
                        </View>
                         
                        <View style={{flex: 6, justifyContent: 'center'}}>
                          <View style={{marginTop: 8}}>
                            <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Tổng</Text>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongDoanhThuGenCo)}</Text>
                            <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                          </View>
                        </View>
                          <View style={{flexDirection: 'row', padding: 8, paddingTop: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width:12, height: 12, borderRadius: 50, backgroundColor: '#3596C1'}}></View>
                            <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between', marginLeft: 8}}>
                              <Text style={{fontSize: 12, marginTop: 2}}>Thị trường điện </Text>
                              <Text style={{ color: '#7879f1', fontWeight: 'bold', textAlign: 'right'}}>{numberFormat2(allState.dataGen1.doanhThuThiTruongDien)}</Text>
                              <Text style={{color: '#737d83', fontSize: 10, marginTop: 2}}> tỷ VND</Text>
                            </View>
                          </View>
                          <View style={{flexDirection: 'row', padding: 8, paddingTop: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width:12, height: 12, borderRadius: 50, backgroundColor: '#E7683F'}}></View>
                            <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between', marginLeft: 8}}>
                              <Text style={{fontSize: 12, marginTop: 2}}>Doanh thu CFD </Text>
                              <Text style={{ color: '#7879f1', fontWeight: 'bold', textAlign: 'right'}}>{numberFormat2(allState.dataGen1.doanhThuCFD)}</Text>
                              <Text style={{color: '#737d83', fontSize: 10, marginTop: 2}}> tỷ VND</Text>
                            </View>
                          </View>
                          <View style={{flexDirection: 'row', padding: 8, paddingTop: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width:12, height: 12, borderRadius: 50, backgroundColor: '#7F72E1'}}></View>
                            <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between', marginLeft: 8}}>
                              <Text style={{fontSize: 12, marginTop: 2}}>Doanh thu khác </Text>
                              <Text style={{ color: '#7879f1', fontWeight: 'bold', textAlign: 'right'}}>{numberFormat2(allState.dataGen1.doanhThuKhac)}</Text>
                              <Text style={{color: '#737d83', fontSize: 10, marginTop: 2}}> tỷ VND</Text>
                            </View>
                          </View>
                        </View>

                      </View>
                      {/* Doanh thu nhiet dien */}
                      <View style={{marginTop: 12}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Nhiệt điện</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongDoanhThuNhietDien)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                    <View style={{height: 48, flexDirection: 'row', }}>
                      <View style={{flex: 1, backgroundColor: '#3596C1', borderRadius: 4, marginLeft: 8, marginRight: 4, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Thị trường điện</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuThiTruongDienNhietDien)}</Text>
                      </View>
                      <View style={{flex: 1, backgroundColor: '#E7683F', borderRadius: 4, marginLeft: 4, marginRight: 4, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Doanh thu CFD</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuCFDNhietDien)}</Text>
                      </View>
                      <View style={{flex: 1, backgroundColor: '#7F72E1', borderRadius: 4, marginLeft: 4, marginRight: 8, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Doanh thu khác</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuKhacNhietDien)}</Text>
                      </View>
                    </View>

                      {/* doanh thu thuy dien */}
                      <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Thuỷ điện</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongDoanhThuThuyDien)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{height: 48, flexDirection: 'row', marginBottom: 8}}>
                      <View style={{flex: 1, backgroundColor: '#3596C1', borderRadius: 4, marginLeft: 8, marginRight: 4, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Thị trường điện</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuThiTruongDienThuyDien)}</Text>
                      </View>
                      <View style={{flex: 1, backgroundColor: '#E7683F', borderRadius: 4, marginLeft: 4, marginRight: 4, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Doanh thu CFD</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuCFDThuyDien)}</Text>
                      </View>
                      <View style={{flex: 1, backgroundColor: '#7F72E1', borderRadius: 4, marginLeft: 4, marginRight: 8, padding: 8}}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>Doanh thu khác</Text>
                        <Text style={{color: '#FFF', fontWeight: 'bold', textAlign: 'center', marginTop: 4}}>{numberFormat2(allState.dataGen1.doanhThuKhacThuyDien)}</Text>
                      </View>
                    </View>
                    </View>
                  </View>

          

                {/* Chi phi G1 */}
                <View style={{padding:8}}>
                  <Text style={{fontWeight: 'bold'}}>Chi phí</Text>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <View style={{flex: 1, marginRight: 4, backgroundColor:'#f2f1f6', borderRadius: 8, paddingBottom: 8}}>
                      <HighchartsReactNative
                      styles={styles.highchar}
                      options={allState.optionsPieCPG1}
                    />
                      <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Tổng</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongChiPhiGenCo)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', padding: 8}}>
                        <View style={{width: 16, height: 16, marginTop: 2, borderRadius: 50, backgroundColor: '#fb8832'}}></View>
                        <View style={{flexDirection: 'row', paddingTop: 0}}>
                        <Text style={{fontSize: 12, marginTop: 2, paddingLeft: 4}}>Biến đổi </Text>
                        <Text style={{ color: '#7879f1'}}>{numberFormat2(allState.dataGen1.chiPhiBienDoiGenCo)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                      </View>

                      <View style={{flexDirection: 'row', padding: 8}}>
                        <View style={{width: 16, height: 16, marginTop: 2, borderRadius: 50, backgroundColor: '#007aff'}}></View>
                        <View style={{flexDirection: 'row', paddingTop: 0}}>
                        <Text style={{fontSize: 12, marginTop: 2, paddingLeft: 4}}>Cố định </Text>
                        <Text style={{ color: '#7879f1'}}>{numberFormat2(allState.dataGen1.chiPhiCoDinhGenCo)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                      </View>
                    </View>


                    <View style={{flex: 1, marginLeft: 4}}>
                      <View style={{flex: 2, marginRight: 4, backgroundColor:'#f2f1f6', borderRadius: 8, paddingBottom: 12}}>
                        <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Nhiệt điện</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongChiPhiNhietDien)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                          <View style={{padding:4, marginLeft: 8, width: 110, backgroundColor: '#FFF', borderRadius: 8}}>
                            <Text style={{fontSize: 12}}>Biến đổi</Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={{ color: '#7a7bf1'}}>{numberFormat2(allState.dataGen1.chiPhiBienDoiNhienDien)}</Text>
                              <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                            </View>
                          </View>
                          <Icon name="caret-down" size={28} type="solid" color={COLOR.LIGHT_GREY} containerStyle={{marginLeft: 16, marginTop: -10}}/>
                          <View style={{flexDirection: 'row', marginTop: -6, height: 8, backgroundColor: '#d0cce2', borderRadius: 25, marginLeft:8, marginRight: 8}}>
                            <View style={{flex: 3, borderRadius: 25, backgroundColor: '#7f18f9'}}></View>
                            <View style={{flex: 2, borderRadius: 25, backgroundColor: '#4daffa'}}></View>
                          </View>
                          <Icon name="caret-up" size={28} type="solid" color={COLOR.LIGHT_GREY} containerStyle={{marginRight: 16, marginTop: -8, alignSelf: 'flex-end'}}/>
                          <View style={{ marginTop: -8,padding:4, marginRight: 8, width: 110, backgroundColor: '#FFF', borderRadius: 8, alignSelf: 'flex-end'}}>
                            <Text style={{fontSize: 12}}>Cố định</Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={{ color: '#7a7bf1'}}>{numberFormat2(allState.dataGen1.chiPhiCoDinhNhietDien)}</Text>
                              <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                            </View>
                          </View>
                      </View>
                      </View>

                      <View style={{flex: 1, marginRight: 4, backgroundColor:'#f2f1f6', marginTop: 8, borderRadius: 8, paddingBottom: 4}}>
                      <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Thuỷ điện</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataGen1.tongChiPhiThuyDien)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      </View>
                    </View>
                  </View>
                </View>  

                <View style={{margin:8, backgroundColor:'#f2f1f6', borderRadius: 8, padding: 8}}>
                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}></View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>TH</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>KH</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Nhiên liệu</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                        <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.tyleNL}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiNhienLieuThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiNhienLieuKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Vật liệu</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                        <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiVatLieuThucTe/allState.dataGen1.chiPhiVatLieuKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiVatLieuThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiVatLieuKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Lương và bảo hiểm</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiLuongVaBaoHiemThucTe/allState.dataGen1.chiPhiLuongVaBaoHiemKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiLuongVaBaoHiemThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiLuongVaBaoHiemKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Khấu hao TS CĐ</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiKhauHaoTSCDThucTe/allState.dataGen1.chiPhiKhauHaoTSCDKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiKhauHaoTSCDThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiKhauHaoTSCDKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Dịch vụ mua ngoài</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiDichVuMuaNgoaiThucTe/allState.dataGen1.chiPhiDichVuMuaNgoaiKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiDichVuMuaNgoaiThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiDichVuMuaNgoaiKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Sửa chữa lớn</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiSuaChuaLonThucTe/allState.dataGen1.chiPhiSuaChuaLonKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiSuaChuaLonThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiSuaChuaLonKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Chi phí khác</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataGen1.chiPhiKhacThucTe/allState.dataGen1.chiPhiKhacKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiKhacThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataGen1.chiPhiKhacKeHoach)}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Lợi nhuận */}
                <Text style={{fontWeight: 'bold', padding: 8, paddingBottom: 4}}>Lợi nhuận</Text>
                <View style={{margin:8, backgroundColor:'#f2f1f6', borderRadius: 8, padding: 8, paddingBottom: 16}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 4,backgroundColor: '#FFF', borderRadius: 8, marginRight: 4, padding: 8}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Tổng lợi nhuận</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 12}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.tongLoiNhuan)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                    </View>

                    <View style={{flex: 5,backgroundColor: '#FFF', borderRadius: 8, marginLeft: 4}}>
                    <View style={{flex: 1,backgroundColor: '#FFF', borderRadius: 8, marginRight: 4, padding: 8}}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{width: 114}}>
                          <Text style={{fontSize: 12, paddingRight: 4}}>Tổng lợi nhuận trừ chênh lệch tỷ giá</Text>
                        </View>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 4}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.tongLoiNhuanTruChenhLechTyGia)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                    </View>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>SXKD điện</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.loiNhuanSXKDDienThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanSXKDDienThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: `${allState.dataGen1.tyleLNSXKDD}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanSXKDDienKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                      
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Chênh lệch tỷ giá</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.loiNhuanChenhLechTyGiaThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanChenhLechTyGiaThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: `${allState.dataGen1.tyleTyGia}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanChenhLechTyGiaKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Hoạt động tài chính</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataGen1.loiNhuanHoatDongTaiChinhThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanHoatDongTaiChinhThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: `${allState.dataGen1.tyleHDTC}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataGen1.loiNhuanHoatDongTaiChinhKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                ): ( allState.dataNhamay ?(
                    // Theo nha may
                <View>
                <View style={{padding:8}}>
                  <Text style={{fontWeight: 'bold'}}>Doanh thu</Text>
                  <View style={{backgroundColor: '#f2f1f6', flexDirection:'row', borderRadius: 8, marginTop: 8}}>
                    <View style={{flex: 3,paddingTop:8, paddingLeft: 8, paddingBottom: 8}}>
                    <HighchartsReactNative
                      styles={styles.highchar}
                      options={allState.optionsPieDTNM}
                    />
                     
                    </View>
                    <View style={{flex: 5}}>
                      <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Tổng</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataNhamay.tongDoanhThuNhaMay)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', padding: 8, paddingTop: 0}}>
                        <Text style={{fontSize: 12, marginTop: 2}}>Thị trường điện </Text>
                        <Text style={{ color: '#7879f1', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.doanhThuThiTruongDien)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                      <View style={{flexDirection: 'row', padding: 8, paddingTop: 0}}>
                        <Text style={{fontSize: 12, marginTop: 2}}>Doanh thu CFD </Text>
                        <Text style={{ color: '#7879f1', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.doanhThuCFD)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                      <View style={{flexDirection: 'row', padding: 8, paddingTop: 0}}>
                        <Text style={{fontSize: 12, marginTop: 2}}>Doanh thu khác </Text>
                        <Text style={{ color: '#7879f1', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.doanhThuKhac)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>

                      
                    </View>
                  </View>
                </View>

                {/* Chi phi G1 */}
                <View style={{padding:8}}>
                  <Text style={{fontWeight: 'bold'}}>Chi phí</Text>
                  <View style={{backgroundColor: '#f2f1f6', flexDirection:'row', borderRadius: 8, marginTop: 8}}>
                    <View style={{flex: 3,paddingTop:8, paddingLeft: 8, paddingBottom: 8}}>
                      
                      <View style={{marginTop: 8}}>
                        <Text style={{padding: 8, paddingBottom: 0, color: '#48487f'}}>Tổng</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{padding: 8, paddingRight: 0, color: '#fb6a3b', fontWeight: 'bold', fontSize: 16}}>{numberFormat2(allState.dataNhamay.tongChiPhiNhaMay)}</Text>
                          <Text style={{padding: 8, color: '#737d83', fontSize: 10, marginTop: 6, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                    </View>
                    
                    {allState.idLoaiHinh === 2 &&(
                    <View style={{flex: 5, paddingBottom: 8}}>
                      <View style={{flexDirection: 'row', marginTop: 8, marginRight:8, marginLeft: 8,backgroundColor: '#FFF', paddingLeft: 8,paddingTop:2, paddingBottom: 2, borderRadius: 25}}>
                        <Text style={{fontSize: 12, marginTop: 2}}>Biến đổi </Text>
                        <Text style={{ color: '#7879f1', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.chiPhiBienDoiNhaMay)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                      <Icon name="caret-down" size={28} type="solid" color={COLOR.LIGHT_GREY} containerStyle={{marginLeft: 16, marginTop: -10}}/>
                      <View style={{flexDirection: 'row', marginTop: -6, height: 8, backgroundColor: '#d0cce2', borderRadius: 25, marginLeft:8, marginRight: 8}}>
                        <View style={{flex: 1, borderRadius: 25, backgroundColor: '#7f18f9'}}></View>
                        <View style={{flex: 1, borderRadius: 25, backgroundColor: '#4DFFDF'}}></View>
                      </View>
                      <Icon name="caret-up" size={28} type="solid" color={COLOR.LIGHT_GREY} containerStyle={{marginRight: 16, marginTop: -8, alignSelf: 'flex-end'}}/>
                      <View style={{flexDirection: 'row', marginTop: -8, marginRight:8, marginLeft: 8,backgroundColor: '#FFF', paddingLeft: 8,paddingTop:2, paddingBottom: 2, borderRadius: 25}}>
                        <Text style={{fontSize: 12, marginTop: 2}}>Cố định </Text>
                        <Text style={{ color: '#7879f1', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.chiPhiCoDinhNhaMay)}</Text>
                        <Text style={{color: '#737d83', fontSize: 10, marginTop: 4}}> tỷ VND</Text>
                      </View>
                    </View>
                    )}
                  </View>
                </View>

                <View style={{margin:8, backgroundColor:'#f2f1f6', borderRadius: 8, padding: 8}}>
                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}></View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>TH</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>KH</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Nhiên liệu</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                        <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiNhienLieuThucTe/allState.dataNhamay.chiPhiNhienLieuKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiNhienLieuThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiNhienLieuKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Vật liệu</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                        <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiVatLieuThucTe/allState.dataNhamay.chiPhiVatLieuKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiVatLieuThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiVatLieuKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Lương và bảo hiểm</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiLuongVaBaoHiemThucTe/allState.dataNhamay.chiPhiLuongVaBaoHiemKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiLuongVaBaoHiemThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiLuongVaBaoHiemKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Khấu hao TS CĐ</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiKhauHaoTSCDThucTe/allState.dataNhamay.chiPhiKhauHaoTSCDKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiKhauHaoTSCDThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiKhauHaoTSCDKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Dịch vụ mua ngoài</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiDichVuMuaNgoaiThucTe/allState.dataNhamay.chiPhiDichVuMuaNgoaiKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiDichVuMuaNgoaiThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiDichVuMuaNgoaiKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Sửa chữa lớn</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiSuaChuaLonThucTe/allState.dataNhamay.chiPhiSuaChuaLonKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiSuaChuaLonThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiSuaChuaLonKeHoach)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent: 'space-between', paddingTop:8, paddingBottom: 4 }}>
                    <View style={{flex: 1}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>Chi phí khác</Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                      <View style={{height: 8, backgroundColor: '#D0CCE2', borderRadius: 4, marginLeft: 8, marginRight: 8}}>
                      <View style={{height: 8, backgroundColor: '#E7683F', borderRadius: 4, width: `${allState.dataNhamay.chiPhiKhacThucTe/allState.dataNhamay.chiPhiKhacKeHoach*100}%`}}></View>
                      </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiKhacThucTe)}</Text>
                      <Text style={{textAlign: 'right',fontSize: 11}}>{numberFormat2(allState.dataNhamay.chiPhiKhacKeHoach)}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Lợi nhuận */}
                <Text style={{fontWeight: 'bold', padding: 8, paddingBottom: 4}}>Lợi nhuận</Text>
                <View style={{margin:8, backgroundColor:'#f2f1f6', borderRadius: 8, padding: 8, paddingBottom: 16}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 4,backgroundColor: '#FFF', borderRadius: 8, marginRight: 4, padding: 8}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Tổng lợi nhuận</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 12}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.tongLoiNhuanNhaMay)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                    </View>

                    <View style={{flex: 5,backgroundColor: '#FFF', borderRadius: 8, marginLeft: 4}}>
                    <View style={{flex: 1,backgroundColor: '#FFF', borderRadius: 8, marginRight: 4, padding: 8}}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{width: 114}}>
                          <Text style={{fontSize: 12, paddingRight: 4}}>Tổng lợi nhuận trừ chênh lệch tỷ giá</Text>
                        </View>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 4}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.tongLoiNhuanTruChenhLechTyGia)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                    </View>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>SXKD điện</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.loiNhuanSXKDDienThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanSXKDDienThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd',width: `${allState.dataNhamay.tyleLNSXKDD}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanSXKDDienKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                      
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Chênh lệch tỷ giá</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.loiNhuanChenhLechTyGiaThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanChenhLechTyGiaThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: `${allState.dataNhamay.tyleLNSXKDD}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanChenhLechTyGiaKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                      <View style={{flex: 2}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, paddingRight: 4}}>Hoạt động tài chính</Text>
                        {/* <Icon name="caret-up" size={10} type="solid" color={COLOR.DARK_GREEN} iconStyle={{marginTop: 4}}/>
                        <Text style={{fontSize: 10, color: COLOR.DARK_GREEN, marginTop: 2}}>+45,89%</Text> */}
                      </View>
                      <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{color: '#fb6a3b', fontWeight: 'bold'}}>{numberFormat2(allState.dataNhamay.loiNhuanHoatDongTaiChinhThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                      </View>
                      <View style={{flex: 3, marginTop:-6}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Thực tế: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanHoatDongTaiChinhThucTe)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: `${allState.dataNhamay.tyleLNSXKDD}%`}}></View>
                        </View>

                        <View style={{flexDirection: 'row', paddingTop: 8}}>
                          <Text style={{fontSize: 12, color: '#677278'}}>Kế hoạch: </Text>
                          <Text style={{fontSize: 12, color: '#000'}}>{numberFormat2(allState.dataNhamay.loiNhuanHoatDongTaiChinhKeHoach)}</Text>
                          <Text style={{color: '#737d83', fontSize: 10, marginTop: 2, paddingLeft: 2}}>tỷ VND</Text>
                        </View>
                        <View style={{height:4, borderRadius:8, backgroundColor: '#d0cce2'}}>
                          <View style={{height:4, borderRadius:8, backgroundColor: '#4da8fd', width: '100%'}}></View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                ) : (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Không có dữ liệu</Text>
                  </View>)
                )}
            </Animated.ScrollView>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  khoiItem: {
    height: 44,
    backgroundColor: '#f2f1f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8
  },
  item_loai: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#545456',
  },
  item_loai_focus: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    paddingRight: 8,
    fontWeight: 'bold',
    color: '#000',
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
  highcharG1: {
    justifyContent: 'center',
    height: '100%',
    width:'100%',
  },
  highchar: {
    justifyContent: 'center',
    height: 150,
    width:150,
  },
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  vlegendBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
});
