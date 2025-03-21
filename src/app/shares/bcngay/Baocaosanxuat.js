import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Appearance, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import Icon from 'react-native-fontawesome-pro';
import { COLOR } from '../../../env/config';
import { LoadingView } from '../../components/Components';
import CommonHttp from '../../services/commonHttp';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { Appstyles } from '../../styles/AppStyle';
import { BaocaoSX } from './chartOptions';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import { format, subDays } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { numberFormat } from '../../../util/format';

const isDark = Appearance.getColorScheme() === 'dark' ? true : false;


export function Baocaosanxuat({ navigation }) {
  const http = new CommonHttp();
  const [allState, setAllState] = useState({
    loading: true,
    slNhamay: {
      nhietDien: 0,
      thuyDien: 0,
    },
    dataND: null,
    dataTD: null,
    timeFocusND: 'D',
    timeFocusTD: 'D',
    chartOptions: {},
    chartOptionsTD: {},
    loadPieND: false,
    loadPieTD: false,
    isDatePicker: false,
    ngayXem: subDays(new Date(), 1),
    strNgay: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    dataTotal: {
      tongKH: 0,
      tongTH: 0,
      tongtyle: 0,
      tongngay: 0,
      tongthang: 0,
      tongnam: 0,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => onChongay()}>
          <Icon name={'calendar-alt'} color={'#000'} size={20} type="light" containerStyle={{ paddingRight: 16 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14 }}>Báo cáo SX</Text>
          <Text style={{ color: '#000', fontSize: 11}}>Ngày: {allState.strNgay}</Text>
        </View>
      )
    });

  }, [navigation, allState]);


  useEffect(() => {
    const onInit = async () => {
      fetchData(allState.ngayXem, allState.strNgay, allState.isDatePicker);
    };
    onInit();
  }, []);

  const fetchData = async (ngayXem, strNgay, isDatePicker) => {
    let dataTotal = {
      tongKH: 0,
      tongTH: 0,
      tongtyle: 0,
      tongngay: 0,
      tongthang: 0,
      tongnam: 0,
    };
    let chartOptions = BaocaoSX.chartOptions;
    let chartOptionsTD = BaocaoSX.chartOptionsTD;
    let dataND = null;
    let dataTD = null;
    let slNhamay = {
      nhietDien: 0,
      thuyDien: 0,
    };
    let series = [{
      name: 'Tỷ lệ ',
      data: [{
        name: 'Cty trực thuộc',
        y: 61.41,
      }, {
        name: 'Cty liên kết',
        y: 11.84
      }]
    }];

    let seriesTD = [{
      name: 'Tỷ lệ ',
      data: [{
        name: 'Cty trực thuộc',
        y: 61.41,
      }, {
        name: 'Cty liên kết',
        y: 11.84
      }]
    }];
    await http
      .get(SanluongURL.GetDanhSachThongTinNhaMay())
      .then(res => {
        const data = res.data;
        data.map((item, index) => {
          if (item.idLoaiNhaMay === 1) {
            slNhamay.nhietDien += 1;
          } else {
            slNhamay.thuyDien += 1;
          }
        });
      })
      .catch(err => {
      });
    await http
      .post(SanluongURL.GetBaoCaoSanXuat(), {
        IdLoaiHinh: 2,
        NgayDieuKien: format(ngayXem, 'yyyy-MM-dd')
      })
      .then(res => {
        const data = res.data;
        //console.log('AAAAAAAAAAAA:', data);
        dataND = data;

        dataTotal.tongKH = dataND.tongSanLuongDauCucTheoKhoiKeHoach;
        dataTotal.tongTH = dataND.tongSanLuongDauCucTheoKhoiNam;
        //dataTotal.tongtyle = 0;
        dataTotal.tongngay = dataND.tongSanLuongDauCucTheoKhoiNgay;
        dataTotal.tongthang = dataND.tongSanLuongDauCucTheoKhoiThang;
        dataTotal.tongnam = dataND.tongSanLuongDauCucTheoKhoiNam;

        dataND.timeTT = dataND.tongSanLuongDauCucTrucThuocNgay;
        dataND.timeLK = dataND.tongSanLuongDauCucLienKetNgay;

        const tongTyle = (dataND.tongSanLuongDauCucTheoKhoiNam / dataND.tongSanLuongDauCucTheoKhoiKeHoach) * 100;
        const trucTTyle = (dataND.tongSanLuongDauCucTrucThuocNam / dataND.tongSanLuongKeHoachTrucThuoc) * 100;
        const lienKTyle = (dataND.tongSanLuongDauCucLienKetNam / dataND.tongSanLuongKeHoachLienKet) * 100;
        dataND.tongTyle = tongTyle;
        dataND.trucTTyle = trucTTyle;
        dataND.lienKTyle = lienKTyle;

        series[0].data[0].y = dataND.tongSanLuongDauCucTrucThuocNgay;
        series[0].data[1].y = dataND.tongSanLuongDauCucLienKetNgay;

        chartOptions.title.text = `tr.kWh<br>${dataND.tongSanLuongDauCucTheoKhoiNgay?.toFixed(1)}`
        chartOptions.series = series;

      })
      .catch(err => {
      });
    await http
      .post(SanluongURL.GetBaoCaoSanXuat(), {
        IdLoaiHinh: 1,
        NgayDieuKien: format(ngayXem, 'yyyy-MM-dd'),
      })
      .then(res => {
        const data = res.data;
        dataTD = data;

        dataTotal.tongKH = dataTotal.tongKH + dataTD.tongSanLuongDauCucTheoKhoiKeHoach;
        dataTotal.tongTH = dataTotal.tongTH + dataTD.tongSanLuongDauCucTheoKhoiNam;
        //dataTotal.tongtyle = 0;
        dataTotal.tongngay = dataTotal.tongngay + dataTD.tongSanLuongDauCucTheoKhoiNgay;
        dataTotal.tongthang = dataTotal.tongthang + dataTD.tongSanLuongDauCucTheoKhoiThang;
        dataTotal.tongnam = dataTotal.tongnam + dataTD.tongSanLuongDauCucTheoKhoiNam;
        //data tong tyle 
        dataTotal.tongtyle = (dataTotal.tongTH / dataTotal.tongKH) * 100;


        dataTD.timeTT = dataTD.tongSanLuongDauCucTrucThuocNgay;
        dataTD.timeLK = dataTD.tongSanLuongDauCucLienKetNgay;

        const tongTyle = (dataTD.tongSanLuongDauCucTheoKhoiNam / dataTD.tongSanLuongDauCucTheoKhoiKeHoach) * 100;
        const trucTTyle = (dataTD.tongSanLuongDauCucTrucThuocNam / dataTD.tongSanLuongKeHoachTrucThuoc) * 100;
        const lienKTyle = (dataTD.tongSanLuongDauCucLienKetNam / dataTD.tongSanLuongKeHoachLienKet) * 100;
        dataTD.tongTyle = tongTyle;
        dataTD.trucTTyle = trucTTyle;
        dataTD.lienKTyle = lienKTyle;

        seriesTD[0].data[0].y = dataTD.tongSanLuongDauCucTrucThuocNgay;
        seriesTD[0].data[1].y = dataTD.tongSanLuongDauCucLienKetNgay;

        chartOptionsTD.title.text = `tr.kWh<br>${dataTD.tongSanLuongDauCucTheoKhoiNgay?.toFixed()}`
        chartOptionsTD.series = seriesTD;

      })
      .catch(err => {
      });
    setAllState({ ...allState, dataTotal, loading: false, chartOptions, chartOptionsTD, slNhamay, dataND, dataTD, ngayXem, strNgay, isDatePicker })
  };

  const onChangeTimeND = (timeFocusND) => {
    setAllState({ ...allState, loadPieND: true });
    const renderPie = () => {
      let dataND = allState.dataND;
      let chartOptions = BaocaoSX.chartOptions;
      let series = [{
        name: 'Tỷ lệ ',
        data: [{
          name: 'Cty trực thuộc',
          y: 61.41,
        }, {
          name: 'Cty liên kết',
          y: 11.84
        }]
      }];
      if (timeFocusND === 'D') {
        series[0].data[0].y = dataND.tongSanLuongDauCucTrucThuocNgay;
        series[0].data[1].y = dataND.tongSanLuongDauCucLienKetNgay;
        chartOptions.title.text = `tr.kWh<br>${dataND.tongSanLuongDauCucTheoKhoiNgay.toFixed(1)}`;

        dataND.timeTT = dataND.tongSanLuongDauCucTrucThuocNgay;
        dataND.timeLK = dataND.tongSanLuongDauCucLienKetNgay;
      } else if (timeFocusND === 'M') {
        series[0].data[0].y = dataND.tongSanLuongDauCucTrucThuocThang;
        series[0].data[1].y = dataND.tongSanLuongDauCucLienKetThang;
        chartOptions.title.text = `tr.kWh<br>${dataND.tongSanLuongDauCucTheoKhoiThang?.toFixed(1)}`;

        dataND.timeTT = dataND.tongSanLuongDauCucTrucThuocThang;
        dataND.timeLK = dataND.tongSanLuongDauCucLienKetThang;
      } else {
        series[0].data[0].y = dataND.tongSanLuongDauCucTrucThuocNam;
        series[0].data[1].y = dataND.tongSanLuongDauCucLienKetNam;
        chartOptions.title.text = `tr.kWh<br>${dataND.tongSanLuongDauCucTheoKhoiNam?.toFixed(1)}`;

        dataND.timeTT = dataND.tongSanLuongDauCucTrucThuocNam;
        dataND.timeLK = dataND.tongSanLuongDauCucLienKetNam;
      }
      chartOptions.series = series;
      setAllState({ ...allState, loadPieND: false, chartOptions, dataND, timeFocusND });
    }
    setTimeout(renderPie, 1);
  }

  const onChangeTimeTD = (timeFocusTD) => {
    setAllState({ ...allState, loadPieTD: true });
    const renderPie = () => {
      let dataTD = allState.dataTD;
      let chartOptionsTD = BaocaoSX.chartOptionsTD;
      let series = [{
        name: 'Tỷ lệ ',
        data: [{
          name: 'Cty trực thuộc',
          y: 61.41,
        }, {
          name: 'Cty liên kết',
          y: 11.84
        }]
      }];
      if (timeFocusTD === 'D') {
        series[0].data[0].y = dataTD.tongSanLuongDauCucTrucThuocNgay;
        series[0].data[1].y = dataTD.tongSanLuongDauCucLienKetNgay;
        chartOptionsTD.title.text = `tr.kWh<br>${dataTD.tongSanLuongDauCucTheoKhoiNgay?.toFixed(1)}`;

        dataTD.timeTT = dataTD.tongSanLuongDauCucTrucThuocNgay;
        dataTD.timeLK = dataTD.tongSanLuongDauCucLienKetNgay;
      } else if (timeFocusTD === 'M') {
        series[0].data[0].y = dataTD.tongSanLuongDauCucTrucThuocThang;
        series[0].data[1].y = dataTD.tongSanLuongDauCucLienKetThang;
        chartOptionsTD.title.text = `tr.kWh<br>${dataTD.tongSanLuongDauCucTheoKhoiThang?.toFixed(1)}`;

        dataTD.timeTT = dataTD.tongSanLuongDauCucTrucThuocThang;
        dataTD.timeLK = dataTD.tongSanLuongDauCucLienKetThang;
      } else {
        series[0].data[0].y = dataTD.tongSanLuongDauCucTrucThuocNam;
        series[0].data[1].y = dataTD.tongSanLuongDauCucLienKetNam;
        chartOptionsTD.title.text = `tr.kWh<br>${dataTD.tongSanLuongDauCucTheoKhoiNam?.toFixed(1)}`;

        dataTD.timeTT = dataTD.tongSanLuongDauCucTrucThuocNam;
        dataTD.timeLK = dataTD.tongSanLuongDauCucLienKetNam;
      }
      chartOptionsTD.series = series;
      setAllState({ ...allState, loadPieTD: false, chartOptionsTD, dataTD, timeFocusTD });
    }
    setTimeout(renderPie, 1);
  }

  const onChongay = () => {
    setAllState({ ...allState, isDatePicker: true });
  }


  const hideDatePicker = () => {
    setAllState({ ...allState, isDatePicker: false });
  };

  const handleConfirm = date => {
    const sDate = format(date, 'dd-MM-yyyy');
    setAllState({ ...allState, loading: true, isDatePicker: false, ngayXem: date, strNgay: sDate });
    if (sDate !== allState.strNgay) {
      fetchData(date, sDate, false);
    }
  };

  return (
    <SafeAreaView style={Appstyles.screen}>
      <View style={Appstyles.container}>
        {allState.loading ? (
          <LoadingView />
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>

              {/* Tong HOP */}
              <View style={styles.khoitotal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name={'waveform-path'} color={COLOR.RED} size={16} type="light" containerStyle={{ paddingRight: 8 }} />
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Genco1</Text>
                </View>
              </View>

              <View style={styles.total}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: '#F75C1E' }}>{numberFormat(allState.dataTotal.tongKH)}</Text></View>
                  <Text style={{ color: COLOR.LIGHT_GREY, textAlign: 'left', fontSize: 11 }}> Tr.kWh</Text>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold', color: COLOR.GOOG_BLUE }}>{numberFormat(allState.dataTotal.tongTH)}</Text>
                    <Text style={{ color: COLOR.LIGHT_GREY, textAlign: 'left', fontSize: 11 }}> Tr.kWh</Text>
                  </View>
                </View>
                <View style={{ height: 4, backgroundColor: '#FEC9B7', borderRadius: 4, marginTop: 8 }}>
                  <View style={{ height: 4, backgroundColor: '#BBA1D3', borderRadius: 4, width: `${allState.dataTotal.tongtyle}%` }}></View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                  <Text style={{ color: COLOR.GOOG_BLUE }}>{numberFormat(allState.dataTotal.tongtyle)} %</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', borderRadius: 8, padding: 8, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{ color: COLOR.LIGHT_GREY }}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Ngày: </Text>
                      <Text style={{ color: COLOR.GOOG_BLUE, fontWeight: 'bold' }}>{numberFormat(allState.dataTotal.tongngay)}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#f2f1f6', justifyContent: 'center', borderRadius: 8, padding: 8, marginLeft: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text style={{ color: COLOR.LIGHT_GREY }}>Tr.kWh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }}>
                      <Text>Tháng: </Text>
                      <Text style={{ color: COLOR.GOOG_BLUE, fontWeight: 'bold' }}>{numberFormat(allState.dataTotal.tongthang)}</Text>
                    </View>
                  </View>
                </View>

              </View>

              {/* Khối nhiệt điện */}
              <TouchableOpacity style={styles.khoiItem} onPress={() => navigation.navigate('ChitietND', { ngayXem: allState.ngayXem })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name={'industry-alt'} color={COLOR.RED} size={16} type="light" containerStyle={{ paddingRight: 8 }} />
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Khối nhiệt điện</Text>
                  <Badge status="primary" containerStyle={{ top: -5, right: -5, }} value={allState.slNhamay?.nhietDien} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: COLOR.GOOG_BLUE }}>Chi tiết</Text>
                  <Icon name={'angle-right'} color={COLOR.GOOG_BLUE} size={16} type="light" containerStyle={{ paddingLeft: 8 }} />
                </View>
              </TouchableOpacity>

              <View style={{ flex: 1, paddingTop: 24 }}>
                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataND.tongSanLuongDauCucTheoKhoiKeHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Tổng</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#86abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataND.tongTyle}%`, backgroundColor: '#3f7ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucTheoKhoiNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataND.tongTyle < 30 ? 30 : allState.dataND.tongTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucTheoKhoiNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataND.tongTyle < 20 ? 20: allState.dataND.tongTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#3f7ccc' }}>
                        {numberFormat(allState.dataND.tongTyle)} %
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 64, paddingTop: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataND.tongSanLuongKeHoachTrucThuoc)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Trực thuộc</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#86abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataND.trucTTyle}%`, backgroundColor: '#3f7ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucTrucThuocNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataND.trucTTyle < 30 ? 35 : allState.dataND.trucTTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucTrucThuocNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataND.trucTTyle < 25 ? 25: allState.dataND.trucTTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#3f7ccc' }}>{numberFormat(allState.dataND.trucTTyle)} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 128, paddingTop: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataND.tongSanLuongKeHoachLienKet)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Liên kết</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#86abdf', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataND.lienKTyle}%`, backgroundColor: '#3f7ccc', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucLienKetNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataND.lienKTyle < 30 ? 35 : allState.dataND.lienKTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataND.tongSanLuongDauCucLienKetNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataND.lienKTyle < 30 ? 30 : allState.dataND.lienKTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#3f7ccc' }}>{numberFormat(allState.dataND.lienKTyle)} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ height: 250, flex: 1, flexDirection: 'row', backgroundColor: '#f2f1f6', marginTop: 8, borderRadius: 12, margin: 8 }}>
                  <View style={{ height: 250, flex: 2, paddingLeft: 12 }} type={allState.timeFocusND}>
                    {allState.loadPieND ? (
                      <LoadingView />
                    ) : (
                      <HighchartsReactNative
                        styles={styles.highchar}
                        options={allState.chartOptions}
                      />
                    )}
                  </View>
                  <View style={{ height: 250, flex: 1, justifyContent: 'center', left: -12 }}>
                    <View>
                      <View style={{ height: 32, backgroundColor: '#c6e7f0', borderRadius: 4, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 8 }}>Cty trực thuộc</Text>
                      </View>
                      <Text style={{ textAlign: 'right', fontSize: 11, paddingTop: 8 }}>Tr.kWh</Text>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{numberFormat(allState.dataND.timeTT)}</Text>
                    </View>

                    <View style={{ paddingTop: 24 }}>
                      <View style={{ height: 32, backgroundColor: '#f1c8ce', borderRadius: 4, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 8 }}>Cty liên kết</Text>
                      </View>
                      <Text style={{ textAlign: 'right', fontSize: 11, paddingTop: 8 }}>Tr.kWh</Text>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{numberFormat(allState.dataND.timeLK)}</Text>
                    </View>
                  </View>
                </View>

                {/* Chọn ngày tháng năm */}
                <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, justifyContent: 'space-between', padding: 2 }}>
                  <TouchableOpacity style={allState.timeFocusND === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('D')}>
                    <Text>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocusND === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('M')}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocusND === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeND('Y')}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
                </View>

              </View>

              {/* Khối thủy điện */}
              <TouchableOpacity style={[styles.khoiItem, { marginTop: 12 }]} onPress={() => navigation.navigate('ChitietTD', { ngayXem: allState.ngayXem })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name={'water'} color={COLOR.RED} size={16} type="light" containerStyle={{ paddingRight: 8 }} />
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Khối thủy điện</Text>
                  <Badge status="primary" containerStyle={{ top: -5, right: -5, }} value={allState.slNhamay?.thuyDien} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: COLOR.GOOG_BLUE }}>Chi tiết</Text>
                  <Icon name={'angle-right'} color={COLOR.GOOG_BLUE} size={16} type="light" containerStyle={{ paddingLeft: 8 }} />
                </View>
              </TouchableOpacity>

              <View style={{ flex: 1, paddingTop: 24 }}>
                <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucTheoKhoiKeHoach)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Tổng</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataTD.tongTyle > 100 ? 100 : allState.dataTD.tongTyle}%`, backgroundColor: '#007549', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucTheoKhoiNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataTD.tongTyle < 25 ? 25 : allState.dataND.lienKTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucTheoKhoiNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataTD.tongTyle < 20?  20: allState.dataTD.tongTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#007549' }}>{numberFormat(allState.dataTD.tongTyle)} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 64, paddingTop: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataTD.tongSanLuongKeHoachTrucThuoc)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Trực thuộc</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataTD.trucTTyle > 100 ? 100 : allState.dataTD.trucTTyle}%`, backgroundColor: '#007549', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucTrucThuocNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataTD.tongTyle < 30 ? 30 : allState.dataND.lienKTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucTrucThuocNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataTD.trucTTyle < 25 ? 25 : allState.dataTD.trucTTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#007549' }}>{numberFormat(allState.dataTD.trucTTyle)} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 128, paddingTop: 12 }}>
                  <View style={{ paddingRight: 12, justifyContent: 'center', top: -8 }}>
                    <Text style={{ textAlign: 'right', fontSize: 11 }}>Tr.kWh</Text>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{numberFormat(allState.dataTD.tongSanLuongKeHoachLienKet)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }}>Liên kết</Text>
                    <View style={{ flex: 1, height: 32, backgroundColor: '#8cc1ad', borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                      <View style={{ flex: 1, height: 32, width: `${allState.dataTD.lienKTyle > 100 ? 100 : allState.dataTD.lienKTyle}%`, backgroundColor: '#007549', alignSelf: 'flex-end', justifyContent: 'center' }}>
                        {/* <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucLienKetNam)}</Text> */}
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: `${allState.dataTD.lienKTyle < 35 ? 35 : allState.dataND.lienKTyle}%`}}>
                        <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#FFF' }}>{numberFormat(allState.dataTD.tongSanLuongDauCucLienKetNam)}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, height: 32, width: `${allState.dataTD.lienKTyle < 25 ? 25 : allState.dataTD.lienKTyle}%`, alignSelf: 'flex-end', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8, color: '#007549' }}>{numberFormat(allState.dataTD.lienKTyle)} %</Text>
                    </View>
                  </View>
                </View>

                <View style={{ height: 250, flex: 1, flexDirection: 'row', backgroundColor: '#f2f1f6', marginTop: 8, borderRadius: 12, margin: 8 }}>
                  <View style={{ height: 250, flex: 2, paddingLeft: 12 }}>
                    {allState.loadPieTD ? (
                      <LoadingView />
                    ) : (
                      <HighchartsReactNative
                        styles={styles.highchar}
                        options={allState.chartOptionsTD}
                      />
                    )}
                  </View>
                  <View style={{ height: 250, flex: 1, justifyContent: 'center', left: -12 }}>
                    <View>
                      <View style={{ height: 32, backgroundColor: '#c6e7f0', borderRadius: 4, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 8 }}>Cty trực thuộc</Text>
                      </View>
                      <Text style={{ textAlign: 'right', fontSize: 11, paddingTop: 8 }}>Tr.kWh</Text>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{numberFormat(allState.dataTD.timeTT)}</Text>
                    </View>

                    <View style={{ paddingTop: 24 }}>
                      <View style={{ height: 32, backgroundColor: '#f1c8ce', borderRadius: 4, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 8 }}>Cty liên kết</Text>
                      </View>
                      <Text style={{ textAlign: 'right', fontSize: 11, paddingTop: 8 }}>Tr.kWh</Text>
                      <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>{numberFormat(allState.dataTD.timeLK)}</Text>
                    </View>
                  </View>
                </View>

                {/* Chọn ngày tháng năm */}
                <View style={{ flexDirection: 'row', height: 42, backgroundColor: '#f2f1f6', borderRadius: 8, margin: 8, justifyContent: 'space-between', padding: 2 }}>
                  <TouchableOpacity style={allState.timeFocusTD === 'D' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeTD('D')}>
                    <Text>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocusTD === 'M' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeTD('M')}>
                    <View style={{ width: '100%', borderLeftWidth: 0.8, borderRightWidth: 0.8, justifyContent: 'center', alignItems: 'center', borderColor: '#d9d8dd' }}>
                      <Text>Tháng</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={allState.timeFocusTD === 'Y' ? styles.item_time_focus : styles.item_time} onPress={() => onChangeTimeTD('Y')}>
                    <Text>Năm</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>
        )}
      </View>
      <DateTimePickerModal
        headerTextIOS="Chọn tháng năm"
        isVisible={allState.isDatePicker}
        mode="date"
        isDarkModeEnabled={isDark}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  khoitotal: {
    height: 48,
    backgroundColor: '#f2f1f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  total: {
    backgroundColor: '#FFF',
    paddingLeft: 8,
    paddingRight: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 8,
    paddingTop: 16
  },
  khoiItem: {
    height: 48,
    backgroundColor: '#f2f1f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    //borderTopLeftRadius: 12,
    //borderTopRightRadius: 12,
  },
  highchar: {
    backgroundColor: '#f2f1f6',
    justifyContent: 'center',
    flex: 1,
  },
  item_time: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item_time_focus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
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
});
