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
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import { Appstyles } from '../../styles/AppStyle';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { format } from 'date-fns';


const width = Dimensions.get('window').width
export function ChitietTD(props) {
  const http = new CommonHttp();
  const ngayXem = props.route.params.ngayXem;
  const [allState, setAllState] = useState({
    loading: true,
    loadingNM: false,
    listNhamay: [],
    idNhamay: null,
    dataNhamay: null,
    strNgay: format(ngayXem, 'dd-MM-yyyy'),
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
      headerTitle: () => (
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 14 }}>BCSX Khối thủy điện</Text>
          <Text style={{ fontSize: 12}}>Ngày: {allState.strNgay}</Text>
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
    let listNhamay = [];
    let dataNhamay = null;
    await http
      .get(SanluongURL.GetDanhSachThongTinNhaMay())
      .then(res => {
        const data = res.data;
        data.map((item, index) => {
          if (item.idLoaiNhaMay === 1) {
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

    const data = {
      IdNhaMay: idNhamay,
      NgayDieuKien: format(ngayXem, 'yyyy-MM-dd')
    };
    await http.post(SanluongURL.GetBaoCaoSanXuatNhaMayThuyDien(), data).then((res) => {
      dataNhamay = res.data.result;
      const tongTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
      dataNhamay.tongTyle = tongTyle;
     

    }).catch((err) => {
      console.log(err);
    });

    setAllState({ ...allState, loading: false, listNhamay, idNhamay, dataNhamay })
  };

  const loadDataNhamay = async (idNhamay, scrollToIndex) => {
    let dataNhamay = null;
    scrollToIndex = allState.listNhamay.findIndex(item => item.idNhaMay === idNhamay);
    setAllState({ ...allState, idNhamay, loadingNM: true });
    await http.post(SanluongURL.GetBaoCaoSanXuatNhaMayThuyDien(), {
      IdNhaMay: idNhamay,
      NgayDieuKien: format(ngayXem, 'yyyy-MM-dd')
    }).then((res) => {
      dataNhamay = res.data.result;
     
      const tongTyle = (dataNhamay.sanLuongDauCucNam / dataNhamay.sanLuongDauCucKeHoach) * 100;
      dataNhamay.tongTyle = tongTyle;
      

    }).catch((err) => {
      console.log(err);
    });
    setAllState({ ...allState, loadingNM: false ,dataNhamay , idNhamay });
    if (ref && scrollToIndex !== -1) {
      ref.scrollTo({
        x: (width/6) * scrollToIndex,
        y: 0,
        animated: true,
      });
    }
  }

  const onSwipeLeft = (gestureState, listNhamay, idNhamay) => {
    let index = listNhamay.findIndex(item => item.idNhaMay === idNhamay);
    let next = null;
    if (index < listNhamay.length - 1) {
      index = index + 1;
      next = listNhamay[index];
    } else {
      index = 0;
      next = listNhamay[0];
    }
    loadDataNhamay(next.idNhaMay,index);
  };

  const onSwipeRight = (gestureState, listNhamay, idNhamay) => {
    let index = listNhamay.findIndex(item => item.idNhaMay === idNhamay);
    let next = null;
    if (index > 0) {
      index = index - 1;
      next = listNhamay[index];
    } else {
      index = listNhamay.length - 1;
      next = listNhamay[index];
    }
    loadDataNhamay(next.idNhaMay,index);
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
            <View style={styles.khoiItem}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={ref => {
              setRef(ref);
            }}>
                  <View style={styles.khoiItem}>
                    {
                      allState.listNhamay.map((item, index) => (
                        <View style={styles.selectedNM} key={index}>
                          <TouchableOpacity  onPress={() => loadDataNhamay(item.idNhaMay, -1)}>
                            <Text style={allState.idNhamay === item.idNhaMay ? styles.item_time_focus : styles.item_time}>{item.ten}</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    }
                  </View>
                </ScrollView>
              </View>
          
              <Animated.ScrollView showsVerticalScrollIndicator={false}
            style={{flex: 1, paddingBottom: 8}}
            {...panResponder.panHandlers}>
          
              {/* Khối nhiệt điện */}
              
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
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataNhamay.tongTyle > 100 ? 100 : allState.dataNhamay.tongTyle}%`, backgroundColor: '#007549', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{allState.dataNhamay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataNhamay.tongTyle < 25 ? 25 : allState.dataNhamay.tongTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{allState.dataNhamay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataNhamay.tongTyle < 25 ? 25 : allState.dataNhamay.tongTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{allState.dataNhamay.tongTyle?.toLocaleString('vi-VN')} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', height: 56, justifyContent: 'space-between', marginTop: 24, marginBottom: 8 }}>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 8, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Ngày: </Text>
                      <Text style={{color:'#007549', fontWeight: 'bold'}}>{allState.dataNhamay.sanLuongDauCucNgay?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 8, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Tháng: </Text>
                      <Text style={{color: '#007549', fontWeight: 'bold'}}>{allState.dataNhamay.sanLuongDauCucThang?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', marginLeft: 8, marginRight: 8, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Năm: </Text>
                      <Text style={{color: '#007549', fontWeight: 'bold'}}>{allState.dataNhamay.sanLuongDauCucNam?.toLocaleString('vi-VN')}</Text>
                    </View>
                  </View>
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
                        <Text style={{color: '#007549', fontWeight: 'bold'}}>{allState.dataNhamay.pmax?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, borderLeftWidth: 0.5}}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 32 }}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>MW</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 48 }}>
                        <Text>Pmin: </Text>
                        <Text style={{color: '#007549', fontWeight: 'bold'}}>{allState.dataNhamay.pmin?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ height: 116, margin: 8, borderRadius: 8, backgroundColor: '#f2f1f6' }}>
                  <View style={{padding: 8}}>
                    <Text>Mực nước hồ</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>MNC</Text>
                      <Text style={{color: '#007549', fontWeight: 'bold', paddingBottom: 8, paddingTop: 8}}>{allState.dataNhamay.mucNuocChet}</Text>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mét</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>MNDBT</Text>
                      <Text style={{color: '#007549', fontWeight: 'bold', paddingBottom: 8, paddingTop: 8}}>{allState.dataNhamay.mucNuocDangBinhThuong}</Text>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mét</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>MNQT</Text>
                      <Text style={{color: '#007549', fontWeight: 'bold', paddingBottom: 8, paddingTop: 8}}> {allState.dataNhamay.mucNuocQT}</Text>
                      <Text style={{color: COLOR.LIGHT_GREY, fontSize: 10}}>mét</Text>
                    </View>
                  </View>
                </View>

                <View style={{ height: 124, margin: 8, borderRadius: 8, backgroundColor: '#f2f1f6' }}>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingTop: 8}}>
                    <View style={{flex: 1, borderRightWidth: 0.5}}>
                      <View style={{padding: 8, alignItems: 'center'}}>
                        <Text>Mực nước</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 18 }}>
                        <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>mét</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 32 }}>
                        <Text>0h00’: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.mucNuoc0h?.toLocaleString('vi-VN')}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 18 }}>
                        <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>mét</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 32 }}>
                        <Text>24h00’: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.mucNuoc24h?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, borderLeftWidth: 0.5}}>
                      <View style={{padding: 8, alignItems: 'center'}}>
                        <Text>Lưu lượng</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 18 }}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>m³/s</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 32 }}>
                        <Text>Về hồ: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.luuLuongNuocVeHo?.toLocaleString('vi-VN')}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 18 }}>
                          <Text style={{color: COLOR.LIGHT_GREY, fontSize: 11}}>m³/s</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 32 }}>
                        <Text>Chạy máy: </Text>
                        <Text style={{color: COLOR.GOOG_BLUE, fontWeight: 'bold'}}>{allState.dataNhamay.luuLuongNuocChayMay?.toLocaleString('vi-VN')}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              )}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
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
});
