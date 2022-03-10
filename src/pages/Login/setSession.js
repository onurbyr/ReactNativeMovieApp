import {ToastAndroid} from 'react-native';
import {api} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setSession = async (userName, password, navigation) => {
  if (userName && password) {
    let requestToken = '';
    let sessionId = '';
    try {
      const result = await api.get('/authentication/token/new');
      requestToken = result.data.request_token;
    } catch (err) {
      console.log(err);
    }
    try {
      const result = await api.post(
        '/authentication/token/validate_with_login',
        {
          username: userName,
          password: password,
          request_token: requestToken,
        },
      );
      requestToken = result.data.request_token;
    } catch (err) {
      //console.log(err);
      err.response.status == 401 &&
        ToastAndroid.show('Invalid Username or Password', ToastAndroid.SHORT);
    }
    try {
      const result = await api.post('/authentication/session/new', {
        request_token: requestToken,
      });
      if (result.data.success == true) {
        ToastAndroid.show('Successful Login', ToastAndroid.SHORT);
        sessionId = result.data.session_id;
      }
    } catch (err) {
      //console.log(err);
    }
    try {
      if (sessionId) {
        await AsyncStorage.setItem('@session_id', sessionId);
        navigation.goBack();
      }
    } catch (e) {
      // saving error
      console.log(e);
    }
  } else {
    ToastAndroid.show(
      'Please enter your username and password',
      ToastAndroid.SHORT,
    );
  }
};

export default setSession;
