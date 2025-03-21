import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {API} from '../../env/config';
import AppAuthen from './authen/AppAuthen';

export const instance = Axios.create({
  baseURL: API.OFFICE,
  timeout: 500000,
});

instance.setToken = token => {
  instance.defaults.headers['Content-Type'] = `application/json`;
  instance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export default class CommonHttp {
  constructor() {
    instance.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalRequest = error.config;
        if (
          error.response.status === 401 &&
          originalRequest.url === `${URL}/api/User/Login`
        ) {
          return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = this.refreshToken();
          return axios
            .post('/auth/refreshToken', {
              refreshToken: `${refreshToken}`,
            })
            .then(async res => {
              if (res.status === 201) {
                AsyncStorage.setItem('@auth-Token',JSON.stringify(rsdata.token));
                axios.defaults.headers.common['Authorization'] =
                  'Bearer ' + localStorageService.getAccessToken();
                return axios(originalRequest);
              }
            });
        }
        return Promise.reject(error);
      },
    );
  }

  refreshToken = async () => {
    let refreshToken = '';
    const strToken = await AsyncStorage.getItem('@refreshToken');
    if (strToken) {
      refreshToken = JSON.parse(strToken);
    }
    return refreshToken;
  };

  post = async (url, data) => {
    let token = '';
    const baseURL = await AppAuthen.getBaseURL();
    const strToken = await AsyncStorage.getItem('@auth-Token');
    if (strToken) {
      token = JSON.parse(strToken);
    };
    console.log('data:', data);
    console.log('tokentoken:', token);
    //console.log('urlurlurlurlurl:', `${baseURL}/${url}`);
    return instance({
      method: 'POST',
      data,
      url: `${baseURL}/${url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  get = async url => {
    let token = '';
    const baseURL = await AppAuthen.getBaseURL();
    const strToken = await AsyncStorage.getItem('@auth-Token');
    if (strToken) {
      token = JSON.parse(strToken);
    }
    return instance({
      method: 'GET',
      url: `${baseURL}/${url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  get = async (url, params) => {
    let token = '';
    const baseURL = await AppAuthen.getBaseURL();
    const strToken = await AsyncStorage.getItem('@auth-Token');
    if (strToken) {
      token = JSON.parse(strToken);
    }
    return instance({
      method: 'GET',
      url: `${baseURL}/${url}`,
      params: params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  upload = async (formData, url) => {
    let token = '';
    const baseURL = await AppAuthen.getBaseURL();
    const strToken = await AsyncStorage.getItem('@auth-Token');
    if (strToken) {
      token = JSON.parse(strToken);
    }
    return instance({
      method: 'POST',
      url: `${baseURL}/${url}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
