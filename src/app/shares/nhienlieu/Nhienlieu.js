import { format, subDays } from 'date-fns';
import { FlatList } from 'native-base';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Appearance, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLOR } from '../../../env/config';
import { ListEmpty, LoadingView, Separator } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import { Appstyles } from '../../styles/AppStyle';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { numberFormat } from '../../../util/format';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function Nhienlieu({navigation}) {
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: subDays(new Date(),1),
    isDate: false,
    dataDau: [],
    dataThan: [],
    listNhamay: [],
    idNhamay: null,
    dataView: null,
    maNhaMay: null
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setAllState({...allState, isDate: true})}>
          <Icon name={'calendar-alt'} color={'#000'} size={20} type="light" containerStyle={{ paddingRight: 16 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Nhiên liệu</Text>
          <Text style={{ color: '#000', fontSize: 12}}>Ngày: {format(allState.ngayxem, 'dd-MM-yyyy')}</Text>
        </View>
      )
    });

  }, [navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      fetchData(allState.ngayxem, false);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, update) => {
    let dataDau = [];
    let dataThan = [];
    let listNhamay = [];
    let idNhamay = null;
    let dataView = null;
    let maNhaMay = null;
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });
    await http
    .get(SanluongURL.GetDanhSachThongTinNhaMay())
    .then(res => {
      const data = res.data;
      data.map((item, index) => {
        if (item.idLoaiNhaMay === 2) {
          listNhamay.push(item);
          if (idNhamay === null) {
            idNhamay = item.idNhaMay;
            maNhaMay = item.pmisGuid
          }
        }
      });
    })
    .catch(err => {
      console.log('errerrerrerrerrerr:', err);
    });

    const data = {
      MaNhaMay: maNhaMay,
      Ngay: format(ngayxem, 'dd-MM-yyyy')
    };
    await http.post(TtdURL.GetThongTinNhienLieuNgayTheoNhaMay(), data).then((res)=>{
      dataView = res.data;
      dataView.thanTonCuoiKy = (dataView.thanTonDauKy + dataView.thanBocTrongNgay) - dataView.thanTieuThu;
    }).catch((error)=>{

    });

    setAllState({
      ...allState,
      loading: false,
      ngayxem,
      dataDau,
      dataThan,
      isDate: false,
      listNhamay,
      idNhamay,
      dataView,
      maNhaMay
    });
  };

  const loadData = async (idNhamay, maNhaMay, ngayxem)=>{
    let dataView = {};
    const data = {
      MaNhaMay: maNhaMay,
      Ngay: format(allState.ngayxem, 'dd-MM-yyyy')
    };
    await http.post(TtdURL.GetThongTinNhienLieuNgayTheoNhaMay(), data).then((res)=>{
      dataView = res.data;
      dataView.thanTonCuoiKy = (dataView.thanTonDauKy + dataView.thanBocTrongNgay) - dataView.thanTieuThu;
    }).catch((error)=>{

    });
    setAllState({...allState,loading: false, dataView, maNhaMay,ngayxem , idNhamay, isDate: false});
  }

  const hideDatePicker = () => {
    setAllState({...allState, loading: false, isDate: false});
  };

  const handleConfirm = date => {
    setAllState({...allState, loading: true, isDate: false});
    loadData(allState.idNhamay,allState.maNhaMay, date);
  };
  const onChangeNhamay = async (item)=>{
    setAllState({...allState, loading: true, idNhamay: item.idNhaMay});
    loadData(item.idNhaMay,item.pmisGuid, allState.ngayxem);
  }


  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={{flex: 1}}>
          <View style={styles.khoiItem}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <View style={styles.khoiItem}>
                    {
                      allState.listNhamay.map((item, index) => (
                        <View key={item.idNhamay} style={styles.selectedNM}>
                          <TouchableOpacity onPress={() => onChangeNhamay(item)}>
                            <Text style={allState.idNhamay === item.idNhaMay ? styles.item_time_focus : styles.item_time}>{item.ten}</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    }
                  </View>
                </ScrollView>
              </View>
          {allState.loading ? (
            <LoadingView />
          ) : (
            <View style={{flex: 1}}>
              <Text style={{padding: 8}}>Nhiên liệu dầu</Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 8, marginRight: 8, marginBottom: 16}}>
                  <View style={{flex: 1, marginRight: 4, borderRadius: 8, backgroundColor: '#f2f1f6', padding: 8}}>
                    <Text style={{textAlign: 'left', fontSize: 13}}>Dầu DO</Text>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Tiêu thụ</Text>
                      <Text style={{textAlign: 'right', fontSize: 12, color: '#545456'}}>Tồn kho</Text>
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#fd4b11'}}>{numberFormat(allState.dataView.dauTieuThuDO)}</Text>
                        </View>
                        <View style={{width: 20,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tấn</Text>
                        </View>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(allState.dataView.dauDOTon)}</Text>
                        </View>
                        <View style={{width: 20,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tấn</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{flex: 1, marginLeft: 4, borderRadius: 8, backgroundColor: '#f2f1f6', padding: 8}}>
                    <Text style={{textAlign: 'left', fontSize: 13}}>Dầu FO</Text>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Tiêu thụ</Text>
                      <Text style={{textAlign: 'right', fontSize: 12, color: '#545456'}}>Tồn kho</Text>
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#fd4b11'}}>{numberFormat(allState.dataView.dauTieuThuFO)}</Text>
                        </View>
                        <View style={{width: 20,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tấn</Text>
                        </View>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(allState.dataView.dauFOTon)}</Text>
                        </View>
                        <View style={{width: 20,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tấn</Text>
                        </View>
                      </View>
                    </View>
                  </View>
              </View>

              <Text style={{padding: 8}}>Nhiên liệu than</Text>

              <View style={{marginLeft: 8, marginRight:8, backgroundColor: '#f2f1f6', borderRadius: 8, marginBottom: 16}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8}}>
                  <View style={{flex: 1}}><Text style={{padding: 8}}>Tồn đầu kỳ</Text></View>
                  <View style={{flex: 1}}><Text style={{paddingTop: 8, paddingBottom: 8, textAlign: 'right', color: '#4a83ce'}}>{numberFormat(allState.dataView.thanTonDauKy)}</Text></View>
                  <View style={{width: 60}}>
                  <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', paddingTop: 12, marginRight: 16}}>tấn</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8}}>
                  <View style={{flex: 1}}><Text style={{padding: 8}}>Bốc trong ngày</Text></View>
                  <View style={{flex: 1}}><Text style={{paddingTop: 8, paddingBottom: 8, textAlign: 'right', color: '#4a83ce'}}>{numberFormat(allState.dataView.thanBocTrongNgay)}</Text></View>
                  <View style={{width: 60}}>
                  <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', paddingTop: 12, marginRight: 16}}>tấn</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8}}>
                  <View style={{flex: 1}}><Text style={{padding: 8}}>Tiêu thụ trong ngày</Text></View>
                  <View style={{flex: 1}}><Text style={{paddingTop: 8, paddingBottom: 8, textAlign: 'right', color: '#4a83ce'}}>{numberFormat(allState.dataView.thanTieuThu)}</Text></View>
                  <View style={{width: 60}}>
                  <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', paddingTop: 12, marginRight: 16}}>tấn</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 16}}>
                  <View style={{flex: 1}}><Text style={{padding: 8}}>Tồn cuối ngày</Text></View>
                  <View style={{flex: 1}}><Text style={{paddingTop: 8, paddingBottom: 8, textAlign: 'right', color: '#4a83ce'}}>{numberFormat(allState.dataView.thanTonCuoiKy)}</Text></View>
                  <View style={{width: 60}}>
                  <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', paddingTop: 12, marginRight: 16}}>tấn</Text>
                  </View>
                </View>
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
  },
  selectedNM: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f2f1f6',
    justifyContent: 'space-between',
    padding: 2,
  },
  item_time: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#545456'
  },
  item_time_focus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    fontWeight: 'bold',
    color: '#000'
  },
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  txtHead: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 12,
  },
  txtValue: {
    textAlign: 'right',
    color: '#000',
    fontSize: 12,
  },
});


// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// const todoList = [
//   { id: '1', text: 'Learn JavaScript' },
//   { id: '2', text: 'Learn React' },
//   { id: '3', text: 'Learn TypeScript' },
// ];
// const Separator = () => <View style={styles.itemSeparator} />;
// const LeftSwipeActions = () => {
//   return (
//     <View
//       style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
//     >
//       <Text
//         style={{
//           color: '#40394a',
//           paddingHorizontal: 10,
//           fontWeight: '600',
//           paddingHorizontal: 30,
//           paddingVertical: 20,
//         }}
//       >
//         Bookmark
//       </Text>
//     </View>
//   );
// };
// const rightSwipeActions = () => {
//   return (
//     <View
//       style={{
//         backgroundColor: '#ff8303',
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//       }}
//     >
//       <Text
//         style={{
//           color: '#1b1a17',
//           paddingHorizontal: 10,
//           fontWeight: '600',
//           paddingHorizontal: 30,
//           paddingVertical: 20,
//         }}
//       >
//         Delete
//       </Text>
//     </View>
//   );
// };
// const swipeFromLeftOpen = () => {
//   alert('Swipe from left');
// };
// const swipeFromRightOpen = () => {
//   alert('Swipe from right');
// };
// const ListItem = ({ text }) => (
//   <Swipeable
//     renderLeftActions={LeftSwipeActions}
//     renderRightActions={rightSwipeActions}
//     onSwipeableRightOpen={swipeFromRightOpen}
//     onSwipeableLeftOpen={swipeFromLeftOpen}
//   >
//     <View
//       style={{
//         paddingHorizontal: 30,
//         paddingVertical: 20,
//         backgroundColor: 'white',
//       }}
//     >
//       <Text style={{ fontSize: 24 }} style={{ fontSize: 20 }}>
//         {text}
//       </Text>
//     </View>
//   </Swipeable>
// );
// export function Nhienlieu({navigation}) {
//   return (
//     <>
//       <StatusBar />
//       <SafeAreaView style={styles.container}>
//         <Text style={{ textAlign: 'center', marginVertical: 20 }}>
//           Swipe right or left
//         </Text>
//         <FlatList
//           data={todoList}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => <ListItem {...item} />}
//           ItemSeparatorComponent={() => <Separator />}
//         />
//       </SafeAreaView>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   itemSeparator: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#444',
//   },
// });
