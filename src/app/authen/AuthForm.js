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
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      <Text style={styles.formTitle}>Quản Lý Sản Xuất Kinh Doanh</Text>

      <View style={styles.cardContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tên đăng nhập</Text>
          <TextInput
            style={[
              styles.inputField,
              isFocused && styles.inputFieldFocused, // Thêm style khi focus
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Số điện thoại hoặc tên đăng nhập"
            placeholderTextColor="#78829D"
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

          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[
                styles.inputField,
                isPasswordFocused && styles.inputFieldFocused,
                {paddingRight: 40}, // chừa chỗ cho icon
              ]}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#78829D"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(prev => !prev)}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                type="light"
                size={18}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
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
            style={[styles.loginBtn, isValid && styles.loginBtnActive]}
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

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'android' ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {renderLogin()}
            <Text style={styles.versionText}>
              Version 1.3.0 Build 17/03/2025
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1}}>
              {renderLogin()}
              <Text style={styles.versionText}>
                Version 1.3.0 Build 17/03/2025
              </Text>
            </View>
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
    textTransform: 'none',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    marginTop: 35,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: '#0D6EFD',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#DBDFE9',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FCFCFC',
    color: '#000',
  },
  inputFieldFocused: {
    borderColor: '#0D6EFD', // Màu viền khi focus
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: '#DBDFE9',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnActive: {
    backgroundColor: '#0D6EFD',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
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
  versionText: {
    fontSize: 12,
    color: '#071437',
    textAlign: 'center',
    marginBottom: 18,
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  bottomText: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    marginTop: 24,
  },
  bottomLink: {
    color: '#0D6EFD',
  },
  passwordInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -12}],
  },
});
