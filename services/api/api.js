import axios from 'axios';
import {API_KEY, API_URL, API_IMAGE_URL, API_URL_V4, TOKEN} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
  params: {
    api_key: API_KEY,
  },
});

const apiv4 = axios.create({
  baseURL: API_URL_V4,
  headers: {Authorization: 'Bearer ' + TOKEN},
});

const apiv4Authorized = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('@access_token');
    if (accessToken !== null) {
      const api = axios.create({
        baseURL: API_URL_V4,
        headers: {Authorization: 'Bearer ' + accessToken},
      });
      return api;
    } else {
      return null;
    }
  } catch (e) {
    // read error
  }
};

const apiKey = {API_KEY};

const apiImgUrl = {API_IMAGE_URL};

//export default api;
export {api, apiKey, apiImgUrl, apiv4, apiv4Authorized};
