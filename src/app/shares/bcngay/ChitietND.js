import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import Icon from 'react-native-fontawesome-pro';
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import { Appstyles } from '../../styles/AppStyle';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { format } from 'date-fns';
import { formatNumber } from '../../../util/format';

const width = Dimensions.get('window').width


export function ChitietND(props) {
  const http = new CommonHttp();
  const ngayXem = props.route.params.ngayXem;
  const [allState, setAllState] = useState({
    loading: true,
    loadingNM: false,
    listNhamay: [],
    idNhamay: null,
    dataNhamay: null,
    idTomay: null,
    dataTomay: null,
    strNgay: format(ngayXem,'dd-MM-yyyy'),
    scrollToIndex: 0,
  });
  const [ref, setRef] = useState(null);
  useLayoutEffect(() => {
    props.navigation.setOptions({
        // headerRight: () => (
        //   <TouchableOpacity onPress={()=>onChongay()}>
        //     <Icon name={'calendar-alt'} color={'#FFF'} size={24} type="light" containerStyle={{ paddingRight: 16 }} />
        //   </TouchableOpacity>
        // ),
        headerTitle: () =>(
          <View>
            <Text style={{color: '#000', fontWeight: 'bold', fontSize: 14}}>BCSX Khối nhiệt điện</Text>
            <Text style={{color: '#000', fontSize: 11 }}>Ngày: {allState.strNgay}</Text>
          </View>
        )
      });

  }, [props.navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      fetchData();
    };
    onInit();
  }, []);

  const fetchData = async () => {
    let idNhamay = null;
    let idTomay = null;
    let listNhamay = [];
    let dataNhamay = null;
    let dataTomay = null;
    await http
      .get(SanluongURL.GetDanhSachThongTinNhaMay())
      .then(res => {
        const data = res.data;
        data.map((item, index) => {
          if (item.idLoaiNhaMay === 2) {
            listNhamay.push(item);
            if (idNhamay === null) {
              idNhamay = item.idNhaMay;
            }
          }
        });
      })
      .catch(err => {
        console.log('errerrerrerrerrerr:', err);
      });
    await http.post(SanluongURL.GetBaoCaoSanXuatNhaMayNhietDien(), {
      IdNhaMay: idNhamay,
      NgayDieuKien: format(ngayXem,'yyyy-MM-dd')
    }).then((res) => {
      dataNhamay = res.data;

      const tongTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
      dataNhamay.tongTyle = tongTyle;
      //
      dataNhamay.toMays.map((item, index) => {
        if (idTomay === null) {
          idTomay = item.idToMay;
          dataTomay = item;
        }
        const tomayTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
        item.tomayTyle = tomayTyle;
      });

    }).catch((err) => {
      console.log(err);
    });
    //console.log('dataNhamay:', dataNhamay);
    setAllState({ ...allState, loading: false, dataNhamay, listNhamay, idNhamay, idTomay, dataTomay })
  };

  const onChangeNhamay = async (item, scrollToIndex) => {
    let idTomay = null;
    let dataNhamay = null;
    let dataTomay = null;
    scrollToIndex = allState.listNhamay.findIndex(a => a.idNhaMay === item.idNhaMay);
    setAllState({ ...allState, idNhamay: item.idNhaMay, loadingNM: true });
    await http.post(SanluongURL.GetBaoCaoSanXuatNhaMayNhietDien(), {
      IdNhaMay: item.idNhaMay,
      NgayDieuKien: format(ngayXem,'yyyy-MM-dd'),
    }).then((res) => {
      dataNhamay = res.data;
      const tongTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
      dataNhamay.tongTyle = tongTyle;
      //
      dataNhamay.toMays.map((item, index) => {
        if (idTomay === null) {
          idTomay = item.idToMay;
          dataTomay = item;
        }
        const tomayTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
        item.tomayTyle = tomayTyle;
      });

    }).catch((err) => {
      console.log(err);
    });
    setAllState({ ...allState, idNhamay: item.idNhaMay, dataNhamay, dataTomay, idTomay, loadingNM: false });
    if (ref && scrollToIndex !== -1) {
      ref.scrollTo({
        x: (width/6) * scrollToIndex,
        y: 0,
        animated: true,
      });
    }
  }

  const onChangeTomay = (item) => {
    setAllState({ ...allState, idTomay: item.idToMay, dataTomay: item});
  }

  const onSwipeLeft = gestureState => {
    const current = allState.listNhamay.find(
      item => item.idNhaMay === allState.idNhamay,
    );
    let index = allState.listNhamay.indexOf(current);
    let next = current;
    if (index < allState.listNhamay.length - 1) {
      index = index + 1;
      next = allState.listNhamay[index];
    } else {
      index = 0;
      next = allState.listNhamay[0];
    }
    onChangeNhamay(next,index);
  };

  const onSwipeRight = gestureState => {
    const current = allState.listNhamay.find(
      item => item.idNhaMay === allState.idNhamay,
    );
    let index = allState.listNhamay.indexOf(current);
    let next = current;
    if (index > 0) {
      index = index - 1;
      next = allState.listNhamay[index];
    } else {
      index = allState.listNhamay.length - 1;
      next = allState.listNhamay[index];
    }
    onChangeNhamay(next,index);
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          let x = gestureState.dx;
          let y = gestureState.dy;
          if (Math.abs(x) > Math.abs(y)) {
            if (x >= 0) {
              const listNhamay = allState.listNhamay;
              const idNhamay = allState.idNhamay;
              onSwipeRight(gestureState, listNhamay, idNhamay);
              //console.log('onPanResponderRelease x right:');
            } else {
              const listNhamay = allState.listNhamay;
              const idNhamay = allState.idNhamay;
              onSwipeLeft(gestureState, listNhamay, idNhamay);
              //console.log('onPanResponderRelease x left:');
            }
          } else {
          }
        },
      }),
    [allState],
  );

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        {allState.loading ? (
          <LoadingView />
        ) : (
          <View style={{flex: 1}}>
            {/* Khối nhiệt điện */}
            <View style={styles.khoiItem}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={ref => {
              setRef(ref);
            }}>
                  <View style={styles.khoiItem}>
                    {
                      allState.listNhamay.map((item, index) => (
                        <View key={item.idNhamay} style={styles.selectedNM}>
                          <TouchableOpacity onPress={() => onChangeNhamay(item, -1)}>
                            <Text style={allState.idNhamay === item.idNhaMay ? styles.item_time_focus : styles.item_time}>{item.ten}</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    }
                  </View>
                </ScrollView>
              </View>
        
          <Animated.ScrollView {...panResponder.panHandlers} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {allState.loadingNM ? (
                <LoadingView />
              ) : (
              <View style={{ flex: 1, paddingTop: 24 }}>
                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{allState.dataNhamay.sanLuongDauCucKeHoach?.toLocaleString('vi-VN')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Tổng</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#86abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataNhamay.tongTyle}%`, backgroundColor: '#3f7ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{allState.dataNhamay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataNhamay.tongTyle < 30 ? 30: allState.dataNhamay.tongTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{allState.dataNhamay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataNhamay.tongTyle < 20 ? 20: allState.dataNhamay.tongTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{allState.dataNhamay.tongTyle?.toLocaleString('vi-VN')} %</Text>
                    </View>
                  </View>
                </View>
                {allState.dataNhamay.toMays.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', paddingLeft: 128, paddingTop: 12 }}>
                    <View style={{ paddingRight: 12, justifyContent: 'center', top: 8 }}>
                      <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                      <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>{item.tenToMay}</Text>
                      <View style={{ flex: 1, height: 32, backgroundColor: '#86abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                        <View style={{ flex: 1, height: 32, width: '100%', backgroundColor: '#3f7ccc', alignSelf: 'flex-end', justifyContent: 'center', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                          <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{item.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                        </View>
                      </View>
                      {/* <View style={{ flex: 1, height: 32, width: '67%', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>454.343,34</Text>
                      </View> */}
                    </View>
                  </View>
                ))}


                <View style={{ flexDirection: 'row', height: 56, justifyContent: 'space-between', marginTop: 24, marginBottom: 8 }}>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 8, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Ngày: </Text>
                      <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.sanLuongDauCucNgay?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 4, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Tháng: </Text>
                      <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.sanLuongDauCucThang?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 8, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Năm: </Text>
                      <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
                </View>

                {/* Chọn tổ máy */}
                <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, justifyContent: 'space-between', padding: 2 }}>
                  {allState.dataNhamay.toMays.map((item, index) => (
                    <TouchableOpacity key={index} style={allState.idTomay === item.idToMay ? styles.item_tomay_focus : styles.item_tomay} onPress={() => onChangeTomay(item)}>
                      <Text>{item.tenToMay}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: 80, margin: 8, borderRadius: 8, backgroundColor: '#f2f1f6' }}>
                  <View style={{padding: 8}}>
                    <Text>Công suất</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8}}>
                    <View style={{flex: 1, borderRightWidth: 0.5}}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 32 }}>
                        <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>MW</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 48 }}>
                        <Text>Pmax: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.pmax?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, borderLeftWidth: 0.5}}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 32 }}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>MW</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 48 }}>
                        <Text>Pmin: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.pmin?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ height: 116, margin: 8, borderRadius: 8, backgroundColor: '#f2f1f6' }}>
                  <View style={{padding: 8}}>
                    <Text>Khói thải</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>Bụi</Text>
                      <View style={{flexDirection: 'row', paddingTop: 4, paddingBottom: 4}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.giaTriBui}</Text>
                        <Text style={{color: COLOR.LIGHT_GREY}}> {allState.dataTomay.giaTriBuiNguongChoPhep}</Text>
                      </View>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mg/Nm³</Text>
                    </View>
                    
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>SOx</Text>
                      <View style={{flexDirection: 'row', paddingTop: 4, paddingBottom: 4}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.giaTriSOx}</Text>
                        <Text style={{color: COLOR.LIGHT_GREY}}> {allState.dataTomay.giaTriSOxNguongChoPhep}</Text>
                      </View>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mg/Nm³</Text>
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>NOx</Text>
                      <View style={{flexDirection: 'row', paddingTop: 4, paddingBottom: 4}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataTomay.giaTriNOx}</Text>
                        <Text style={{color: COLOR.LIGHT_GREY}}> {allState.dataTomay.giaTriNOxNguongChoPhep}</Text>
                      </View>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mg/Nm³</Text>
                    </View>
                  </View>
                </View>

                <View style={{ height: 164, margin: 8, borderRadius: 8, backgroundColor: '#f2f1f6' }}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 32, paddingTop: 20}}>
                    <Text>Than tồn kho</Text>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.thanTonKho?.toLocaleString('vi-VN')}</Text>
                        <View style={{width: 48}}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10, marginTop: -8}}>(Tấn)</Text>
                        </View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 32, paddingTop: 20}}>
                    <Text>Than tiêu thụ</Text>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.thanTieuThu?.toLocaleString('vi-VN')}</Text>
                        <View style={{width: 48}}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10, marginTop: -8}}> (Tấn)</Text>
                        </View>  
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 32, paddingTop: 20}}>
                    <Text>Suất hao nhiệt</Text>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.suatHaoNhiet?.toLocaleString('vi-VN')}</Text>
                        <View style={{width: 48}}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10, marginTop: -8}}> (kj/kWh)</Text>
                        </View>  
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 32, paddingTop: 20}}>
                    <Text>Suất hao kế hoạch</Text>
                    <View style={{ flexDirection: 'row'}}>
                      <View>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.suatHaoKH?.toLocaleString('vi-VN')}</Text>
                      </View>
                      <View style={{width: 48}}>
                        <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}> </Text>
                      </View>  
                    </View>
                  </View>
                </View>
              </View>)}
          </Animated.ScrollView>
          </View>
        )}
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
    //paddingLeft: 8,
    //paddingRight: 8,
    //justifyContent: 'space-between',
    //borderTopLeftRadius: 12,
    //borderTopRightRadius: 12,
  },
  selectedNM: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f2f1f6',
    justifyContent: 'space-between',
    padding: 2,
  },
  highchar: {
    backgroundColor: '#f2f1f6',
    justifyContent: 'center',
    flex: 1,
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
  boxShowFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 4,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtGroup: {
    color: COLOR.HEARDER,
    padding: 8,
  },
  txtDonvi: {
    color: COLOR.HEARDER,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'right',
  },
  item_tomay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  item_tomay_focus: {
    flex: 1,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
});
