import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ttdStyle, Appstyles } from '../../styles/AppStyle';
import Icon from 'react-native-fontawesome-pro';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import TtdURL from '../../services/thitruongdien/ttdURL';
import CommonHttp from '../../services/commonHttp';
import { findName } from './findName';
import { Stylescs } from './Stylescs';
import { numberFormat } from '../../../util/format';

export default function Congsuathethong({ navigation }) {
  const layout = useWindowDimensions();
  const http = new CommonHttp();
  const [allState, setAllState] = useState({
    loading: true,
    data: [],
    message: '',
    mienbac: [],
    mientrung: [],
    miennam: [],
    tyLe: 0,
    csThuydien: 0,
    csNhietdien: 0,
    csTKThuydien: 0,
    csTKNhietdien: 0,
    totalBac: 0,
    totalTrung: 0,
    totalNam: 0,
  });
  const [mien, setMien] = useState('0');
  useEffect(() => {
    const onInit = async () => {
      let mienbac = [];
      let mientrung = [];
      let miennam = [];
      let mienbacGroup = [];
      let mientrungGroup = [];
      let miennamGroup = [];
      let csThuydien = 0;
      let csNhietdien = 0;
      let csTKThuydien = 0;
      let csTKNhietdien = 0;

      let totalBac = 0;
      let totalTrung = 0;
      let totalNam = 0;
      await http
        .get(TtdURL.getCongSuatScada())
        .then(async res => {
          const data = res.data;
          //onsole.log('api/Scada/GetCongSuatScada:', data);
          data.lenhDIM.map((item, index) => {
            if (item.idNhaMay === 148) {
              item.idNhaMay = 16;
            } else if (item.idNhaMay === 5) {
              item.idNhaMay = 4;
            }
            if (item.vungMien === 'Miền Bắc') {
              mienbac.push(item);
              totalBac = totalBac + item.congSuatScada || item.giaTriSo_HoanhThanh || 0;
            } else if (item.vungMien === 'Miền Trung') {
              mientrung.push(item);
              totalTrung = totalBac + item.congSuatScada || item.giaTriSo_HoanhThanh || 0;
            } else {
              miennam.push(item);
              totalNam = totalBac + item.congSuatScada || item.giaTriSo_HoanhThanh || 0;
            }
            if (item.idLoaiNhaMay === 1) {
              csThuydien += item.congSuatScada || item.giaTriSo_HoanhThanh || 0;
              csTKThuydien += item.congSuatThietKeLonNhat || 0;
            }
            if (item.idLoaiNhaMay === 2) {
              csNhietdien +=
                item.congSuatScada || item.giaTriSo_HoanhThanh || 0;
              csTKNhietdien += item.congSuatThietKeLonNhat || 0;
            }
          });
          mienbacGroup = await onGroupNhamay(mienbac);
          mientrungGroup = await onGroupNhamay(mientrung);
          miennamGroup = await onGroupNhamay(miennam);
          let tyLe = (data.tongGenCo / data.tongCongSuatDat) * 100;
          setAllState({
            loading: false,
            data: data,
            message: ``,
            mienbac: mienbacGroup,
            mientrung: mientrungGroup,
            miennam: miennamGroup,
            tyLe,
            csThuydien,
            csNhietdien,
            csTKThuydien,
            csTKNhietdien,
            totalBac,
            totalTrung,
            totalNam
          });
        })
        .catch(err => {
          setAllState({
            loading: false,
            data: [],
            message: `${err}`,
            lengthDIM: 0,
          });
        });
    };
    onInit();
  }, []);

  const onGroupNhamay = async dataVM => {
    let nhamayGroup = [];
    let idNhamay = -1;
    let gNhamay = { tomays: [] };
    const data = _.orderBy(dataVM, ['idNhaMay'], ['desc']);
    await data.map((item, index) => {
      let maTomay = item.tenToMay;
      let congsuat = item.congSuatScada
        ? item.congSuatScada
        : item.giaTriSo_HoanhThanh;
      let online = item.congSuatScada ? true : false;
      if (idNhamay === -1 || item.idNhaMay !== idNhamay) {
        idNhamay = item.idNhaMay;
        gNhamay = {};
        gNhamay = {
          idNhaMay: item.idNhaMay,
          tenNhaMay: findName(item.idNhaMay),
          maNhaMay: item.maNhaMay,
          idLoaiNhaMay: item.idLoaiNhaMay,
          congSuatScada: congsuat,
          tomays: [],
        };
        nhamayGroup.push(gNhamay);
        item.maToMay = maTomay;
        item.congSuatScada = congsuat;
        item.online = online;
        gNhamay.tomays.push(item);
      } else {
        item.maToMay = maTomay;
        item.congSuatScada = congsuat;
        item.online = online;
        gNhamay.tomays.push(item);
        gNhamay.congSuatScada += congsuat;
      }
    });
    return nhamayGroup;
  };

  const gotoNavigate = (screen, data) => {
    navigation.navigate(screen, { item: data });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {allState.loading ? (
        <LoadingView />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={Stylescs.headerG1}>
            <Icon
              name={'heart-rate'}
              color={'#109618'}
              size={20}
              type="light"
            />
            <Text style={{ fontSize: 16, padding: 8 }}>Genco1</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ height: 104 }}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 32,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Text
                  style={{
                    paddingLeft: 12,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#fb4d0a',
                  }}>
                  {numberFormat(allState.data.tongGenCo)} MW
                </Text>
                <Text
                  style={{
                    paddingRight: 20,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#6757dc',
                  }}>
                  {numberFormat(allState.data.tongCongSuatDat)} MW
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: '#fec9b7',
                  marginLeft: 12,
                  marginRight: 12,
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: '#bca1d4',
                    width: `${allState.tyLe}%`,
                    borderRadius: 8,
                  }}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: 32,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      paddingLeft: 12,
                      fontWeight: 'bold',
                      color: '#fb4d0a',
                    }}>
                    {numberFormat(allState.csThuydien)} MW
                  </Text>
                </View>
                <Icon
                  name={'water'}
                  size={14}
                  type="light"
                  color={COLOR.ORANGE}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      paddingRight: 20,
                      fontWeight: 'bold',
                      color: '#6757dc',
                      textAlign: 'right',
                    }}>
                    {numberFormat(allState.csTKThuydien)} MW
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: 32,
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      paddingLeft: 12,
                      fontWeight: 'bold',
                      color: '#fb4d0a',
                    }}>
                    {numberFormat(allState.csNhietdien)} MW
                  </Text>
                </View>
                <Icon
                  name={'industry-alt'}
                  size={14}
                  type="light"
                  color={COLOR.ORANGE}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      paddingRight: 20,
                      fontWeight: 'bold',
                      color: '#6757dc',
                      textAlign: 'right',
                    }}>
                    {numberFormat(allState.csTKNhietdien)} MW
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: 56, justifyContent: 'space-between', flexDirection: 'row', marginRight: 4, marginLeft: 4 }}>
              <View style={Stylescs.boxCSMien}>
                <Text style={{ color: COLOR.LIGHT_GREY, alignSelf: 'flex-end' }}>MW</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>Bắc: </Text>
                  <Text style={{ color: '#ff4b0f', fontWeight: 'bold' }}>{numberFormat(allState.data.mienBac)}</Text>
                </View>
              </View>
              <View style={Stylescs.boxCSMien}>
                <Text style={{ color: COLOR.LIGHT_GREY, alignSelf: 'flex-end' }}>MW</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>Trung: </Text>
                  <Text style={{ color: '#ff4b0f', fontWeight: 'bold' }}>{numberFormat(allState.data.mienTrung)}</Text>
                </View>
              </View>
              <View style={Stylescs.boxCSMien}>
                <Text style={{ color: COLOR.LIGHT_GREY, alignSelf: 'flex-end' }}>MW</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>Nam: </Text>
                  <Text style={{ color: '#ff4b0f', fontWeight: 'bold' }}>{numberFormat(allState.data.mienNam)}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 16,
                backgroundColor: '#FFF',
              }}>
              <View style={styles.boxType}>
                <TouchableOpacity
                  style={mien === '0' ? styles.typeSelect : styles.typeNone}
                  onPress={() => setMien('0')}>
                  <Text style={{ color: '#000', padding: 8 }}>Miền bắc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={mien === '1' ? styles.typeSelect : styles.typeNone}
                  onPress={() => setMien('1')}>
                  <Text style={{ color: '#000', padding: 8 }}>Miền trung</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={mien === '2' ? styles.typeSelect : styles.typeNone}
                  onPress={() => setMien('2')}>
                  <Text style={{ color: '#000', padding: 8 }}>Miền nam</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}>
                {mien === '0' && (
                  <View style={styles.box}>
                    {/* <Text style={styles.box_text}>Miền Bắc</Text> */}
                    <View style={styles.box_data}>
                      {allState.mienbac.map((m, index) => {
                        const mR = allState.mienbac[index + 1];
                        if ((index + 1) % 2 == 1) {
                          let le =
                            index == allState.mienbac.length - 1 ? true : false;
                          return (
                            <View key={index} style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                onPress={() => gotoNavigate('Bieudonhamay', m)}
                                style={
                                  le
                                    ? ttdStyle.box_feature_left_one
                                    : ttdStyle.box_feature_left
                                }>
                                <View style={styles.box_child}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Icon
                                      name={
                                        m.idLoaiNhaMay === 1
                                          ? 'water'
                                          : 'industry-alt'
                                      }
                                      size={16}
                                      type="light"
                                      color={COLOR.ORANGE}
                                    />
                                    <Text style={styles.txtNhamay}>
                                      {m.tenNhaMay}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text style={styles.csNhamay}>
                                      {numberFormat(m.congSuatScada)}
                                    </Text>
                                  </View>
                                </View>
                                <View>
                                  {m.tomays.map((tomay, index) => (
                                    <View
                                      key={index}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View style={styles.box_child_tm}>
                                        <View>
                                          <Text style={styles.txtTomay}>
                                            {tomay.maToMay}
                                          </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                          <Text
                                            style={{
                                              color: '#F65033',
                                              textDecorationLine: tomay.online
                                                ? 'underline'
                                                : 'none',
                                            }}>
                                            {tomay.congSuatScada}
                                          </Text>
                                          {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                              /{tomay.congSuatThietKeLonNhat}
                                            </Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </TouchableOpacity>
                              {mR && (
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', mR)
                                  }
                                  style={ttdStyle.box_feature_right}>
                                  <View style={styles.box_child}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Icon
                                        name={
                                          m.idLoaiNhaMay === 1
                                            ? 'water'
                                            : 'industry-alt'
                                        }
                                        size={16}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {mR.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {mR.congSuatScada?.toLocaleString(
                                          'vi-VN',
                                        )}
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    {mR.tomays.map((tomay, index) => (
                                      <View
                                        key={index}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>
                                            <Text
                                              style={{
                                                color: '#F65033',
                                                textDecorationLine: tomay.online
                                                  ? 'underline'
                                                  : 'none',
                                              }}>
                                              {tomay.congSuatScada}
                                            </Text>
                                            {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                                /{tomay.congSuatThietKeLonNhat}
                                              </Text> */}
                                          </View>
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        }
                      })}
                    </View>
                  </View>
                )}
                {mien === '1' && (
                  <View style={styles.box}>
                    {/* <Text style={styles.box_text}>Miền Trung</Text> */}
                    <View style={styles.box_data}>
                      {allState.mientrung.map((m, index) => {
                        const mR = allState.mientrung[index + 1];
                        if ((index + 1) % 2 == 1) {
                          let le =
                            index == allState.mientrung.length - 1
                              ? true
                              : false;
                          return (
                            <View key={index} style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                onPress={() => gotoNavigate('Bieudonhamay', m)}
                                style={
                                  le
                                    ? ttdStyle.box_feature_left_one
                                    : ttdStyle.box_feature_left
                                }>
                                <View style={styles.box_child}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Icon
                                      name={
                                        m.idLoaiNhaMay === 1
                                          ? 'water'
                                          : 'industry-alt'
                                      }
                                      size={16}
                                      type="light"
                                      color={COLOR.ORANGE}
                                    />
                                    <Text style={styles.txtNhamay}>
                                      {m.tenNhaMay}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text style={styles.csNhamay}>
                                      {numberFormat(m.congSuatScada)}
                                    </Text>
                                  </View>
                                </View>
                                <View>
                                  {m.tomays.map((tomay, index) => (
                                    <View
                                      key={index}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View style={styles.box_child_tm}>
                                        <View>
                                          <Text style={styles.txtTomay}>
                                            {tomay.maToMay}
                                          </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                          <Text
                                            style={{
                                              color: '#F65033',
                                              textDecorationLine: tomay.online
                                                ? 'underline'
                                                : 'none',
                                            }}>
                                            {tomay.congSuatScada}
                                          </Text>
                                          {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                                /{tomay.congSuatThietKeLonNhat}
                                              </Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </TouchableOpacity>
                              {mR && (
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', mR)
                                  }
                                  style={ttdStyle.box_feature_right}>
                                  <View style={styles.box_child}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Icon
                                        name={
                                          m.idLoaiNhaMay === 1
                                            ? 'water'
                                            : 'industry-alt'
                                        }
                                        size={16}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {mR.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {mR.congSuatScada?.toLocaleString(
                                          'vi-VN',
                                        )}
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    {mR.tomays.map((tomay, index) => (
                                      <View
                                        key={index}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>
                                            <Text
                                              style={{
                                                color: '#F65033',
                                                textDecorationLine: tomay.online
                                                  ? 'underline'
                                                  : 'none',
                                              }}>
                                              {tomay.congSuatScada}
                                            </Text>
                                            {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                                /{tomay.congSuatThietKeLonNhat}
                                              </Text> */}
                                          </View>
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        }
                      })}
                    </View>
                  </View>
                )}
                {mien === '2' && (
                  <View style={styles.box}>
                    {/* <Text style={styles.box_text}>Miền Nam</Text> */}
                    <View style={styles.box_data}>
                      {allState.miennam.map((m, index) => {
                        const mR = allState.miennam[index + 1];
                        if ((index + 1) % 2 == 1) {
                          let le =
                            index == allState.miennam.length - 1 ? true : false;
                          return (
                            <View key={index} style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                onPress={() => gotoNavigate('Bieudonhamay', m)}
                                style={
                                  le
                                    ? ttdStyle.box_feature_left_one
                                    : ttdStyle.box_feature_left
                                }>
                                <View style={styles.box_child}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Icon
                                      name={
                                        m.idLoaiNhaMay === 1
                                          ? 'water'
                                          : 'industry-alt'
                                      }
                                      size={16}
                                      type="light"
                                      color={COLOR.ORANGE}
                                    />
                                    <Text style={styles.txtNhamay}>
                                      {m.tenNhaMay}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text style={styles.csNhamay}>
                                      {numberFormat(m.congSuatScada)}
                                    </Text>
                                  </View>
                                </View>
                                <View>
                                  {m.tomays.map((tomay, index) => (
                                    <View
                                      key={index}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View style={styles.box_child_tm}>
                                        <View>
                                          <Text style={styles.txtTomay}>
                                            {tomay.maToMay}
                                          </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                          <Text
                                            style={{
                                              color: '#F65033',
                                              textDecorationLine: tomay.online
                                                ? 'underline'
                                                : 'none',
                                            }}>
                                            {tomay.congSuatScada}
                                          </Text>
                                          {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                                /{tomay.congSuatThietKeLonNhat}
                                              </Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </TouchableOpacity>
                              {mR && (
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', mR)
                                  }
                                  style={ttdStyle.box_feature_right}>
                                  <View style={styles.box_child}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Icon
                                        name={
                                          m.idLoaiNhaMay === 1
                                            ? 'water'
                                            : 'industry-alt'
                                        }
                                        size={16}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {mR.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {numberFormat(mR.congSuatScada)}
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    {mR.tomays.map((tomay, index) => (
                                      <View
                                        key={index}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>
                                            <Text
                                              style={{
                                                color: '#F65033',
                                                textDecorationLine: tomay.online
                                                  ? 'underline'
                                                  : 'none',
                                              }}>
                                              {tomay.congSuatScada}
                                            </Text>
                                            {/* <Text style={{ color: COLOR.HEARDER, textDecorationLine: tomay.online ? 'underline' : 'none' }}>
                                                /{tomay.congSuatThietKeLonNhat}
                                              </Text> */}
                                          </View>
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        }
                      })}
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  boxType: {
    flexDirection: 'row',
    height: 32,
    justifyContent: 'space-between',
    //borderTopLeftRadius: 24,
    //borderTopRightRadius: 24,
    backgroundColor: '#f2f1f6',
  },
  typeSelect: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeNone: {
    borderRadius: 24,
    //backgroundColor: '#c0dcf1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal Alarm
  modalDetail: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    flex: 1,
    width: '100%',
    paddingBottom: 0,
    marginBottom: 0,
  },
  // CHi tiet to may

  box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: 4,
    paddingRight: 4,
  },
  box_total: {
    width: 272,
    height: 72,
    borderColor: COLOR.RED_S,
    borderWidth: 1,
    //justifyContent: 'center',
    // alignItems: 'center',
    //flexDirection: 'row',
    borderRadius: 5,
  },
  box_text: {
    textAlign: 'center',
    color: COLOR.RED_S,
    paddingTop: 8,
  },
  box_data: {
    paddingTop: 8,
    borderColor: '#004488',
    width: '100%',
    // borderTopWidth: 3,
    // borderRadius: 6,
  },
  box_child: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: 30,
    //paddingLeft: 8,
    //paddingRight: 8,
    //borderColor: '#004488',
    //borderWidth: 2,
    //borderRadius: 5,
    maxHeight: 30,
  },
  box_child_tm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: COLOR.LIGHT_GREY,
    borderWidth: 0.2,
    borderRadius: 3,
    maxHeight: 30,
    //marginLeft: 16,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  txtNhamay: {
    textAlign: 'center',
    color: COLOR.GOOG_BLUE,
    paddingLeft: 8,
  },
  csNhamay: {
    color: '#34A853',
    fontWeight: 'bold',
  },
  txtTomay: {
    textAlign: 'center',
    color: '#000',
  },
});
