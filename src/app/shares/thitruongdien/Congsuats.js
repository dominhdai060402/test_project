import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {ttdStyle, Appstyles} from '../../styles/AppStyle';
import {findName} from './findName';

const http = new CommonHttp();
export function Congsuats({navigation}) {
  const [allState, setAllState] = useState({
    loading: true,
    data: [],
    message: '',
    mienbac: [],
    mientrung: [],
    miennam: [],
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
      await http
        .get(TtdURL.getCongSuatScada())
        .then(async res => {
          const data = res.data;
          //console.log('api/Scada/GetCongSuatScada:', data);
          data.lenhDIM.map((item, index) => {
            if (item.idNhaMay === 148) {
              item.idNhaMay = 16;
            } else if (item.idNhaMay === 5) {
              item.idNhaMay = 4;
            }
            if (item.vungMien === 'Miền Bắc') {
              mienbac.push(item);
            } else if (item.vungMien === 'Miền Trung') {
              mientrung.push(item);
            } else {
              miennam.push(item);
            }
          });
          mienbacGroup = await onGroupNhamay(mienbac);
          mientrungGroup = await onGroupNhamay(mientrung);
          miennamGroup = await onGroupNhamay(miennam);

          setAllState({
            loading: false,
            data: data,
            message: ``,
            mienbac: mienbacGroup,
            mientrung: mientrungGroup,
            miennam: miennamGroup,
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
    let gNhamay = {tomays: []};
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
    navigation.navigate(screen, {item: data});
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <Text style={styles.screenTitle}>CÔNG SUẤT NHÀ MÁY GENCO 1</Text>
            {allState.loading ? (
              <LoadingView />
            ) : (
              <View style={{flex: 1}}>
                <View style={styles.box}>
                  <View style={styles.box_total}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 1, borderRightWidth: 0.6, borderColor: COLOR.LIGHT_GREY}}>
                      <Text style={styles.totalCsuat}>
                        {allState.data.tongGenCo.toLocaleString('vi-VN')} MW
                      </Text>
                      </View>
                      {/* <Icon
                        name="grip-lines-vertical"
                        size={20}
                        type="light"
                        color={COLOR.ORANGE}
                      /> */}
                      <View style={{flex: 1}}>
                      <Text style={styles.totalThietke}>
                        {allState.data.tongCongSuatDat.toLocaleString('vi-VN')} MW
                      </Text>
                      </View>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 16, borderRightWidth: 0.6, borderColor: COLOR.LIGHT_GREY}}>
                      <Icon
                        name={'water'}
                        size={12}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                      <Text style={{paddingLeft: 8}}>
                        {allState.data.tongGenCo.toLocaleString('vi-VN')}
                      </Text>
                      </View>
                      
                      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 16}}>
                      <Icon
                        name={'water'}
                        size={12}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                      <Text style={{paddingLeft: 8}}>
                        {allState.data.tongCongSuatDat.toLocaleString('vi-VN')}
                      </Text>
                      </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 16, borderRightWidth: 0.6, borderColor: COLOR.LIGHT_GREY}}>
                      <Icon
                        name={'water'}
                        size={12}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                      <Text style={{paddingLeft: 8}}>
                        {allState.data.tongGenCo.toLocaleString('vi-VN')}
                      </Text>
                      </View>
                      
                      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 16}}>
                      <Icon
                        name={'water'}
                        size={12}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                      <Text style={{paddingLeft: 8}}>
                        {allState.data.tongCongSuatDat.toLocaleString('vi-VN')}
                      </Text>
                      </View>
                    </View>
                    {/* <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="bolt"
                        size={20}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                      <Text style={styles.totalCsuat}>
                        {allState.data.tongGenCo.toLocaleString('vi-VN')} MW
                      </Text>
                      <Icon
                        name="grip-lines-vertical"
                        size={20}
                        type="light"
                        color={COLOR.ORANGE}
                      />
                    </View>
                    <View>
                      <Text style={styles.totalThietke}>
                        {allState.data.tongCongSuatDat.toLocaleString('vi-VN')}
                        MW
                      </Text>
                    </View> */}
                  </View>
                </View>
                <View style={styles.boxType}>
                  <TouchableOpacity
                    style={mien === '0' ? styles.typeSelect : styles.typeNone}
                    onPress={() => setMien('0')}>
                    <Text
                      style={{color: COLOR.GREEN, padding: 8, fontSize: 12}}>
                      MIỀN BẮC
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={mien === '1' ? styles.typeSelect : styles.typeNone}
                    onPress={() => setMien('1')}>
                    <Text
                      style={{color: COLOR.GREEN, padding: 8, fontSize: 12}}>
                      MIỀN TRUNG
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={mien === '2' ? styles.typeSelect : styles.typeNone}
                    onPress={() => setMien('2')}>
                    <Text
                      style={{color: COLOR.GREEN, padding: 8, fontSize: 12}}>
                      MIỀN NAM
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1}}>
                  {mien === '0' && (
                    <View style={styles.box}>
                      {/* <Text style={styles.box_text}>Miền Bắc</Text> */}
                      <View style={styles.box_data}>
                        {allState.mienbac.map((m, index) => {
                          const mR = allState.mienbac[index + 1];
                          if ((index + 1) % 2 == 1) {
                            let le =
                              index == allState.mienbac.length - 1
                                ? true
                                : false;
                            return (
                              <View key={index} style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', m)
                                  }
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
                                        size={15}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {m.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {m.congSuatScada?.toLocaleString(
                                          'vi-VN',
                                        )}
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
                                        <Icon
                                          name="angle-right"
                                          size={15}
                                          type="light"
                                          color={COLOR.ORANGE}
                                          containerStyle={{
                                            paddingRight: 8,
                                            marginTop: 8,
                                          }}
                                        />
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{flexDirection: 'row'}}>
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
                                          size={15}
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
                                          <Icon
                                            name="angle-right"
                                            size={15}
                                            type="light"
                                            color={COLOR.ORANGE}
                                            containerStyle={{
                                              paddingRight: 8,
                                              marginTop: 8,
                                            }}
                                          />
                                          <View style={styles.box_child_tm}>
                                            <View>
                                              <Text style={styles.txtTomay}>
                                                {tomay.maToMay}
                                              </Text>
                                            </View>
                                            <View
                                              style={{flexDirection: 'row'}}>
                                              <Text
                                                style={{
                                                  color: '#F65033',
                                                  textDecorationLine:
                                                    tomay.online
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
                              <View key={index} style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', m)
                                  }
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
                                        size={15}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {m.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {m.congSuatScada?.toLocaleString(
                                          'vi-VN',
                                        )}
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
                                        <Icon
                                          name="angle-right"
                                          size={15}
                                          type="light"
                                          color={COLOR.ORANGE}
                                          containerStyle={{
                                            paddingRight: 8,
                                            marginTop: 8,
                                          }}
                                        />
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{flexDirection: 'row'}}>
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
                                          size={15}
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
                                          <Icon
                                            name="angle-right"
                                            size={15}
                                            type="light"
                                            color={COLOR.ORANGE}
                                            containerStyle={{
                                              paddingRight: 8,
                                              marginTop: 8,
                                            }}
                                          />
                                          <View style={styles.box_child_tm}>
                                            <View>
                                              <Text style={styles.txtTomay}>
                                                {tomay.maToMay}
                                              </Text>
                                            </View>
                                            <View
                                              style={{flexDirection: 'row'}}>
                                              <Text
                                                style={{
                                                  color: '#F65033',
                                                  textDecorationLine:
                                                    tomay.online
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
                              index == allState.miennam.length - 1
                                ? true
                                : false;
                            return (
                              <View key={index} style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() =>
                                    gotoNavigate('Bieudonhamay', m)
                                  }
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
                                        size={15}
                                        type="light"
                                        color={COLOR.ORANGE}
                                      />
                                      <Text style={styles.txtNhamay}>
                                        {m.tenNhaMay}
                                      </Text>
                                    </View>
                                    <View>
                                      <Text style={styles.csNhamay}>
                                        {m.congSuatScada?.toLocaleString(
                                          'vi-VN',
                                        )}
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
                                        <Icon
                                          name="angle-right"
                                          size={15}
                                          type="light"
                                          color={COLOR.ORANGE}
                                          containerStyle={{
                                            paddingRight: 8,
                                            marginTop: 8,
                                          }}
                                        />
                                        <View style={styles.box_child_tm}>
                                          <View>
                                            <Text style={styles.txtTomay}>
                                              {tomay.maToMay}
                                            </Text>
                                          </View>
                                          <View style={{flexDirection: 'row'}}>
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
                                          size={15}
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
                                          <Icon
                                            name="angle-right"
                                            size={15}
                                            type="light"
                                            color={COLOR.ORANGE}
                                            containerStyle={{
                                              paddingRight: 8,
                                              marginTop: 8,
                                            }}
                                          />
                                          <View style={styles.box_child_tm}>
                                            <View>
                                              <Text style={styles.txtTomay}>
                                                {tomay.maToMay}
                                              </Text>
                                            </View>
                                            <View
                                              style={{flexDirection: 'row'}}>
                                              <Text
                                                style={{
                                                  color: '#F65033',
                                                  textDecorationLine:
                                                    tomay.online
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
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#FFF',
  },
  screenTitle: {
    textAlign: 'center',
    color: COLOR.RED_S,
    paddingTop: 8,
    fontWeight: 'bold',
  },
  totalCsuat: {
    //textAlign: 'center',
    marginTop: 4,
    paddingLeft: 8,
    color: COLOR.RED_S,
    fontWeight: 'bold',
    fontSize: 16,
    //padding: 4,
  },
  totalThietke: {
    //textAlign: 'center',
    marginTop: 4,
    paddingLeft: 8,
    color: COLOR.HEARDER,
    fontWeight: 'bold',
    fontSize: 16,
    //padding: 4,
  },
  boxType: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 25,
    //backgroundColor: '#4B5672',
    backgroundColor: '#c0dcf1',
    marginLeft: 8,
    marginRight: 8,
  },

  typeSelect: {
    //backgroundColor: '#18233F',
    backgroundColor: '#000074',
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeNone: {
    borderRadius: 25,
    backgroundColor: '#c0dcf1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#004488',
    borderWidth: 2,
    borderRadius: 5,
    maxHeight: 40,
  },
  box_child_tm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#F65033',
    borderWidth: 0.2,
    borderRadius: 3,
    maxHeight: 30,
    //marginLeft: 16,
    marginTop: 8,
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
    color: '#F65033',
  },
});
