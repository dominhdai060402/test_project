import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {
  Appearance,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {COLOR} from '../../../env/config';
import {LoadingView} from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {Appstyles} from '../../styles/AppStyle';
import {renderFullDate2} from '../../../util/format';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;
const http = new CommonHttp();

const FirstRoute = props => (
  <ScrollView
    style={{flex: 1, padding: 8}}
    showsVerticalScrollIndicator={false}>
    {props.data ? (
      <View style={{flex: 1}}>
        <View>
          <Text style={{padding: 8}}>
            Tổ máy: {props.data?.tenToMay} Trạng thái thiết bị:{' '}
            {props.data?.trangThaiThietBi}
          </Text>
          <Text style={{padding: 8}}>
            Thời gian: {format(new Date(props.data?.thoiGian), 'dd-MM-yyyy')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 8,
          }}>
          <View style={{width: '70%'}}>
            <Text style={{fontWeight: 'bold'}}>Tín hiệu</Text>
          </View>
          <View style={{width: '30%'}}>
            <Text style={{textAlign: 'right', fontWeight: 'bold'}}>
              Giá trị
            </Text>
          </View>
        </View>
        {/* value data */}
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Điểm do Genco1 lưu lượng</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.diemDoGenco1LuuLuong}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Điểm đo Genco2 nhiệt độ</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.diemDoGenco2NhietDo}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Điểm đo Genco3 SO2</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.diemDoGenco3SO2}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Điểm đo Genco4 NOx</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.diemDoGenco4NOx}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Điểm đo Genco5 nồng độ bụi</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.diemDoGenco5NongDoBui}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải lưu lượng</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramKhiThaiLuuLuong}
            </Text>
          </View>
        </View>
        {/** aaa */}
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải NOx</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramKhiThaiNOx}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải nhiệt độ</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramKhiThaiNhietDo}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải nồng độ bụi</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramKhiThaiNongDoBui}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải O2</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>{props.data.tramKhiThaiO2}</Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm khí thải SO2</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramKhiThaiSO2}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nhiệt độ</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>{props.data.tramNhietDo}</Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải CLO</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramNuocThaiCLO}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải COD</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramNuocThaiCOD}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải DO</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramNuocThaiDO}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải Q</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>{props.data.tramNuocThaiQ}</Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải TSS</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramNuocThaiTSS}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}>
          <View style={{width: '60%'}}>
            <Text>Trạm nước thải pH</Text>
          </View>
          <View style={{width: '40%'}}>
            <Text style={{textAlign: 'right'}}>
              {props.data.tramNuocThaipH}
            </Text>
          </View>
        </View>
        <View style={styles.rowInfor}></View>
      </View>
    ) : (
      <View style={{flex: 1}}>
        <Text>Không có dữ liệu</Text>
      </View>
    )}
  </ScrollView>
);

const SecondRoute = props => (
  <ScrollView style={{flex: 1, padding: 8}}>
    {props.thongSo && (
      <View style={{flex: 1, paddingBottom: 4}}>
        <View style={styles.vBoxchitiet}>
          <View style={{width: '20%'}}>
            <Text style={{fontWeight: 'bold',fontSize: 12}}>Thông số</Text>
          </View>
          <View style={{width: '20%'}}>
            <Text style={{fontWeight: 'bold',fontSize: 12}}>Thời điểm</Text>
          </View>
          <View style={{width: '20%'}}>
            <Text style={{fontWeight: 'bold', textAlign: 'right',fontSize: 12}}>
              Giá trị
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <Text style={{textAlign: 'right', fontWeight: 'bold',fontSize: 12}}>Max</Text>
          </View>
          <View style={{width: '20%'}}>
            <Text style={{textAlign: 'right', fontWeight: 'bold',fontSize: 12}}>Min</Text>
          </View>
        </View>
        {/* ****************************** */}
        {props.thongSo.map((item, index) => (
          <View style={styles.vBoxchitiet} key={index}>
            <View style={{width: '20%'}}>
              <Text style={{fontSize: 12}}>{item.thongSo}</Text>
            </View>
            <View style={{width: '20%'}}>
              <Text style={{fontSize: 12}}>{renderFullDate2(item.thoiDiem)}</Text>
            </View>
            <View style={{width: '20%'}}>
              <Text style={{textAlign: 'right',fontSize: 12}}>
                {item.giaTri?.toLocaleString('vi-VN')}
              </Text>
            </View>
            <View style={{width: '20%'}}>
              <Text style={{textAlign: 'right',fontSize: 12}}>{item.giaTriMax?.toLocaleString('vi-VN')}</Text>
            </View>
            <View style={{width: '20%'}}>
              <Text style={{textAlign: 'right',fontSize: 12}}>{item.giaTriMin?.toLocaleString('vi-VN')}</Text>
            </View>
          </View>
        ))}
      </View>
    )}
  </ScrollView>
);

const ThreeRoute = () => <View style={{flex: 1, padding: 8}} />;

export function ChitieMTtnhamay(props) {
  const layout = useWindowDimensions();
  const item = props.route.params.nhamay;
  const donvi = props.route.params.donvi;
  const ngayxem = props.route.params.ngayxem;

  const [allState, setAllState] = useState({
    loading: true,
    ngayxem: `${ngayxem}`,
    isDate: false,
    //date: new Date(),
    dataNhamay: [],
    dataNhamayNam: [],
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Dữ liệu chi tiết'},
    // {key: 'second', title: 'Dữ liệu năm'},
    // { key: 'three', title: 'Đồ thị xu thế' },
  ]);

  useEffect(() => {
    const onInit = async () => {
      //, allState.date
      fetchData(allState.ngayxem);
    };
    onInit();
  }, []);

  const fetchData = async (ngayxem) => {
    let dataNhamay = [];
    let dataNhamayNam = [];
    setAllState({
      ...allState,
      loading: true,
      isDate: false,
      ngayxem,
    });

    await http
      .post(TtdURL.GetChiTietMoiTruongNgay(), {
        MaTomay: item.maTomay,
        ngay: ngayxem,
      })
      .then(res => {
        const data = res.data;
        const donvi = props.route.params.donvi;
        if (data) {
          dataNhamay = data;
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });
    if (dataNhamay && dataNhamay.length > 0) {
      const datangay = dataNhamay.filter(
        item => item.tenNhaMay === donvi.tenNhaMay,
      );
      if (datangay) {
        const itemts = datangay[0]?.tram.filter(a => a.tenTram === item.tenTram);
        if (itemts) {
          const thongSos = itemts[0].thongSo;
          //console.log('thongSos thongSos:', thongSos);
          item.thongSo.map((a, index) => {
            thongSos.map((b,index)=>{
              if(a.thongSo === b.thongSo){
                a.giaTriMax = b.giaTriMax;
                a.giaTriMin = b.giaTriMin;
              }
            });
          });
        }
      }
      //console.log(datangay);
      //console.log(donvi);
    }
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    // await http
    //   .post(TtdURL.GetChiTietMoiTruongNam(), {
    //     MaTomay: item.maTomay,
    //     Thang: month,
    //     Nam: year,
    //   })
    //   .then(res => {
    //     const data = res.data;
    //     if (data) {
    //       dataNhamayNam = data;
    //     }
    //   })
    //   .catch(err => {});
    setAllState({
      ...allState,
      loading: false,
      dataNhamay,
      dataNhamayNam,
      isDate: false,
      ngayxem,
    });
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

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <SecondRoute thongSo={item.thongSo} />;
      case 'second':
        return <FirstRoute item={item} data={allState.dataNhamay[0]} />;
      default:
        return <ThreeRoute />;
    }
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        <View style={{flex: 1}}>
          <View style={styles.vlegend}>
            <Icon
              name={'industry-alt'}
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
              {donvi.tenNhaMay} - {item.tenTram}
            </Text>
          </View>
          <Text style={{textAlign: 'center'}}>{item.loaiTram}</Text>
          {allState.loading ? (
            <LoadingView />
          ) : (
            <View style={{flex: 1, paddingTop: 8}}>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
                renderTabBar={props => (
                  <TabBar
                    {...props}
                    renderLabel={({route, color}) => (
                      <Text style={{color: 'black'}}>{route.title}</Text>
                    )}
                    style={{backgroundColor: 'white'}}
                    indicatorStyle={{backgroundColor: 'red'}}
                  />
                )}
              />
            </View>
          )}
        </View>
      </View>
      <DateTimePickerModal
        headerTextIOS="Chọn tháng năm"
        isVisible={allState.isDate}
        mode="date"
        isDarkModeEnabled={isDark}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
  vBoxchitiet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingBottom: 4,
    paddingTop: 4,
    borderColor: COLOR.LIGHT_GREY,
  },
  boxShowFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 8,
    padding: 4,
  },
  boxShowFooterSub: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 24,
    marginRight: 8,
    padding: 4,
  },
  rowInfor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});
