import {ToastAndroid} from 'react-native';
import {api} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getSessionId = async navigation => {
  try {
    const sessionId = await AsyncStorage.getItem('@session_id');
    if (sessionId !== null) {
      return sessionId;
    } else {
      navigation.navigate('Login');
    }
  } catch (e) {
    // error reading value
  }
};

const getAccountState = async (itemId, navigation) => {
  const sessionId = await getSessionId(navigation);
  if (sessionId)
    try {
      const result = await api.get(`/movie/${itemId}/account_states`, {
        params: {
          session_id: sessionId,
        },
      });
      return {result, sessionId};
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
};

const post = async (postType, media_type, sessionId, itemId, bool) => {
  return api.post(
    '/account/{account_id}/' + postType,
    {
      media_type,
      media_id: itemId,
      [postType]: bool,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
};

const fav = async (itemId, navigation, setIsFavorited) => {
  const accountState = await getAccountState(itemId, navigation);
  if (accountState)
    if (accountState.result.data.favorite) {
      try {
        const result = await post(
          'favorite',
          'movie',
          accountState.sessionId,
          itemId,
          false,
        );
        if (result.data.success) {
          setIsFavorited(false);
          ToastAndroid.show('Removed from favorites', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const result = await post(
          'favorite',
          'movie',
          accountState.sessionId,
          itemId,
          true,
        );
        if (result.data.success) {
          setIsFavorited(true);
          ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    }
};

const watchlist = async (itemId, navigation, setIsWatchList) => {
  const accountState = await getAccountState(itemId, navigation);
  if (accountState)
    if (accountState.result.data.watchlist) {
      try {
        const result = await post(
          'watchlist',
          'movie',
          accountState.sessionId,
          itemId,
          false,
        );
        if (result.data.success) {
          setIsWatchList(false);
          ToastAndroid.show('Removed from watchlist', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const result = await post(
          'watchlist',
          'movie',
          accountState.sessionId,
          itemId,
          true,
        );
        if (result.data.success) {
          setIsWatchList(true);
          ToastAndroid.show('Added to watchlist', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    }
};


export {fav, watchlist};
