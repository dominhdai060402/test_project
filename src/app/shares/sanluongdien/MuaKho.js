import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../../env/config';

export function MuaKho(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const onInit = async () => {
      setData(props.data);
    };
    onInit();
  }, [props]);
  return (
    <View style={{ width: '40%', }}>
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
                <View style={styles.colGTVal1}>
                  <Text style={[styles.textKh, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]}>{item.keHoach.toLocaleString('vi-VN')}</Text>
                </View>
                <View style={styles.colGTVal2}>
                  <Text style={[styles.textKh, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]}>{item.thucHien.toLocaleString('vi-VN')}</Text>
                </View>
                <View style={styles.colGTVal3}>
                  <Text style={[styles.textTh, { fontWeight: item.sumGroup ? 'bold' : 'normal' }]}>{item.tyLe.toLocaleString('vi-VN')}</Text>
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
  textHead: {
    textAlign: 'right',
    color: '#FFF',
    paddingRight: 8,
  },

  colGTVal1: {
    justifyContent: 'center',
    width: '38%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
    backgroundColor: '#c0dcf1',
  },
  colGTVal2: {
    justifyContent: 'center',
    width: '38%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
    backgroundColor: '#efb583',
  },
  colGTVal3: {
    justifyContent: 'center',
    width: '24%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
    backgroundColor: '#86cbff',
  },

  textVal: {
    textAlign: 'right',
    color: COLOR.GOOG_BLUE,
    paddingRight: 8,
  },

  textName: {
    color: '#000',
    paddingLeft: 8,
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
    paddingRight: 8, fontSize: 10
  },
});
