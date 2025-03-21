import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import CheckBox from '@react-native-community/checkbox';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';

const optionalConfigObject = {
  title: 'Yêu cầu xác thực',
  cancelText: 'Huỷ',
};

const AuthForm = () => {
  const [loginname, setLoginname] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [biome, setBiome] = useState({biometryType: null, faceID: true});

  const {signIn} = useContext(AuthContext);

  const isValid = loginname.trim() !== '' && password.trim() !== '';

  const checkLogin = () => {
    signIn({loginname, password, rememberMe});
  };

  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const supported = await TouchID.isSupported();
        setBiome({
          biometryType: supported,
          faceID: supported !== 'TouchID' ? true : false,
        });
      } catch {
        setBiome({biometryType: null, faceID: false});
      }
    };
    checkBiometric();
  }, []);

  const handlePress = biometryType => {
    Keychain.getGenericPassword().then(credentials => {
      if (!credentials) {
        Alert.alert('Không tìm thấy thông tin đăng nhập!');
        return;
      }
      const {username, password} = credentials;
      if (username.toUpperCase() === loginname.toUpperCase()) {
        TouchID.authenticate(
          'Sử dụng ' + biometryType + ' để đăng nhập',
          optionalConfigObject,
        )
          .then(() => {
            signIn({loginname, password});
          })
          .catch(() => {
            Alert.alert('Xác thực thất bại');
          });
      }
    });
  };

  const renderLogin = () => (
    <ImageBackground
      style={styles.imageStyle}
      source={require('../../assets/img/bg_login.png')}
      resizeMode="cover">
      <Image
        style={styles.logoImage}
        source={require('../../assets/img/logo-notext.png')}
      />
      <Text style={styles.formTitle}>Quản lý sản xuất kinh doanh</Text>

      <View style={styles.cardContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tên đăng nhập</Text>
          <TextInput
            style={styles.inputField}
            placeholder="email@email.com"
            value={loginname}
            onChangeText={setLoginname}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="Nhập mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.rememberMeContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            tintColors={{true: '#126dd8', false: '#A0A0A0'}}
          />
          <Text style={styles.rememberMeText}>Nhớ mật khẩu</Text>
        </View>

        <View style={styles.loginWrapper}>
          <TouchableOpacity
            style={[
              styles.loginBtn,
              isValid && styles.loginBtnActive,
            ]}
            onPress={checkLogin}
            disabled={!isValid}>
            <Text style={[styles.loginText, isValid && styles.loginTextActive]}>
              Đăng nhập
            </Text>
          </TouchableOpacity>

          {biome.biometryType && (
            <TouchableOpacity
              style={styles.faceIDBtn}
              onPress={() => handlePress(biome.biometryType)}>
              {biome.faceID ? (
                <Image
                  style={styles.faceIDIcon}
                  source={require('../../assets/img/face_ID512.png')}
                />
              ) : (
                <Icon name="fingerprint" type="light" color="#000" size={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'android' ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {renderLogin()}
        </TouchableWithoutFeedback>
      ) : (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {renderLogin()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoImage: {
    width: 232,
    height: 60,
    resizeMode: 'cover',
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
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    marginTop: 30,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#1C1C1E',
  },
  forgotPassword: {
    fontSize: 13,
    color: '#0D6EFD',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#DBDFE9',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FCFCFC',
    color: '#000',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 13,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  loginWrapper: {
    flexDirection: 'row',
  },
  loginBtn: {
    flex: 1,
    backgroundColor: '#E5E8EF',
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnActive: {
    backgroundColor: '#126DD8',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A1A1A1',
  },
  loginTextActive: {
    color: '#fff',
  },
  faceIDBtn: {
    width: 50,
    backgroundColor: '#E5E8EF',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceIDIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#000',
  },
});
