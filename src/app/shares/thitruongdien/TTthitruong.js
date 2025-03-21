import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { format } from 'date-fns';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  Appearance,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLOR } from '../../../env/config';
import { ListEmpty, LoadingView, Separator } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import { Appstyles } from '../../styles/AppStyle';
import { useFetchAPI } from './HandleEvent';
import { numberFormat, formatNumber } from '../../../util/format';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function TTthitruong(props) {
  const [allState, setAllState] = useState({
    ngayxem: format(new Date(), 'dd-MM-yyyy'),
    isDate: false,
  });

  const fetchDataAPI = useFetchAPI(allState.ngayxem);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        // 
        <TouchableOpacity onPress={() => setAllState({...allState, isDate: true})}>
          <Icon name={'calendar-alt'} color={'#000'} size={20} type="light" containerStyle={{ paddingRight: 16 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Thị trường điện</Text>
          <Text style={{ color: '#000', fontSize: 11 }}>Ngày: {allState.ngayxem}</Text>
        </View>
      )
    });

  }, [props.navigation, allState]);

  const hideDatePicker = () => {
    setAllState({ ...allState, isDate: false });
  };

  const handleConfirm = date => {
    const ngayxem = format(date, 'dd-MM-yyyy');
    if (ngayxem !== allState.ngayxem) {
      fetchDataAPI.loading = true;
      setAllState({ ...allState, isDate: false, ngayxem });
    }
  };

  const keyExtractor = useCallback(item => Math.random().toString(), []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: index % 2 == 0 ? '#f2f1f6' : '#FFF' }}>
      <View style={styles.colChuky}>
        <Text style={styles.colHeadText}>{item.chuKy}</Text>
      </View>
      <View style={styles.colRowNumber}>
        <Text style={styles.colRowText}>{numberFormat(item.giaBienMB)}</Text>
        <Text style={styles.colRowtomay}>{item.toMayMB}</Text>
      </View>
      <View style={styles.colRowNumber}>
        <Text style={styles.colRowText}>{numberFormat(item.giaBienMT)}</Text>
        <Text style={styles.colRowtomay}>{item.toMayMT}</Text>
      </View>
      <View style={styles.colRowNumber}>
        <Text style={styles.colRowText}>{numberFormat(item.giaBienMN)}</Text>
        <Text style={styles.colRowtomay}>{item.toMayMN}</Text>
      </View>
      <View style={styles.colRowNumber}>
        <Text style={styles.colRowText}>{numberFormat(item.giaBienQG)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        {fetchDataAPI.loading ? (
          <LoadingView />
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft:8, marginRight: 8}}>
              <View style={{backgroundColor: '#f2f1f6', flex: 1,borderRadius: 8, marginRight: 4, padding: 8}}>
                <Text>Giá trung bình</Text>
                <View style={{flexDirection: 'row', paddingTop: 4}}>
                  <Text style={{color: '#407ccc'}}>{formatNumber(fetchDataAPI.dataTT.giaFMPTrungBinh)}</Text>
                  <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> VNĐ</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 10, color: '#6d777d'}}>Max</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 10, color: '#6d777d', textAlign: 'left'}}>Min</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#fd4b11'}}>{formatNumber(fetchDataAPI.dataTT.giaFMPMax)}</Text>
                    <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> VNĐ</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#7879f1'}}>{formatNumber(fetchDataAPI.dataTT.giaFMPMin)}</Text>
                    <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> VNĐ</Text>
                  </View>
                </View>

              </View>
              <View style={{backgroundColor: '#f2f1f6', flex: 1,borderRadius: 8, marginLeft: 4, padding: 8}}>
                <Text>Phụ tải trung bình</Text>
                <View style={{flexDirection: 'row', paddingTop: 4}}>
                  <Text style={{color: '#407ccc'}}>{formatNumber(fetchDataAPI.dataTT.phuTaiTrungBinh)}</Text>
                  <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> MW</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 10, color: '#6d777d'}}>Max</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{fontSize: 10, color: '#6d777d', textAlign: 'left'}}>Min</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#fd4b11'}}>{formatNumber(fetchDataAPI.dataTT.phuTaiMax)}</Text>
                    <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> MW</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{color: '#7879f1'}}>{formatNumber(fetchDataAPI.dataTT.phuTaiMin)}</Text>
                    <Text style={{fontSize: 10, marginTop: 4, color: '#6d777d'}}> MW</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ left: 0, width: '50%' }}>
                  <Text
                    style={{ textAlign: 'left', paddingLeft: 8, fontSize: 12 }}>
                    Giá FMP (VNĐ)
                  </Text>
                </View>
                <View style={{ right: 0, width: '50%' }}>
                  <Text
                    style={{ textAlign: 'right', paddingRight: 8, fontSize: 12 }}>
                    Phụ tải (MW)
                  </Text>
                </View>
              </View>
              <HighchartsReactNative
                styles={styles.highchar}
                options={fetchDataAPI.chartOptions}
              />
            </View>
            <View style={styles.giaBienMien}>
              <View style={styles.vboxHead}>
                <View style={styles.colChuky}>
                  <Text style={styles.colHeadText}>Chu kỳ</Text>
                </View>
                <View style={styles.colHeader}>
                  <Text style={styles.colHeadText}>Miền Bắc</Text>
                </View>
                <View style={styles.colHeader}>
                  <Text style={styles.colHeadText}>Miền Trung</Text>
                </View>
                <View style={styles.colHeader}>
                  <Text style={styles.colHeadText}>Miền Nam</Text>
                </View>
                <View style={styles.colHeader}>
                  <Text style={styles.colHeadText}>Giá biên KRB</Text>
                </View>
              </View>
              <View style={{ height: 400 }}>
                <FlatList
                  data={fetchDataAPI.giaBienMien}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  ListEmptyComponent={() => ListEmpty('')}
                  ItemSeparatorComponent={Separator}
                />
              </View>
            </View>
          </ScrollView>
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

const styles = StyleSheet.create({
  highchar: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 400,
  },
  vlegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  vboxHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  giaBienMien: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#CED0CE',
    borderWidth: 0.5,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 5,
  },
  vlegendBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  colChuky: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '12%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colHeader: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colHeadText: {
    fontSize: 11,
    color: COLOR.HEARDER,
    fontWeight: 'bold',
  },
  colRowNumber: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    width: '22%',
    justifyContent: 'center',
    //alignItems: 'center',
  },
  colRowText: {
    //fontSize: 11,
    textAlign: 'right',
    color: '#000',
    fontWeight: 'bold',
  },
  colRowtomay: {
    fontSize: 11,
    textAlign: 'right',
    color: COLOR.LIGHT_GREY,
    fontWeight: 'bold',
  },
});
