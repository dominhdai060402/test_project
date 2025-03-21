import HighchartsReactNative from '@highcharts/highcharts-react-native';
import {format, subDays} from 'date-fns';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,Dimensions
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {Appstyles} from '../../styles/AppStyle';
import {chartOptions} from './opChart';
import { numberFormat } from '../../../util/format';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
const listNhamay = [
  {id: 'HSKD', name: 'Hệ số khả dụng'},
  {id: 'SHTN', name: 'Suất hao nhiệt tinh'},
  {id: 'TLDM', name: 'Tỷ lệ dừng máy'},
  {id: 'TDND', name: 'Tỷ lệ điện tự dùng nhiệt điện'},
  {id: 'TDTD', name: 'Tỷ lệ điện tự dùng thuỷ điện'},
];
const width = Dimensions.get('window').width;
export function CTKTKythuat(props) {
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    date: subDays(new Date(), 1),
    isDate: false,
    optDientudung: {},
    optDientudungTD: {},
    optSuathaonhiet: {},
    optHesokhadung: {},
    optTyledungmay: {},
    idLoai: 'HSKD',
    dataAll: null,
    scrollToIndex: 0,
  });
  const [ref, setRef] = useState(null);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
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
            Chỉ tiêu kinh tế kỹ thuật
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
      fetchData(allState.ngayxem, allState.date);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, date) => {
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
    let dataAll = null;
    const year = date.getFullYear();
    let optDientudung = chartOptions.optDientudung;
    let optDientudungTD = chartOptions.optDientudungTD;
    let optSuathaonhiet = chartOptions.optSuathaonhiet;
    let optHesokhadung = chartOptions.optHesokhadung;
    let optTyledungmay = chartOptions.optTyledungmay;

    await http
      .post(TtdURL.GetThongTinChiTieuKinhTeKyThuat(), {
        ngay: ngayxem,
      })
      .then(res => {
        dataAll = res.data;
        //console.log('GetThongTinChiTieuKinhTeKyThuat: ', dataAll);
      })
      .catch((err)=>{});


    // await http
    //   .post(TtdURL.GetChiTieuKinhTeKyThuat(), {
    //     ngay: ngayxem,
    //   })
    //   .then(res => {
        //const dataTV = res.data;
        let categories = [];
        let categoriesND = [];
        let khDientudung = [];
        let thDientudung = [];
        let ngDientudung = [];

        let categoriesTD = [];
        let khDientudungTD = [];
        let thDientudungTD = [];
        let ngDientudungTD = [];

        let khHaonhiet = [];
        let thHaonhiet = [];
        let ngHaonhiet = [];

        let khHesokhadung = [];
        let thHesokhadung = [];

        let khTyledungmay = [];
        let thTyledungmay = [];
        //console.log('dataTV: ', dataTV);
        if (dataAll.chiTieuKinhTeKyThuatModels) {
          //console.log(dataTV);
          dataAll.chiTieuKinhTeKyThuatModels.map((item, index) => {
            categories.push(item.tenNhaMay);
            if (item.idLoaiNhaMay === 1) {
              categoriesTD.push(item.tenNhaMay);
              khDientudungTD.push(item.tyLeDienTuDung.keHoach);
              thDientudungTD.push(item.tyLeDienTuDung.thucHien);
              ngDientudungTD.push(item.tyLeDienTuDung.giaTriNgay);
            } else {
              categoriesND.push(item.tenNhaMay);
              khDientudung.push(item.tyLeDienTuDung.keHoach);
              thDientudung.push(item.tyLeDienTuDung.thucHien);
              ngDientudung.push(item.tyLeDienTuDung.giaTriNgay);
            }

            if (item.idLoaiNhaMay === 2) {
              khHaonhiet.push(item.suatTieuHaoNhietToMayNhietDien.keHoach);
              thHaonhiet.push(item.suatTieuHaoNhietToMayNhietDien.thucHien);
              ngHaonhiet.push(item.suatTieuHaoNhietToMayNhietDien.giaTriNgay);
            }
            khHesokhadung.push(item.heSoKhaDung.keHoach);
            thHesokhadung.push(item.heSoKhaDung.thucHien);

            khTyledungmay.push(item.tyLeNgungMaySCBD.keHoach);
            thTyledungmay.push(item.tyLeNgungMaySCBD.thucHien);
          });
        }
        optDientudung.series[0].data = khDientudung;
        optDientudung.series[1].data = thDientudung;
        optDientudung.series[2].data = ngDientudung;
        optDientudung.xAxis.categories = categoriesND;
        //optDientudung.title.text = `Tỷ lệ điện tự dùng nhiệt điện,%`;

        optDientudungTD.series[0].data = khDientudungTD;
        optDientudungTD.series[1].data = thDientudungTD;
        optDientudungTD.series[2].data = ngDientudungTD;
        optDientudungTD.xAxis.categories = categoriesTD;
        //optDientudungTD.title.text = `Tỷ lệ điện tự dùng thuỷ điện,%`;

        optSuathaonhiet.series[0].data = khHaonhiet;
        optSuathaonhiet.series[1].data = thHaonhiet;
        optSuathaonhiet.series[2].data = ngHaonhiet;
        optSuathaonhiet.xAxis.categories = categoriesND;
        //optSuathaonhiet.title.text = `Suất hao nhiệt tinh, kJ/kWh`;

        optHesokhadung.series[0].data = khHesokhadung;
        optHesokhadung.series[1].data = thHesokhadung;
        optHesokhadung.xAxis.categories = categories;
        //optHesokhadung.title.text = `Hệ số khả dụng`;

        optTyledungmay.series[0].data = khTyledungmay;
        optTyledungmay.series[1].data = thTyledungmay;
        optTyledungmay.xAxis.categories = categories;
        //optTyledungmay.title.text = `Tỷ lệ dừng máy SCBD`;
      // })
      // .catch(err => {
      //   console.log('err: ', err);
      // });

    setAllState({
      ...allState,
      loading: false,
      ngayxem,
      date,
      isDate: false,
      optDientudung,
      optDientudungTD,
      optSuathaonhiet,
      optHesokhadung,
      optTyledungmay,
      dataAll
    });
  };

  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    const sDate = format(date, 'dd-MM-yyyy');
    if (sDate !== allState.ngayxem) {
      fetchData(sDate, date);
    }
  };

  const chonLoai = async item => {
   
    setAllState({...allState, idLoai: item.id});
    // const current = listNhamay.find(
    //   item => item.id === allState.idLoai,
    // );
    // let scrollToIndex = listNhamay.indexOf(current);
    // if (ref && scrollToIndex !== -1) {
    //   ref.scrollTo({
    //     x: (width / 4) * scrollToIndex,
    //     y: 0,
    //     animated: true,
    //   });
    // }
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={styles.khoiItem}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={ref => {
              setRef(ref);
            }}>
            <View style={styles.khoiItem}>
              {listNhamay.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => chonLoai(item)}>
                  <Text
                    style={
                      allState.idLoai === item.id
                        ? styles.item_time_focus
                        : styles.item_time
                    }>
                    {item.name}
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
            <ScrollView style={{flex: 1, paddingBottom: 8}}>

              {allState.idLoai === 'HSKD' && (
              <View style={{flex: 1}}>
              <View style={{backgroundColor: '#f2f1f6', padding: 8, borderRadius: 8, marginTop: 16, marginRight:8, marginLeft: 8, marginBottom: 16}}>
                <Text style={{fontWeight: 'bold'}}>Genco1</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#778187', textAlign: 'left'}}>Kế hoạch</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#778187', textAlign: 'left'}}>Thực hiện</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#fd4b11', textAlign: 'left'}}>{numberFormat(allState.dataAll.heSoKhaDungGenco1KeHoach)}</Text>
                    <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#407ccc', textAlign: 'left'}}>{numberFormat(allState.dataAll.heSoKhaDungGenco1ThucHien)}</Text>
                    <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, paddingBottom: 8}}>
                <HighchartsReactNative
                  styles={styles.highchar1}
                  options={allState.optHesokhadung}
                />
              </View>
              </View>
              )}

              {allState.idLoai === 'SHTN' && (
              <View style={{flex: 1}}>
              <View style={{backgroundColor: '#f2f1f6', padding: 8, borderRadius: 8, marginTop: 16, marginRight:8, marginLeft: 8, marginBottom: 16}}>
                <Text style={{fontWeight: 'bold'}}>Genco1</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                  {/* <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'left'}}>PPA</Text>
                  </View> */}
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'center'}}>Năm</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'right'}}>Ngày</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                {/* <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#fd4b11', textAlign: 'left', fontWeight: 'bold'}}></Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}>kJ/kWh</Text>
                </View> */}
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#407ccc', textAlign: 'center', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.suatHaoNhietTinhGenco1Nam)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> kJ/kWh</Text>
                </View>  
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#7879f1', textAlign: 'right', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.suatHaoNhietTinhGenco1Ngay)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> kJ/kWh</Text>
                </View>  
                </View>
              </View>
              <View style={{flex: 1, paddingBottom: 8}}>
                <HighchartsReactNative
                  styles={styles.highchar1}
                  options={allState.optSuathaonhiet}
                />
              </View>
              </View>
              )}

              {allState.idLoai === 'TLDM' && (
              <View style={{flex: 1}}>
              <View style={{backgroundColor: '#f2f1f6', padding: 8, borderRadius: 8, marginTop: 16, marginRight:8, marginLeft: 8, marginBottom: 16}}>
                <Text style={{fontWeight: 'bold'}}>Genco1</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#778187', textAlign: 'left'}}>Kế hoạch</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#778187', textAlign: 'left'}}>Thực hiện</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#fd4b11', textAlign: 'left'}}>{numberFormat(allState.dataAll.tiLeDungMaySCBDGenco1KeHoach)} </Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#407ccc', textAlign: 'left'}}>{numberFormat(allState.dataAll.tiLeDungMaySCBDGenco1ThucHien)} </Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, paddingBottom: 8}}>
                <HighchartsReactNative
                  styles={styles.highchar1}
                  options={allState.optTyledungmay}
                />
              </View>
              </View>
              )}

              {allState.idLoai === 'TDND' && (
              <View style={{flex: 1}}>
              <View style={{backgroundColor: '#f2f1f6', padding: 8, borderRadius: 8, marginTop: 16, marginRight:8, marginLeft: 8, marginBottom: 16}}>
                <Text style={{fontWeight: 'bold'}}>Genco1</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'left'}}>PPA</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'left'}}>Năm</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'left'}}>Ngày</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#fd4b11', textAlign: 'left', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungNhietDienGenco1PPA)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#407ccc', textAlign: 'left', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungNhietDienGenco1Nam)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>  
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#7879f1', textAlign: 'left', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungNhietDienGenco1Ngay)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>  
                </View>
              </View>
              <View style={{flex: 1, paddingBottom: 8}}>
                <HighchartsReactNative
                  styles={styles.highchar}
                  options={allState.optDientudung}
                />
              </View>
              </View>
              )}


              {allState.idLoai === 'TDTD' && (
              <View style={{flex: 1}}>
             

              <View style={{backgroundColor: '#f2f1f6', padding: 8, borderRadius: 8, marginTop: 16, marginRight:8, marginLeft: 8, marginBottom: 16}}>
                <Text style={{fontWeight: 'bold'}}>Genco1</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'left'}}>PPA</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'center'}}>Năm</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#778187', textAlign: 'right'}}>Ngày</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#fd4b11', textAlign: 'left', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungThuyDienGenco1PPA)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#407ccc', textAlign: 'center', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungThuyDienGenco1Nam)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>  
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{color: '#7879f1', textAlign: 'right', fontWeight: 'bold'}}>{numberFormat(allState.dataAll.tiLeDienTuDungThuyDienGenco1Ngay)}</Text>
                  <Text style={{color: '#6c777d', fontSize: 10, marginTop: 4}}> %</Text>
                </View>  
                </View>
              </View>
              <View style={{flex: 1, paddingBottom: 8}}>
                <HighchartsReactNative
                  styles={styles.highchar}
                  options={allState.optDientudungTD}
                />
              </View>
              </View>
              )}
            </ScrollView>
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
    alignItems: 'center'
  },
  item_time: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#545456',
  },
  item_time_focus: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    paddingRight: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  highchar: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
    height: 450,
  },
  highchar1: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
    height: 450,
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
