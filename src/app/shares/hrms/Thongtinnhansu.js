import React, {useEffect, useState, useLayoutEffect} from 'react';
import {ScrollView} from 'react-native';
import {Appearance, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-fontawesome-pro';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {Appstyles} from '../../styles/AppStyle';
import {Stylescs} from '../thitruongdien/Stylescs';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function Thongtinnhansu({navigation}) {
  const [allState, setAllState] = useState({
    loading: true,
    isDate: false,
    total: null,
    vpTcty: null,
    htpts: null,
    ctycons: null,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 14}}>
            Nhân sự
          </Text>
          <Text style={{color: '#000', fontSize: 11}}>
            Thông tin nhân sự Genco1
          </Text>
        </View>
      ),
    });
  }, [navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      fetchData();
    };
    onInit();
  }, []);

  const fetchData = async () => {
    let total = 0;
    let vpTcty = null;
    let htpts = [];
    let ctycons = [];
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
    });

    await http
      .get(TtdURL.GetThongTinNhanSu())
      .then(res => {
        const data = res.data;
        if (data) {
          //console.log('data:', data);
          data.map((item, index) => {
            total += item.tongSo;
            if (item.idLoaiDonVi === 3) {
              vpTcty = item;
            }
            if (item.idLoaiDonVi === 5 || item.idLoaiDonVi === 4) {
              ctycons.push(item);
            } else {
              htpts.push(item);
            }
          });
        }
      })
      .catch(error => {});
    //console.log('vpTcty:', vpTcty);
    //console.log('htpts:', htpts);
    //console.log('ctycons:', ctycons);
    setAllState({
      ...allState,
      loading: false,
      isDate: false,
      total,
      vpTcty,
      htpts,
      ctycons,
    });
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={Stylescs.headerG1}>
          <Icon name={'users'} color={'#000'} size={20} type="light" />
          <Text style={{fontSize: 16, padding: 8}}>Genco1</Text>
          {/* <TouchableOpacity style={{flex: 1}}>
            <Text style={{color: COLOR.GOOG_BLUE, textAlign: 'right'}}>
              Chi tiết
            </Text>
          </TouchableOpacity> */}
        </View>
        {allState.loading ? (
          <LoadingView />
        ) : (
          <ScrollView
            style={{paddingLeft: 8, paddingRight: 8, marginTop: 16}}
            showsVerticalScrollIndicator={false}>
            <ListItem containerStyle={styles.boxShowFooter} bottomDivider>
              <ListItem.Content>
                <View style={styles.rowItem}>
                  <View style={{width: '60%'}}>
                    <Text style={{color: COLOR.ORANGE}}>
                      Tổng nhân sự
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      backgroundColor: '#5f4fd8',
                      borderRadius: 8,
                    }}>
                    <Text style={styles.txtTotal}>
                      {allState.total.toLocaleString('vi-VN')}
                    </Text>
                  </View>
                  {/* <View style={{width: '20%'}}>
                    <Text style={styles.txtDonvi}>100%</Text>
                  </View> */}
                </View>
                <View style={styles.rowItem}>
                  <View style={{width: '64%'}}>
                    <Text style={styles.txtGroup}>Cơ quan Tổng công ty</Text>
                  </View>
                  <View style={{width: '16%'}}>
                    <Text style={styles.txtDonvi}>
                      {allState.vpTcty?.tongSo}
                    </Text>
                  </View>
                  <View style={{width: '20%', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.txtPerci}>
                      {(
                        (allState.vpTcty?.tongSo / allState.total) *
                        100
                      ).toFixed(1)}
                    </Text>
                    </View>
                    <View>
                      <Text style={styles.txtTyle}>%</Text>
                    </View>
                  </View>
                </View>
              </ListItem.Content>
            </ListItem>
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 8,
              }}>
              Các đơn vị trực thuộc
            </Text>
            <ListItem containerStyle={styles.boxShowFooter} bottomDivider>
              {/* <Icon name={'box-alt'} color={COLOR.RED} size={30} type="light" /> */}
              <ListItem.Content>
                <View>
                  {allState.htpts.map((dv, index) => (
                    <View style={styles.rowItem} key={index}>
                      <View style={{width: '64%'}}>
                        <Text style={styles.txtGroup}>{dv.tenDonVi}</Text>
                      </View>
                      <View style={{width: '16%'}}>
                        <Text style={styles.txtDonvi}>
                          {dv.tongSo.toLocaleString('vi-VN')}
                        </Text>
                      </View>
                      <View style={{width: '20%', flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.txtPerci}>
                          {((dv.tongSo / allState.total) * 100).toFixed(1)}
                        </Text>
                        </View>
                        <View>
                          <Text style={styles.txtTyle}>%</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ListItem.Content>
            </ListItem>

            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 8,
              }}>
              Các Công ty con và liên kết
            </Text>
            <ListItem containerStyle={styles.boxShowFooter} bottomDivider>
              {/* <Icon name={'box-open'} color={COLOR.RED} size={30} type="light" /> */}
              <ListItem.Content>
                {allState.ctycons.map((dv, index) => (
                  <View style={styles.rowItem} key={index}>
                    <View style={{width: '64%'}}>
                      <Text style={styles.txtGroup}>{dv.tenDonVi}</Text>
                    </View>
                    <View style={{width: '16%'}}>
                      <Text style={styles.txtDonvi}>
                        {dv.tongSo.toLocaleString('vi-VN')}
                      </Text>
                    </View>
                    <View style={{width: '20%', flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                      <Text style={styles.txtPerci}>
                        {((dv.tongSo / allState.total) * 100).toFixed(1)}
                      </Text>
                      </View>
                      <View>
                        <Text style={styles.txtTyle}>%</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ListItem.Content>
            </ListItem>
          </ScrollView>
        )}
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
  boxShowFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
    backgroundColor: '#f2f1f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtGroup: {
    color: '#000',
    padding: 8,
    paddingLeft: 0
  },
  txtTotal: {
    color: '#FFF',
    padding: 8,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  txtDonvi: {
    color: '#5f4fd8',
    padding: 8,
    textAlign: 'right',
  },
  txtPerci: {
    color: '#fa784e',
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 8,
    textAlign: 'right',
  },
  txtTyle: {
    paddingLeft: 2,
    fontSize: 10,
    paddingTop: 12,
    textAlign: 'left',
  },
});
