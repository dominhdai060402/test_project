import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../../env/config';
import { GroupData } from './totalData';

export function Viewngay(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const onInit = async () => {
      setData(props.data);
    };
    onInit();
  }, [props]);

  return (
    <View style={{ width: '50%', }}>
      <View style={styles.boxLuykeThang}>
        {data.map((item, index) => {
          if (
            item.idLoaiDonVi === props.type1 ||
            item.idLoaiDonVi === props.type2 ||
            item.idLoaiDonVi === null ||
            item.group
          ) {
            return (
              <View key={index} style={{ flexDirection: 'row' }}>
                <View style={styles.colChuky}>
                  <Text style={[styles.textName, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]} numberOfLines={1}>{item.tenNhaMay}</Text>
                </View>
                <View style={styles.colGTVal1}>
                  <Text style={[styles.textKh, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]}>{item.keHoach?.toLocaleString('vi-VN')}</Text>
                </View>
                <View style={styles.colGTVal2}>
                  <Text style={[styles.textTh, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]}>{item.thucHien?.toLocaleString('vi-VN')}</Text>
                </View>
              </View>
            );
          }
        })}
      </View>
      <View style={{ flex: 1, paddingBottom: 8 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxLuykeThang: {
    flex: 1,
    borderColor: '#CED0CE',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  colChuky: {
    justifyContent: 'center',
    width: '40%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colGTVal1: {
    justifyContent: 'center',
    width: '30%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
    backgroundColor: '#c0dcf1',
  },
  colGTVal2: {
    justifyContent: 'center',
    width: '30%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
    backgroundColor: '#efb583',
  },
  textHead: {
    textAlign: 'right',
    color: '#FFF',
    paddingRight: 8,
  },
  textVal: {
    textAlign: 'right',
    color: COLOR.GOOG_BLUE,
    paddingRight: 8,
  },
  textHead: {
    color: '#FFF',
    textAlign: 'center',
  },
  textName: {
    color: '#000',
    paddingLeft: 8,
    fontSize: 10,
  },
  textTyle: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  textKh: {
    textAlign: 'right',
    color: COLOR.GOOG_BLUE,
    fontWeight: 'bold',
    paddingRight: 8,
    fontSize: 10
  },
  textTh: {
    textAlign: 'right',
    color: COLOR.BLUE,
    fontWeight: 'bold',
    paddingRight: 8,
    fontSize: 10
  },
});
