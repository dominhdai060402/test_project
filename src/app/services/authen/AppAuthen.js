import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../../env/config';

export default class AppAuthen {

  static getBaseURL = async () => {
    let URL = API.OFFICE;
    const api_server = await AsyncStorage.getItem('@Server-API');
    if (api_server === 'TEST') {
      URL = API.OFFICE_TEST;
    }
    return URL;
  }

  static login = async (tendangnhap, matkhau) => {
    let data = {
      UserName: tendangnhap,
      PassWord: matkhau,
    };
    const URL = await AppAuthen.getBaseURL();
    return Axios({
      method: 'POST',
      url: `${URL}/api/User/Login`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  static getAppInfor = async () => {
    const URL = await AppAuthen.getBaseURL();
    return Axios({
      method: 'GET',
      url: `${URL}/v1/quantri/Version/AppInfor.Mobile`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  static oauthToken = async () => {
    return Axios({
      method: 'POST',
      url: `http://10.1.3.190:8080/oauth/token`,
      data: 'grant_type=password&username=27495&password=password',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic MTIzOjEyMzQ=',
      },
    });
  };
}
