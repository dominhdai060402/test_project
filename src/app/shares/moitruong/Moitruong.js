import {format, formatRelative, formatDistance} from 'date-fns';
import viLocale from "date-fns/locale/vi";
import _ from 'lodash';
import {FlatList, NativeBaseProvider} from 'native-base';
import React, {useEffect, useState, useLayoutEffect} from 'react';
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
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLOR} from '../../../env/config';
import {ListEmpty, LoadingView, Separator} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {Appstyles} from '../../styles/AppStyle';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import {Stylescs} from '../thitruongdien/Stylescs';
import { numberFormat } from '../../../util/format';

const width = Dimensions.get('window').width;
const http = new CommonHttp();
let loaitram = '';
export function Moitruong(props) {
  const [allState, setAllState] = useState({
    loading: true,
    listNhamay: [],
    idNhamay: null,
    dataNhamay: [],
    scrollToIndex: 0,
  });
  const [ref, setRef] = useState(null);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 14}}>
            Môi trường
          </Text>
          <Text style={{color: '#000', fontSize: 12}}>
            Thông tin khói thải, nước thải
          </Text>
        </View>
      ),
    });
  }, [props.navigation, allState]);

  useEffect(() => {
    const onInit = async () => {
      fetchData(allState.scrollToIndex);
    };
    onInit();
  }, []);

  const fetchData = async (scrollToIndex) => {
    let listNhamay = [];
    let idNhamay = null;
    let dataNhamay = null;
    setAllState({
      ...allState,
      loading: true,
    });

    await http
      .get(SanluongURL.GetDanhSachThongTinNhaMay())
      .then(res => {
        const data = res.data;
        //console.log('data:', data);
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
    //console.log('data:', listNhamay);

    await http.post(SanluongURL.GetThongTinMoiTruongNgayOnline(),{
      IdNhaMay: idNhamay
    }).then((res)=>{
      dataNhamay = res.data[0];
      //console.log('dataNhamay:', dataNhamay);
    }).catch((errer)=>{
      
    })
    
    setAllState({
      ...allState,
      loading: false,
      listNhamay,
      idNhamay,
      dataNhamay
    });

    if (ref && scrollToIndex !== -1) {
      ref.scrollTo({
        x: (width / 6) * scrollToIndex,
        y: 0,
        animated: true,
      });
    }
  };

  const onChangeNhamay = async(item, index) => {
    //setAllState({ ...allState, idNhamay: item.idNhaMay});
    loaitram = '';
    let dataNhamay = {};
    await http.post(SanluongURL.GetThongTinMoiTruongNgayOnline(),{
      IdNhaMay: item.idNhaMay
    }).then((res)=>{
      dataNhamay = res.data[0];
      let trams = dataNhamay.tram;
      const ntrams = _.orderBy(trams, ['loaiTram'], ['desc']);
      dataNhamay.tram = ntrams;
    }).catch((errer)=>{
      
    })

    //console.log('data:', dataNhamay);
    setAllState({ ...allState, idNhamay: item.idNhaMay, dataNhamay});
    if (ref && index !== -1) {
      ref.scrollTo({
        x: (width/6) * index,
        y: 0,
        animated: true,
      });
    }
  };

  const  onSwipeLeft =(gestureState, listNhamay, idNhamay)=>{
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
  const  onSwipeRight =(gestureState, listNhamay, idNhamay)=>{
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
            // if (y >= 0) {
            //   this.props.onSwipePerformed('down');
            // } else {
            //   this.props.onSwipePerformed('up');
            // }
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
                {allState.listNhamay.map((item, index) => (
                  <View key={index} style={styles.selectedNM}>
                    <TouchableOpacity onPress={() => onChangeNhamay(item, -1)}>
                      <Text
                        style={
                          allState.idNhamay === item.idNhaMay
                            ? styles.item_time_focus
                            : styles.item_time
                        }>
                        {item.ten}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <ScrollView {...panResponder.panHandlers} style={{flex: 1}}>
            {allState.dataNhamay.tram?.map((item, index)=>{
              let showtram = false;
              if(item.loaiTram !== loaitram){
                loaitram = item.loaiTram;
                showtram = true;
              }
              return (

              
            <View>
              {showtram && (
                <View style={Stylescs.headerG1}>
              <Text style={{padding: 8}}>{item.loaiTram}</Text>
            </View>
              )}
            <View key={index} style={{margin: 8 ,padding: 16, backgroundColor: '#f2f1f6', borderRadius: 8}}>
                <Text>{item.tenTram}</Text>
                {item?.thongSo.map((sub, subkey)=>(
                  <View key={subkey} style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>{sub.thongSo}</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>{formatDistance(new Date(sub.thoiDiem), new Date(), { addSuffix: true, locale: viLocale })}</Text>
                    </View>
                    <View style={{width: 96}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>{numberFormat(sub.giaTri)}</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>{sub.donViTinh}</Text>
                    </View>
                </View>
                ))}
                
                {/* <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>PH</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>Lưu lượng</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>m³/h   </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>Clo dư</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View> */}
            </View>
            </View>
           )})}
            {/* <View style={Stylescs.headerG1}>
              <Text style={{padding: 8}}>Trạm khí thải</Text>
            </View>
            

            <View style={{margin: 8,padding: 16, backgroundColor: '#f2f1f6', borderRadius: 8}}>
            <Text>Tổ máy 1</Text>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>Nồng độ bụi</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>độ C</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>Lưu lượng</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>LNOx</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>m³/h   </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>O2</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>O2</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>SO2</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 8, paddingBottom: 8}}>
                    <View style={{flex: 2}}>
                        <Text>Nhiệt độ</Text>
                        <Text style={{fontSize: 10, color: '#677278'}}>30 phút trước</Text>
                    </View>
                    <View style={{width: 64}}>
                        <Text style={{color: '#407CCC', textAlign: 'right'}}>50</Text>
                    </View>
                    <View style={{width: 64}}>
                    <Text style={{fontSize: 10, color: '#677278', textAlign: 'right', marginTop: 4}}>mg/Nm³</Text>
                    </View>
                </View>
            </View> */}
            </ScrollView>
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
    //borderWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    color: '#545456',
    padding: 8,
  },
  item_time_focus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#000',
    padding: 8,
  },
});
