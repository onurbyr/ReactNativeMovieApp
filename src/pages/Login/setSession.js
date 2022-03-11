import {ToastAndroid} from 'react-native';
import {apiv4, api} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

let requestToken = '';

const createRequestToken = async setUrl => {
  try {
    const result = await apiv4.post('/auth/request_token');
    if (result.data.success) {
      const url = `https://www.themoviedb.org/auth/access?request_token=${result.data.request_token}`;
      setUrl(url);
      requestToken = result.data.request_token;
    }
  } catch (err) {
    //console.log(err);
    ToastAndroid.show('An error occured', ToastAndroid.SHORT);
  }
};

const afterApproved = async (navigation) => {
  let accessToken = '';
  let sessionId = '';
  let accountId = '';
  //Create access token
  if (requestToken) {
    try {
      const result = await apiv4.post('/auth/access_token', {
        request_token: requestToken,
      });
      if (result.data.success) {
        accessToken = result.data.access_token;
        accountId = result.data.account_id;
      }
    } catch (err) {
      //console.log(err);
      ToastAndroid.show('An error occured', ToastAndroid.SHORT);
    }
    //Convert v4 session
    if (accessToken) {
      try {
        const result = await api.post('/authentication/session/convert/4', {
          access_token: accessToken,
        });
        if (result.data.success) {
          sessionId = result.data.session_id;
        }
      } catch (err) {
        //console.log(err);
        ToastAndroid.show('An error occured', ToastAndroid.SHORT);
      }
    }
    try {
      if (sessionId) {
        await AsyncStorage.setItem('@session_id', sessionId);
        await AsyncStorage.setItem('@access_token', accessToken);
        await AsyncStorage.setItem('@account_id', accountId);
        navigation.goBack();
      }
    } catch (e) {
      // saving error
      console.log(e);
    }
  }
};

export {createRequestToken, afterApproved};
