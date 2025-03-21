import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import TouchID from 'react-native-touch-id';
import * as UpdateAPK from 'rn-update-apk';
import { API, COLOR } from '../env/config';
import { LogoutIcon } from './components/Components';
import {Appstyles} from './styles/AppStyle';


export function SettingScreen(props) {


  const [touchID, setTouchID] = useState(false);
  const [biometryType, setBiometryType] = useState(null);

  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [allApps, setAllApps] = useState([]);
  const [allNonSystemApps, setAllNonSystemApps] = useState([]);
  const [version, setVersion] = useState(API.VERSION);


  let onUpdated =  props.route.params ?props.route.params.update: false;

  const updater = new UpdateAPK.UpdateAPK({
    iosAppId: '1104809018',
    apkVersionUrl: API.APK_VERSION,
    apkVersionOptions: {
      method: 'GET',
      headers: {},
    },
    apkOptions: {
      headers: {},
    },
    fileProviderAuthority: 'com.ttd_genco1',
    needUpdateApp: (needUpdate) => {
      Alert.alert(
        'Cập nhật phiên bản',
        'Phiên bản mới đã được phát hành, bạn có muốn cập nhật? ' +
        'Phiên bản cập nhật bổ sung một số tính năng và hiệu chỉnh lỗi',
        [
          { text: 'Cancel', onPress: () => { } },
          { text: 'Update', onPress: () => needUpdate(true) },
        ],
      );
    },
    forceUpdateApp: () => {
      console.log('forceUpdateApp callback called');
    },
    notNeedUpdateApp: () => {
      console.log('notNeedUpdateApp callback called');
    },
    downloadApkStart: () => {
      console.log('downloadApkStart callback called');
    },
    downloadApkProgress: (progress) => {
      setDownloadProgress(progress);
    },
    downloadApkEnd: () => {
      setDownloadProgress(-1);
    },
    onError: (err) => {
      Alert.alert('There was an error', err.message);
    },
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <LogoutIcon />,
    });
  }, [props.navigation]);

  useEffect(() => {
    const loadDefault = async () => {
      // Kiêm tra TouchID hoặc FaceID
      TouchID.isSupported()
        .then(security => {
          const plat = Platform.OS === 'android';
          const typeName = plat ? 'vân tay' : security;
          setBiometryType(typeName);
        })
        .catch(err => {
          setBiometryType(null);
        });
      const result = await AsyncStorage.getItem('@auth-autoID');
      if (result) {
        const auth = JSON.parse(result);
        setTouchID(auth.touchID);
      }
      await axios.get(API.CHECK_VERSION)
        .then(res => {
          const verData = res.data;
          console.log(verData);
          if (API.VERSION.localeCompare(verData.versionApp) === -1) {
            onUpdated = true;
          }
          setVersion(verData.versionApp);
        })
        .catch((error) => console.log('LOI THONG TIN PHIEN BAN', error));
      // Update phiên bản APK
      UpdateAPK.patchSSLProvider()
        .then((ret) => {
          console.log('SSL Provider Patch proceeded without error');
        })
        .catch((rej) => {
          console.log('SSL Provider patch failed', rej);
          let message =
            'Old Android API, and SSL Provider could not be patched.';
          if (rej.message.includes('repairable')) {
            message +=
              ' This is repairable on this device though.' +
              ' You should send the users to the Play Store to update Play Services...';
            Alert.alert('Possible SSL Problem', message);
            UpdateAPK.patchSSLProvider(false, true);
          } else {
            Alert.alert('Possible SSL Problem', message);
          }
        });

      UpdateAPK.getApps()
        .then((apps) => {
          setAllApps(apps);
        })
        .catch((e) => console.log('Unable to getApps?', e));

      UpdateAPK.getNonSystemApps()
        .then((apps) => {
          setAllNonSystemApps(apps);
        })
        .catch((e) => console.log('Unable to getNonSystemApps?', e));

      if (onUpdated) {
        onActiveUpdate();
      }
    };
    loadDefault();
  }, []);

  const enableTouchID = async () => {
    const enabled = !touchID;
    setTouchID(enabled);
    const result = await AsyncStorage.getItem('@auth-autoID');
    if (result) {
      const auth = JSON.parse(result);
      auth.touchID = enabled;
      AsyncStorage.setItem('@auth-autoID', JSON.stringify(auth));
    }
  };

  const onActiveUpdate = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL(API.UPDATE).catch((err) =>
          console.error('An error occurred', err),
        );
      } else {
        updater.checkUpdate();
      }
    } catch (e) {
      console.error(e);
    }
  };







  const renderBody = () => (
    <View style={{flex: 1}}>
      <View style={styles.block}>
        {downloadProgress != -1 && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.instructions}>
              Download Progress: {downloadProgress}%
            </Text>
          </View>
        )}
        <View style={styles.headerIcon}>
          <Icon name="shield" size={25} type="light" color={COLOR.LIGHT_GREY} />
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.itemTitle}>Thông tin chung</Text>
            <Text style={styles.advance}>Cài đặt chung</Text>
          </View>
        </View>
        <View style={styles.item}>
          <Text>
            Xác thực bằng{''}{' '}
            {biometryType ? biometryType : '(không có FaceID hoặc TouchID)'}
            {''}
          </Text>
          <Switch
            disabled={biometryType ? false : true}
            value={touchID}
            onChange={enableTouchID}
          />
        </View>
        <View style={styles.item}>
          <TouchableOpacity>
            <Text style={{ color: COLOR.GOOG_BLUE }}>
              Phiên bản v{API.VERSION}
            </Text>
          </TouchableOpacity>
          {API.VERSION !== version ? (
            <TouchableOpacity
              style={API.VERSION === version ? styles.vInstall : styles.vUpdate}
              onPress={onActiveUpdate}>
              <Text style={{ color: '#FFF' }}>Cập nhật v{version}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={Appstyles.container}>
      <ScrollView>
        {Platform.OS === 'android' ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            {renderBody()}
          </TouchableWithoutFeedback>
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              {renderBody()}
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  block: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'column',
  },
  block2: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'column',
    marginTop: 10,
  },
  blockend: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  itemTitle: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 1,
    borderBottomColor: 'yellow',
  },
  advance: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontSize: 15,
    color: COLOR.LIGHT_GREY,
  },

  advanceHSM: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontSize: 15,
    color: COLOR.RED,
  },

  advanceText: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontSize: 15,
    paddingLeft: 50,
    color: COLOR.LIGHT_GREY,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
  },
  mainItem: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  subItem: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  vInstall: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 13,
    paddingLeft: 13,
    borderRadius: 20,
    height: 35,
    backgroundColor: COLOR.BLUE,
  },

  vUpdate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 13,
    paddingLeft: 13,
    borderRadius: 20,
    height: 35,
    backgroundColor: COLOR.RED,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'left',
    color: COLOR.BLUE,
    marginTop: 5,
    marginBottom: 5,
  },
  appItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  appDefault: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.HEARDER,

    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  timeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 8 : 15,
    paddingBottom: Platform.OS === 'ios' ? 8 : 15,
  },
  vkyso: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 24,
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
  },
  vkysoButton: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 40,
    paddingRight: 24,
  },
  textInput: {
    justifyContent: 'center',
    borderWidth: 1,
    height: 35,
    borderColor: 'black',
    paddingLeft: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLOR.LIGHT_GREY,
    borderRadius: 5,
    color: 'black',
    alignItems: 'center',
    width: 200,
  },
});
