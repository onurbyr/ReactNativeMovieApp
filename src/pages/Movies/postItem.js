import {ToastAndroid} from 'react-native';
import {api} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const postItem = async (fn, itemId, navigation) => {
  try {
    const sessionId = await AsyncStorage.getItem('@session_id');
    if (sessionId !== null) {
      try {
        const result = await api.get(`/movie/${itemId}/account_states`, {
          params: {
            session_id: sessionId,
          },
        });

        const post = async (postType, media_type, sessionId, bool) => {
          if (postType == 'favorite')
            return api.post(
              '/account/{account_id}/' + postType,
              {
                media_type,
                media_id: itemId,
                favorite: bool,
              },
              {
                params: {
                  session_id: sessionId,
                },
              },
            );
          if (postType == 'watchlist')
            return api.post(
              '/account/{account_id}/' + postType,
              {
                media_type,
                media_id: itemId,
                watchlist: bool,
              },
              {
                params: {
                  session_id: sessionId,
                },
              },
            );
        };
        fn(sessionId, result, post);
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      navigation.navigate('Login');
    }
  } catch (e) {
    // error reading value
  }
};

export default postItem;
