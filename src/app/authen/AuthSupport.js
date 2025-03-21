import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import {API} from '../../env/config';
import {AuthContext} from '../AuthContext';

const optionalConfigObject = {
  title: 'Yêu cầu xác thực', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

const AuthSupport = ({navigation}) => {
  const [loginname, setLoginname] = useState('genco1');
  const [password, setPassword] = useState('');
  const [biome, setBiome] = useState({biometryType: null, faceID: true});

  const {signIn, isSupport} = React.useContext(AuthContext);

  useEffect(() => {
    const checkTouchID = async () => {
      let typeId = null;
      await AsyncStorage.setItem('@Server-API', 'TEST');
      const plat = Platform.OS === 'android';
      await TouchID.isSupported()
        .then(security => {
          const isFace = security === 'TouchID' ? false : true;
          typeId = plat ? 'vân tay' : security;
          setBiome({biometryType: plat ? 'vân tay' : security, faceID: isFace});
        })
        .catch(err => {
          setBiome({biometryType: null, faceID: false});
        });
      const a = await AsyncStorage.getItem('@auth-autoID');
      if (a) {
        const val = JSON.parse(a);
        setLoginname(val.username);
        if (val.touchID && !val.logout) {
          handlePress(typeId, val.username);
        }
      }
    };
    checkTouchID();
  }, []);

  const checkLogin = () => {
    signIn({loginname, password});
  };

  const handlePress = (biometryType, loginname) => {
    Keychain.getGenericPassword().then(credentials => {
      const {username, password} = credentials;
      if (username.toUpperCase() === loginname.toUpperCase()) {
        TouchID.authenticate(
          'Sử dụng ' + biometryType + ' để mở khóa',
          optionalConfigObject,
        ).then(() => {
          signIn({loginname, password});
        });
      } else {
        Alert.alert(
          'Bạn đăng nhập với tài khoản khác. Vui lòng nhập mật khẩu để xác thực!',
        );
      }
    });
  };

  const renderLogin = () => {
    return (
      <ImageBackground
        style={styles.imageStyle}
        resizeMode="cover"
        source={require('../../assets/img/bg_login.png')}>
        <Image
          style={styles.logoImage}
          source={require('../../assets/img/logo-notext.png')}
        />
        <Text style={styles.formTitle}>Quản Lý Sản Xuất Kinh Doanh</Text>
        <View style={styles.cardContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TouchableOpacity
                onPress={() => {
                  /* Handle forgot password navigation */
                }}>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              selectionColor="#000"
              style={styles.inputField}
              placeholder="Điền mật khẩu của bạn"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.loginWrapper}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={checkLogin}
              disabled={!loginname || !password}>
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>

            {biome.biometryType ? (
              <TouchableOpacity
                style={styles.faceID}
                onPress={() => handlePress(biome.biometryType, loginname)}
                underlayColor="#0380BE"
                activeOpacity={1}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {biome.faceID ? (
                    <Image
                      style={{resizeMode: 'cover', width: 25, height: 25}}
                      source={require('../../assets/img/face_ID512.png')}
                    />
                  ) : (
                    <Icon
                      name="fingerprint"
                      color="#FFF"
                      type="light"
                      size={25}
                    />
                  )}
                  <Text
                    style={{
                      color: '#FFF',
                      fontWeight: 'bold',
                      marginLeft: 10,
                    }}>
                    {`Xác thực bằng ${biome.biometryType}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.bottomText}>
            Để đổi mật khẩu,{' '}
            <Text
              style={styles.bottomLink}
              onPress={() => {
                /* Handle password reset navigation */
              }}>
              nhấn vào đây!
            </Text>
          </Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'android' ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {renderLogin()}
        </TouchableWithoutFeedback>
      ) : (
        <KeyboardAvoidingView style={{flex: 1}} enabled behavior="padding">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            {renderLogin()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      {/* {loading && <ProgressBar/>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logoImage: {
    alignItems: 'center',
    resizeMode: 'cover',
    width: 232,
    height: 60,
    marginTop: 30,
  },
  formTitle: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    marginTop: 30,
    textTransform: 'uppercase',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginVertical: 18,
    marginTop: 30,
    width: '90%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
    fontWeight: '400',
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 13,
    color: '#1C1C1E',
    fontFamily: 'Inter-Medium',
    fontWeight: '400',
  },
  forgotPassword: {
    fontSize: 13,
    color: '#0D6EFD',
    fontFamily: 'Inter-Medium',
    fontWeight: '400',
  },
  inputField: {
    backgroundColor: '#FCFCFC',
    borderColor: '#DBDFE9',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#78829D',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rememberMeText: {
    fontSize: 13,
    color: '#1C1C1E',
    marginLeft: 8,
  },

  forgotPassword: {
    fontSize: 13,
    color: '#0D6EFD',
    fontFamily: 'Inter-Medium',
    fontWeight: '400',
  },
  inputField: {
    backgroundColor: '#FCFCFC',
    borderColor: '#DBDFE9',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#78829D',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rememberMeText: {
    fontSize: 13,
    color: '#1C1C1E',
    marginLeft: 8,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    // color: '#e3342f',
    color: '#FFF',
    marginBottom: 30,
    marginTop: 10,
  },
  inputView: {
    width: '80%',
    maxWidth: 450,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderColor: 'white',
  },
  inputText: {
    height: 50,
    color: '#000000',
    flex: 1,
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    maxWidth: 450,
    // backgroundColor: '#e3342f',
    backgroundColor: '#126dd8',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    // marginBottom: 10,
  },

  faceID: {
    width: '80%',
    maxWidth: 450,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },

  loginText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  inforText: {
    color: 'white',
  },
  bottomView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
  },
  verText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AuthSupport;
