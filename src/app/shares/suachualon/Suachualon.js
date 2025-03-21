import { format } from 'date-fns';
import {
  Actionsheet,
  useDisclose
} from 'native-base';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import { Appstyles } from '../../styles/AppStyle';
import { useFetchAPI } from './HandleEvent';
import {Badge} from 'react-native-elements';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function Suachualon(props) {
  const [allState, setAllState] = useState({
    isDate: false,
    showItem: null,
    ngayxem: format(new Date(), 'yyyy'),
    year: new Date().getFullYear(),
    data: [],
  });
  const {isOpen, onOpen, onClose} = useDisclose();
  const [data, setData] = useState({
    filtered: [],
    loaisc: 'ALL',
    tenloai: '',
  });
  const [months, setMonths] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const fetchData = useFetchAPI(allState.year);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        // onPress={() => setAllState({...allState, isDate: true})}
        <TouchableOpacity>
          <Icon name={'calendar-alt'} color={'#000'} size={20} type="light" containerStyle={{ paddingRight: 16 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Lịch sửa chữa</Text>
          <Text style={{ color: '#000', fontSize: 11}}>Lịch sửa chữa lớn năm {allState.ngayxem}</Text>
        </View>
      )
    });

  }, [props.navigation, allState]);

  useEffect(() => {
    setData({filtered: fetchData.data.slice(), loaisc: 'ALL'});
    return () => {};
  }, [fetchData]);

  const onFilterLoai = loaisc => {
    if (loaisc === data.loaisc) {
      setData({filtered: fetchData.data.slice(), loaisc: 'ALL', tenloai: ''});
    } else {
      const tenloai =
        loaisc === 'SCLDT'
          ? ': Đại tu'
          : loaisc === 'SCLTrT'
          ? ': Trung tu'
          : ': Tiểu tu';
      const filtered = fetchData.data.filter(
        item => item.tomay.loaiBaoDuong === loaisc,
      );
      setData({filtered, loaisc, tenloai});
    }
  };

  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    const ngayxem = format(date, 'yyyy');
    if (ngayxem !== allState.ngayxem) {
      const year = date.getFullYear();
      setAllState({showItem: null, isDate: false, ngayxem, year});
    }
  };

  const onShowItem = async item => {
    setAllState({...allState, showItem: item});
    onOpen();
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={{flex: 1}}>
          {/* <TouchableOpacity
            style={styles.vlegend}
            onPress={() => setAllState({...allState, isDate: true})}>
            <Icon
              name={'file-invoice-dollar'}
              size={20}
              type="light"
              color={COLOR.ORANGE}
              containerStyle={{paddingRight: 8}}
            />
            <Text
              style={{
                textAlign: 'center',
                color: COLOR.RED,
                fontWeight: 'bold',
              }}>
              Lịch sửa chữa lớn {allState.ngayxem}{data.tenloai}
            </Text>
          </TouchableOpacity> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#f2f1f6',
              alignItems: 'center',
              paddingTop:8,
              paddingBottom: 8,
              paddingRight: 16
            }}>
            <TouchableOpacity
              style={styles.typeSuachua}
              onPress={() => onFilterLoai('SCLDT')}>
              <Text style={{color: data.loaisc=='SCLDT' ? '#000' : COLOR.LIGHT_GREY, fontWeight: 'bold'}}>Đại tu</Text>
              <Badge value={fetchData?.lenDaitu} status="error" containerStyle={{ position: 'absolute',top: -2,right:4}}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeSuachua}
              onPress={() => onFilterLoai('SCLTrT')}>
              <Text style={{color: data.loaisc=='SCLTrT' ? '#000' : COLOR.LIGHT_GREY, fontWeight: 'bold'}}>Trung tu</Text>
              <Badge value={fetchData?.lenTrungtu} status="success" containerStyle={{ position: 'absolute',top: -2,right:0}}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeSuachua}
              onPress={() => onFilterLoai('SCTT')}>
              <Text style={{color: data.loaisc=='SCTT' ? '#000' : COLOR.LIGHT_GREY, fontWeight: 'bold'}}>Tiểu tu</Text>
              <Badge value={fetchData?.lenTieudu} status="primary" containerStyle={{ position: 'absolute',top: -2,right:0}}/>
            </TouchableOpacity>
          </View>
          {fetchData.loading ? (
            <LoadingView />
          ) : (
            <View style={{flex: 1, paddingTop: 8}}>
              <View style={styles.mHead}>
                {months.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.mHeadTxt,
                      {borderLeftWidth: index > 0 ? 1 : 0, borderLeftColor: '#FFF'},
                    ]}>
                    <Text style={{fontWeight: 'bold', color: '#FFF'}}>
                      T{item}
                    </Text>
                  </View>
                ))}
              </View>
              <ScrollView style={{flex: 1}}>
                <View style={{flex: 1, paddingBottom: 8,}}>
                  {data.filtered.map((item, index) => {
                    const mevt = item.event;
                    let tw = 1;
                    let sw = 0;
                    let ew = 0;
                    if (mevt.length > 1) {
                      sw = mevt[0];
                      ew = mevt[1];
                      tw = ew - sw + 1;
                    } else {
                      sw = mevt[0];
                      ew = mevt[0];
                    }
                    return (
                      <View key={index} style={styles.rowM}>
                        {item.event.length === 0 ? (
                          <View
                            key={index.toString()}
                            style={[
                              styles.cellNone,
                              {borderLeftWidth: index > 0 ? 1 : 0, borderLeftColor: '#FFF'},
                            ]}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#a6a6a8',
                                fontSize: 8,
                              }}>
                              {item.name} No{' '}
                            </Text>
                          </View>
                        ) : (
                          months.map((tm, i2) => {
                            let w = 100.0 / 12;
                            let bc = '#52c41a';
                            if (item.tomay.loaiBaoDuong == 'SCLDT') {
                              bc = 'red';
                            } else if (item.tomay.loaiBaoDuong == 'SCTT') {
                              bc = '#02A8EA';
                            }
                            if (tm >= sw && tm <= ew) {
                              w = (100.0 / 12) * tw;
                            }
                            if (tm <= sw || tm > ew) {
                              if (tm === sw) {
                                return (
                                  <TouchableOpacity
                                    onPress={() => onShowItem(item)}
                                    key={`nm${i2}`}
                                    style={[
                                      styles.cellEvent,
                                      {
                                        width: `${w}%`,
                                        borderLeftWidth: i2 > 0 ? 1 : 0, borderLeftColor: '#FFF'
                                      },
                                    ]}>
                                    <View
                                      style={[
                                        styles.noteEvent,
                                        {backgroundColor: bc},
                                      ]}>
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          color: '#FFF',
                                          fontSize: 8,
                                        }}>
                                        {item.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              } else {
                                return (
                                  <View
                                    key={`nm${i2}`}
                                    style={[
                                      styles.cellData,
                                      {
                                        width: `${w}%`,
                                        borderLeftWidth: i2 > 0 ? 0.5 : 0, borderLeftColor: '#FFF'
                                      },
                                    ]}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        color: '#a6a6a8',
                                        fontSize: 8,
                                      }}></Text>
                                  </View>
                                );
                              }
                            }
                          })
                        )}
                      </View>
                    );
                  })}

                  {/* <Calendar
                      markingType={'period'}
                      markedDates={{
                        '2021-06-15': { marked: true, dotColor: '#50cebb' },
                        '2021-06-16': { marked: true, dotColor: '#50cebb' },
                        '2021-06-21': { startingDay: true, color: '#50cebb', textColor: 'white' },
                        '2021-06-22': { color: '#70d7c7', textColor: 'white' },
                        '2021-06-23': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
                        '2021-06-24': { color: '#70d7c7', textColor: 'white' },
                        '2021-06-25': { endingDay: true, color: '#50cebb', textColor: 'white' }
                      }}
                    /> */}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <View style={{paddingBottom: 8}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: COLOR.RED,
                  fontWeight: 'bold',
                }}>
                Chi tiết lịch sửa chữa
              </Text>
            </View>
            {allState.showItem && (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name={'hammer'}
                    color={COLOR.RED}
                    size={30}
                    type="light"
                  />
                </View>
                <View style={{width: '85%'}}>
                  <Text style={{color: COLOR.ORANGE, paddingBottom: 4, paddingTop: 4}}>
                    {allState.showItem.tomay.tenNhaMay} -{' '}
                    {allState.showItem.tomay.tenToMay} :{' '}
                    {allState.showItem.tomay.loaiTuSua}
                  </Text>
                  <Text style={{ paddingBottom: 4, paddingTop: 4}}>
                    {allState.showItem.tomay.tenCongViec}
                  </Text>
                  <View style={styles.rowItem}>
                    <View style={{width: '25%'}}>
                      <Text style={styles.txtGroup}>Kế hoạch</Text>
                    </View>
                    <View style={{width: '11%'}}>
                      <Text style={styles.txtGroup}>
                        {allState.showItem.tomay.timeKH}
                      </Text>
                    </View>
                    <View style={{width: '32%'}}>
                      <Text style={styles.txtDonvi}>
                        {allState.showItem.tomay.thoiGianBatDauKeHoach}
                      </Text>
                    </View>
                    <View style={{width: '32%'}}>
                      <Text style={styles.txtDonvi}>
                        {allState.showItem.tomay.thoiGianKetThucKeHoach}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowItem}>
                    <View style={{width: '25%'}}>
                      <Text style={styles.txtGroup}>Thực tế</Text>
                    </View>
                    <View style={{width: '11%'}}>
                      <Text style={styles.txtGroup}>
                        {allState.showItem.tomay.timeTH}
                      </Text>
                    </View>
                    <View style={{width: '32%'}}>
                      <Text style={styles.txtDonvi}>
                        {allState.showItem.tomay.thoiGianBatDauThucTe}
                      </Text>
                    </View>
                    <View style={{width: '32%'}}>
                      <Text style={styles.txtDonvi}>
                        {allState.showItem.tomay.thoiGianKetThucThucTe}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Actionsheet.Content>
        </Actionsheet>
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
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  mHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#407ccc',
    height: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomColor: '#FFF',
    borderBottomWidth: 1
  },
  typeSuachua: {
    width: '25%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mHeadTxt: {
    width: `${100.0 / 12}%`,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#a6a6a8',
    height: 30,
  },
  rowM: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
  },
  cellNone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFF',
    height: 34,
  },
  cellData: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    backgroundColor: '#f5f8fc',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    borderRadius: 4,
  },
  cellEvent: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#a6a6a8',
  },
  noteEvent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 4,
    width: '100%',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtGroup: {
    color: COLOR.HEARDER,
    paddingTop: 8,
    paddingBottom: 8,
  },
  txtDonvi: {
    color: COLOR.HEARDER,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'right',
  },
});
