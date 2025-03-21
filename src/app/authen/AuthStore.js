import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AuthStore {
  static createAppInfor = data => {
    const user = {
      idDonvi: 18,
      companyName: data.tenDonVi,
      companyShort: 'EVNGENCO1',
      fullName: data.name,
      username: data.surname,
      token: data.token,
    };
    AsyncStorage.setItem('@auth-user', JSON.stringify(user));
    return user;
  };
  static createAppDigitaOffice = async data => {};
  static createAppEmployee = async data => {};
  static createAppUtility = async data => {};
}
