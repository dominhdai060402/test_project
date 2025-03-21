import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../../env/config';

export function Tbheader(props) {
  const day = format(props.datexem, 'dd');
  const thang = format(props.datexem, 'MM');
  const nam = format(props.datexem, 'yyyy');
  useEffect(() => { }, []);

  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      <View style={styles.vColLeft}>
        <View style={styles.groupcol}>
          <Text style={{ color: '#FFF', fontSize: 11 }}>Ngày {day}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.colChuky}>
            <Text style={styles.textHead}>Đơn vị</Text>
          </View>
          <View style={styles.colGiatri}>
            <Text style={styles.textHead}>Kế hoạch</Text>
            <Text style={styles.textHead}>(tr kWh)</Text>
          </View>
          <View style={styles.colGiatri}>
            <Text style={styles.textHead}>Thực hiện</Text>
            <Text style={styles.textHead}>(tr kWh)</Text>
          </View>
        </View>
      </View>
      <View style={styles.vColRight}>
        <View style={styles.groupcol}>
          <Text style={{ color: '#FFF', fontSize: 11 }}>Tháng {thang}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.colGiatri1}>
            <Text style={styles.textHead}>Kế hoạch</Text>
            <Text style={styles.textHead}>(tr kWh)</Text>
          </View>
          <View style={styles.colGiatri2}>
            <Text style={styles.textHead}>Thực hiện</Text>
            <Text style={styles.textHead}>(tr kWh)</Text>
          </View>
          <View style={styles.colTyle}>
            <Text style={styles.textHead}>Tỷ lệ</Text>
            <Text style={styles.textHead}>(%)</Text>
          </View>
        </View>
      </View>
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
  groupcol: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    flex: 1,
  },
  vColLeft: {
    backgroundColor: '#000074',
    width:'50%',
    borderLeftWidth: 1,
    borderLeftColor: '#FFF',
  },
  vColRight: {
    backgroundColor: '#000074',
    borderLeftWidth: 1,
    borderLeftColor: '#FFF',
    width:'50%',
  },
  colChuky: {
    justifyContent: 'center',
    width: '40%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colGiatri: {
    justifyContent: 'center',
    width: '30%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colGiatri1: {
    justifyContent: 'center',
    width: '37%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colGiatri2: {
    justifyContent: 'center',
    width: '37%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  colTyle: {
    justifyContent: 'center',
    width: '27%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  textHead: {
    textAlign: 'right',
    color: '#FFF',
    paddingRight: 8,
    fontSize: 11
  },
  textHead: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 11
  },
});
