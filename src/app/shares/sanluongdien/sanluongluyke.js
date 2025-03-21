import _ from 'lodash';
import {format, subDays} from 'date-fns';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  Appearance,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import {Appstyles} from '../../styles/AppStyle';
import {Tbheader} from './tbheader';
import {TbheaderNam} from './tbheaderNam';
import {ViewKhac} from './ViewKhac';
import {Viewngay} from './Viewngay';
import {ViewNam} from './ViewNam';
import {MuaKho} from './MuaKho';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function Sanluongluyke(props) {
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    datexem: subDays(new Date(), 1),
    isDate: false,
    slNgay: [],
    slThang: [],
    slNam: [],
    slMuakho: [],
    type: 'HT_PT',
    type1: 1,
    type2: 1,
    tSLNgay: [],
    tSLThang: [],
    tSLNam: [],
    tSLMuakho: [],
  });
  const [nammk, setNammk] = useState(false);

  useEffect(() => {
    const onInit = async () => {
      fetchData(allState.ngayxem, allState.datexem);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, datexem) => {
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
      datexem,
    });
    let slNgay = [];
    let slThang = [];
    let slNam = [];
    let slMuakho = [];
    const month = datexem.getMonth() + 1;
    const year = datexem.getFullYear();
    await http
      .post(SanluongURL.GetSanLuongD1(), {
        Ngay: ngayxem,
      })
      .then(async res => {
        const data = res.data;
        if (data) {
          slNgay = _.orderBy(
            data,
            ['idLoaiNhaMay', 'tenNhaMay'],
            ['asc', 'asc'],
          );
          addSumGroup(slNgay);
        }
      })
      .catch(err => {
        console.log(err);
      });
    await http
      .post(SanluongURL.GetSanLuongThang(), {
        Thang: month,
        Nam: year,
      })
      .then(async res => {
        const data = res.data;
        if (data) {
          slThang = _.orderBy(
            data,
            ['idLoaiNhaMay', 'tenNhaMay'],
            ['asc', 'asc'],
          );
          addSumGroup(slThang);
        }
      })
      .catch(err => {
        console.log(err);
      });
    await http
      .post(SanluongURL.GetSanLuongNam(), {
        Nam: year,
      })
      .then(async res => {
        const data = res.data;
        if (data) {
          slNam = _.orderBy(
            data,
            ['idLoaiNhaMay', 'tenNhaMay'],
            ['asc', 'asc'],
          );
          addSumGroup(slNam);
        }
      })
      .catch(err => {
        console.log(err);
      });
    await http
      .post(SanluongURL.GetSanLuongMuaKho(), {
        Nam: year,
      })
      .then(async res => {
        const data = res.data;
        if (data) {
          slMuakho = _.orderBy(
            data,
            ['idLoaiNhaMay', 'tenNhaMay'],
            ['asc', 'asc'],
          );
          addSumGroup(slMuakho);
        }
      })
      .catch(err => {
        console.log(err);
      });

    setAllState({
      ...allState,
      loading: false,
      ngayxem,
      datexem,
      isDate: false,
      slNgay,
      slThang,
      slNam,
      slMuakho,
    });
  };

  const addSumGroup = lsData => {
    let tkh = 0;
    let tth = 0;
    let pkh = 0;
    let pth = 0;
    let lkkh = 0;
    let lkth = 0;

    let tdkh = 0;
    let tdth = 0;
    let ndkh = 0;
    let ndth = 0;

    let lktdkh = 0;
    let lktdth = 0;
    let lkndkh = 0;
    let lkndth = 0;

    lsData.map((item, index) => {
      tkh += item.keHoach;
      tth += item.thucHien;
      if (item.idLoaiDonVi === 1) {
        pkh += item.keHoach;
        pth += item.thucHien;
        if (item.idLoaiNhaMay === 1) {
          tdkh += item.keHoach;
          tdth += item.thucHien;
        }
        if (item.idLoaiNhaMay === 2) {
          ndkh += item.keHoach;
          ndth += item.thucHien;
        }
      }
      if (item.idLoaiDonVi === 2 || item.idLoaiDonVi === 3) {
        lkkh += item.keHoach;
        lkth += item.thucHien;
        if (item.idLoaiNhaMay === 1) {
          lktdkh += item.keHoach;
          lktdth += item.thucHien;
        }
        if (item.idLoaiNhaMay === 2) {
          lkndkh += item.keHoach;
          lkndth += item.thucHien;
        }
      }
    });
    let genco1 = createObject('Genco 1', null);

    let thuydien = createObject('Thủy điện', 1);
    let nhietdien = createObject('Nhiệt điện', 1);
    let phuth = createObject('Trực thuộc', 1);

    let lkthuydien = createObject('Thủy điện', 2);
    let lknhietdien = createObject('Nhiệt điện', 2);
    let conlk = createObject('Liên kết', 2);

    genco1.keHoach = parseFloat(tkh.toFixed(1));
    genco1.thucHien = parseFloat(tth.toFixed(1));
    genco1.tyLe = parseFloat(((tth / tkh) * 100).toFixed(1));

    phuth.keHoach = parseFloat(pkh.toFixed(1));
    phuth.thucHien = parseFloat(pth.toFixed(1));
    phuth.tyLe = parseFloat(((pth / pkh) * 100).toFixed(1));

    conlk.keHoach = parseFloat(lkkh.toFixed(1));
    conlk.thucHien = parseFloat(lkth.toFixed(1));
    conlk.tyLe = parseFloat(((lkth / lkkh) * 100).toFixed(1));

    thuydien.keHoach = parseFloat(tdkh.toFixed(1));
    thuydien.thucHien = parseFloat(tdth.toFixed(1));
    thuydien.tyLe = parseFloat(((tdth / tdkh) * 100).toFixed(1));

    nhietdien.keHoach = parseFloat(ndkh.toFixed(1));
    nhietdien.thucHien = parseFloat(ndth.toFixed(1));
    nhietdien.tyLe = parseFloat(((ndth / ndkh) * 100).toFixed(1));

    lkthuydien.keHoach = parseFloat(lktdkh.toFixed(1));
    lkthuydien.thucHien = parseFloat(lktdth.toFixed(1));
    lkthuydien.tyLe = parseFloat(((lktdth / lktdkh) * 100).toFixed(1));

    lknhietdien.keHoach = parseFloat(lkndkh.toFixed(1));
    lknhietdien.thucHien = parseFloat(lkndth.toFixed(1));
    lknhietdien.tyLe = parseFloat(((lkndth / lkndkh) * 100).toFixed(1));

    lsData.splice(0, 0, thuydien);
    lsData.splice(0, 0, lkthuydien);
    const ndIndex = lsData.findIndex(e => e.idLoaiNhaMay === 2);
    lsData.splice(ndIndex, 0, nhietdien);
    lsData.splice(ndIndex, 0, lknhietdien);

    lsData.push(phuth);
    lsData.push(conlk);
    lsData.push(genco1);
  };

  const createObject = (name, type) => {
    return {
      idLoaiDonVi: type,
      idLoaiNhaMay: 0,
      tenNhaMay: name,
      keHoach: 0,
      thucHien: 0,
      tyLe: 0,
      sumGroup: true,
    };
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

  const onTypeSelect = type => {
    let type1 = 1;
    let type2 = 1;
    let tSLNgay = [];
    let tSLThang = [];
    let tSLNam = [];
    let tSLMuakho = [];
    if (type === 'HT_PT') {
      type1 = 1;
      type2 = 1;
      loadData(allState.slNgay);
      loadData(allState.slThang);
      loadData(allState.slNam);
      loadData(allState.slMuakho);
    } else if (type === 'HT_DL') {
      type1 = 2;
      type2 = 3;
      loadData(allState.slNgay);
      loadData(allState.slThang);
      loadData(allState.slNam);
      loadData(allState.slMuakho);
    } else {
      tSLNgay = onloadTHData(allState.slNgay);
      tSLThang = onloadTHData(allState.slThang);
      tSLNam = onloadTHData(allState.slNam);
      tSLMuakho = onloadTHData(allState.slMuakho);
      type1 = 1;
      type2 = 1;
    }
    setAllState({
      ...allState,
      type,
      type1,
      type2,
      tSLNgay,
      tSLThang,
      tSLNam,
      tSLMuakho,
    });
  };

  const onSumTHND_TD = (obj1, obj2) => {
    const nData = createObject(obj1.tenNhaMay, obj1.idLoaiDonVi);
    const kh = obj1.keHoach + obj2.keHoach;
    const th = obj1.thucHien + obj2.thucHien;
    nData.keHoach = parseFloat(kh.toFixed(1));
    nData.thucHien = parseFloat(th.toFixed(1));
    nData.tyLe = parseFloat(((th / kh) * 100).toFixed(1));
    return nData;
  };

  const onloadTHData = data => {
    const lIndex = data.length;
    const ndIndex = data.findIndex(e => e.idLoaiNhaMay === 2);
    const tThuydien = onSumTHND_TD(data[0], data[1]);
    const tNhiendien = onSumTHND_TD(data[ndIndex - 2], data[ndIndex - 1]);
    let dataTH = [
      tThuydien,
      tNhiendien,
      data[lIndex - 3],
      data[lIndex - 2],
      data[lIndex - 1],
    ];
    dataTH.map((item, index) => {
      item.group = true;
    });
    return dataTH;
  };

  const loadData = data => {
    data.map((item, index) => {
      item.group = false;
    });
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={{flex: 1, paddingTop: 8}}>
          <View style={styles.vlegend}>
            <TouchableOpacity
              style={styles.vlegend}
              onPress={() => setAllState({...allState, isDate: true})}>
              <Icon
                name={'battery-three-quarters'}
                size={25}
                type="light"
                color={COLOR.GREEN}
                containerStyle={{paddingRight: 8}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: COLOR.GOOG_BLUE,
                }}>
                Ngày {allState.ngayxem}
              </Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <CheckBox
                style={Platform.OS === 'ios' ? styles.vCheckbox : null}
                value={nammk}
                onValueChange={newValue => setNammk(newValue)}
              />
              <Text style={{color: COLOR.ORANGE, paddingLeft: 8}}>
                Năm và mùa khô
              </Text>
            </View>
          </View>
          <View style={styles.boxType}>
            <TouchableOpacity
              style={[
                allState.type === 'HT_PT' ? styles.typeSelect : styles.typeNone,
                {width: '30%'},
              ]}
              onPress={() => onTypeSelect('HT_PT')}>
              <Text style={styles.textType}>TRỰC THUỘC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                allState.type === 'HT_DL' ? styles.typeSelect : styles.typeNone,
                {width: '40%'},
              ]}
              onPress={() => onTypeSelect('HT_DL')}>
              <Text style={styles.textType}>CTy CON, LIÊN KẾT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                allState.type === 'TONGHOP'
                  ? styles.typeSelect
                  : styles.typeNone,
                {width: '30%'},
              ]}
              onPress={() => onTypeSelect('TONGHOP')}>
              <Text style={styles.textType}>TỔNG HỢP</Text>
            </TouchableOpacity>
          </View>
          {allState.loading ? (
            <LoadingView />
          ) : (
            <ScrollView style={{flex: 1, paddingTop: 16}}>
              <View style={{flex: 1}}>
                {nammk ? (
                  <View style={{flex: 1}}>
                    <TbheaderNam datexem={allState.datexem}></TbheaderNam>
                    <ScrollView style={{flex: 1}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <ViewNam
                          data={
                            allState.type === 'TONGHOP'
                              ? allState.tSLNam
                              : allState.slNam
                          }
                          loaixem={allState.type}
                          type1={allState.type1}
                          type2={allState.type2}
                          group={2}
                          datexem={allState.datexem}></ViewNam>
                        <MuaKho
                          data={
                            allState.type === 'TONGHOP'
                              ? allState.tSLMuakho
                              : allState.slMuakho
                          }
                          loaixem={allState.type}
                          type1={allState.type1}
                          type2={allState.type2}
                          group={3}
                          datexem={allState.datexem}></MuaKho>
                      </View>
                    </ScrollView>
                  </View>
                ) : (
                  <View style={{flex: 1}}>
                    <Tbheader datexem={allState.datexem}></Tbheader>
                    <ScrollView style={{flex: 1}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Viewngay
                          data={
                            allState.type === 'TONGHOP'
                              ? allState.tSLNgay
                              : allState.slNgay
                          }
                          loaixem={allState.type}
                          type1={allState.type1}
                          type2={allState.type2}
                          datexem={allState.datexem}></Viewngay>
                        <ViewKhac
                          data={
                            allState.type === 'TONGHOP'
                              ? allState.tSLThang
                              : allState.slThang
                          }
                          loaixem={allState.type}
                          type1={allState.type1}
                          type2={allState.type2}
                          group={1}
                          datexem={allState.datexem}></ViewKhac>
                        {/* <ViewKhac
                      data={
                        allState.type === 'TONGHOP'
                          ? allState.tSLNam
                          : allState.slNam
                      }
                      loaixem={allState.type}
                      type1={allState.type1}
                      type2={allState.type2}
                      group={2}
                      datexem={allState.datexem}></ViewKhac>
                    <ViewKhac
                      data={
                        allState.type === 'TONGHOP'
                          ? allState.tSLMuakho
                          : allState.slMuakho
                      }
                      loaixem={allState.type}
                      type1={allState.type1}
                      type2={allState.type2}
                      group={3}
                      datexem={allState.datexem}></ViewKhac> */}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
        <DateTimePickerModal
          headerTextIOS="Chọn tháng năm"
          isVisible={allState.isDate}
          mode="date"
          isDarkModeEnabled={isDark}
          onConfirm={date => handleConfirm(date)}
          onCancel={() => hideDatePicker()}
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
  },
  boxLuykeThang: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#CED0CE',
    borderWidth: 0.5,
    borderRadius: 5,
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
  typeSelect: {
    backgroundColor: '#000074',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeNone: {
    backgroundColor: '#c0dcf1',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textType: {
    color: COLOR.GREEN,
    padding: 8,
    fontSize: 12,
  },
  colChuky: {
    justifyContent: 'center',
    width: '25%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colGiatri: {
    justifyContent: 'center',
    width: '25%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colTyle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    width: '25%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  textVal: {
    textAlign: 'right',
    color: COLOR.GOOG_BLUE,
  },
  textHead: {
    color: COLOR.HEARDER,
  },
  textTyle: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  textKh: {
    textAlign: 'right',
    color: COLOR.GOOG_BLUE,
    fontWeight: 'bold',
  },
  textTh: {
    textAlign: 'right',
    color: COLOR.BLUE,
    fontWeight: 'bold',
  },
  textkWh: {
    textAlign: 'right',
    fontSize: 11,
    color: COLOR.RED,
  }, // Check box
  checkboxContainer: {
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vCheckbox: {
    width: 20,
    height: 20,
    color: COLOR.ORANGE,
  },
});
