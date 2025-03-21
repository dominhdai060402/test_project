import { format, subDays } from 'date-fns';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Appearance, SafeAreaView, StyleSheet, Text, TouchableOpacity, View ,ScrollView} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import { Appstyles } from '../../styles/AppStyle';
import { Stylescs } from '../thitruongdien/Stylescs';
import { COLOR } from '../../../env/config';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { numberFormat } from '../../../util/format';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();
export function SLtheonhamayND({navigation}) {
  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: subDays(new Date(),1),
    isDate: false,
    listNhamay: [],
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
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Sản lượng khối nhiệt điện</Text>
          <Text style={{ color: '#000', fontSize: 12}}>Ngày: {format(allState.ngayxem, 'dd-MM-yyyy')}</Text>
        </View>
      )
    });

  }, [navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      let listNhamay = [];
      await http
      .get(SanluongURL.GetDanhSachThongTinNhaMay())
      .then(res => {
        const data = res.data;
        data.map((item, index) => {
          if (item.idLoaiNhaMay === 2) {
            listNhamay.push(item);
          }
        });
      })
      .catch(err => {
        console.log('errerrerrerrerrerr:', err);
      });
      fetchData(allState.ngayxem, listNhamay);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem, listNhamay) => {
    await Promise.all(listNhamay.map(async (item)=> {
      await getDataNhamay(ngayxem,item);
      return item + 1;
    }));

    setAllState({...allState, loading: false, ngayxem,listNhamay , isDate: false});
  };

  const getDataNhamay = async (ngayxem, item)=>{
    const data = {
      IdNhaMay: item.idNhaMay,
      Ngay: format(ngayxem, 'yyyy-MM-dd')
    };
    console.log(data);
    await http.post(SanluongURL.GetSanLuongTheoNhaMay(),data).then((res)=>{
      let data = res.data;
      data.tyleN = data.tiLeNgay > 100 ? 100 : data.tiLeNgay;
      data.tyleT = data.tiLeThang > 100 ? 100 : data.tiLeThang;
      data.tyleNam = data.tiLeNam > 100 ? 100 : data.tiLeNam;
      data.tyleMK = data.tiLeMuaKho > 100 ? 100 : data.tiLeMuaKho;

      item.sl = data;
    }).catch((error)=>{
      console.log('error: ', error);
    });
  }

  const hideDatePicker = () => {
    setAllState({...allState, isDate: false});
  };

  const handleConfirm = date => {
    setAllState({...allState, isDate: false, loading: true});
    fetchData(date, allState.listNhamay);
  };


  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <ScrollView style={{flex: 1}}>
          {allState.loading ? (
            <LoadingView />
          ) : (
            allState.listNhamay.map((item, index)=>(
              
           
            <View style={{flex: 1, marginTop: index > 0 ? 12 : 0}} key={index}>
              <View style={[Stylescs.headerG1,{paddingLeft: 8}]}>
                <Icon name={'heart-rate'} color={'#109618'} size={20} type="light"/>
                <Text style={{ fontSize: 16, padding: 8 }}>{item.ten}</Text>
              </View>

              <View style={{flexDirection:'row', justifyContent: 'space-between', marginLeft:8, marginRight: 8, marginTop: 16}}>
                <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius:8, marginRight: 4, padding: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Ngày</Text>
                    <View style={{height: 8, flex: 1, backgroundColor: '#f6bfb2', borderRadius:8, marginLeft: 8}}>
                    <View style={{height: 8, width: `${item.sl?.tyleN}%`, backgroundColor: '#b79cd1', borderRadius:8}}></View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Text style={{color: '#4680cd', fontWeight: 'bold'}}>{numberFormat(item.sl?.tiLeNgay)}</Text>
                    <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>%</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Kế hoạch</Text>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Thực hiện</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{textAlign: 'left', fontSize: 12, color: '#fd4b11'}}>{numberFormat(item.sl?.sanLuongKeHoachNgay)}</Text>
                          <Text style={{textAlign: 'left', fontSize: 10, color: '#545456', marginTop: 2}}> tr.kWh</Text>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(item.sl?.sanLuongThucHienNgay)}</Text>
                        </View>
                        <View style={{width: 36,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tr.kWh</Text>
                        </View>
                      </View>
                    </View>
                </View>

                <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius:8, marginLeft: 4, padding: 8}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Tháng</Text>
                    <View style={{height: 8, flex: 1, backgroundColor: '#f6bfb2', borderRadius:8, marginLeft: 8}}>
                    <View style={{height: 8, width: `${item.sl?.tyleT}%`, backgroundColor: '#b79cd1', borderRadius:8}}></View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Text style={{color: '#4680cd', fontWeight: 'bold'}}>{numberFormat(item.sl?.tiLeThang)}</Text>
                    <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>%</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Kế hoạch</Text>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Thực hiện</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{textAlign: 'left', fontSize: 12, color: '#fd4b11'}}>{numberFormat(item.sl?.sanLuongKeHoachThang)}</Text>
                          <Text style={{textAlign: 'left', fontSize: 10, color: '#545456', marginTop: 2}}> tr.kWh</Text>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(item.sl?.sanLuongThucHienThang)}</Text>
                        </View>
                        <View style={{width: 36,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tr.kWh</Text>
                        </View>
                      </View>
                    </View>
                </View>
              </View>

              {/* ROW 2 */}
              <View style={{flexDirection:'row', justifyContent: 'space-between', marginLeft:8, marginRight: 8, marginTop: 16}}>
                <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius:8, marginRight: 4, padding: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Năm</Text>
                    <View style={{height: 8, flex: 1, backgroundColor: '#f6bfb2', borderRadius:8, marginLeft: 8}}>
                    <View style={{height: 8, width: `${item.sl?.tyleNam}%`, backgroundColor: '#b79cd1', borderRadius:8}}></View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Text style={{color: '#4680cd', fontWeight: 'bold'}}>{numberFormat(item.sl?.tiLeNam)}</Text>
                    <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>%</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Kế hoạch</Text>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Thực hiện</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{textAlign: 'left', fontSize: 12, color: '#fd4b11'}}>{numberFormat(item.sl?.sanLuongKeHoachNam)}</Text>
                          <Text style={{textAlign: 'left', fontSize: 10, color: '#545456', marginTop: 2}}> tr.kWh</Text>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(item.sl?.sanLuongThucHienNam)}</Text>
                        </View>
                        <View style={{width: 36,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tr.kWh</Text>
                        </View>
                      </View>
                    </View>
                </View>

                <View style={{flex: 1, backgroundColor: '#f2f1f6', borderRadius:8, marginLeft: 4, padding: 8}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Mùa khô</Text>
                    <View style={{height: 8, flex: 1, backgroundColor: '#f6bfb2', borderRadius:8, marginLeft: 8}}>
                    <View style={{height: 8, width: `${item.sl?.tyleMK}%`, backgroundColor: '#b79cd1', borderRadius:8}}></View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Text style={{color: '#4680cd', fontWeight: 'bold'}}>{numberFormat(item.sl?.tiLeMuaKho)}</Text>
                    <Text style={{color: '#737d83', fontSize: 10, marginTop: 4, paddingLeft: 2}}>%</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Kế hoạch</Text>
                      <Text style={{textAlign: 'left', fontSize: 12, color: '#545456'}}>Thực hiện</Text>
                  </View>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingTop: 8}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{textAlign: 'left', fontSize: 12, color: '#fd4b11'}}>{numberFormat(item.sl?.sanLuongKeHoachMuaKho)}</Text>
                          <Text style={{textAlign: 'left', fontSize: 10, color: '#545456', marginTop: 2}}> tr.kWh</Text>
                      </View>

                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text style={{textAlign: 'right', fontSize: 12, color: '#7879f1'}}>{numberFormat(item.sl?.sanLuongThucHienMuakKho)}</Text>
                        </View>
                        <View style={{width: 36,}}>
                          <Text style={{textAlign: 'right', fontSize: 10, color: '#545456', marginTop: 2}}>tr.kWh</Text>
                        </View>
                      </View>
                    </View>
                </View>
              </View>

            </View>
             ))
          )}
        </ScrollView>
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
  
});
