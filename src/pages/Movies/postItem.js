import {ToastAndroid} from 'react-native';
import {api} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../localization/strings';

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

const fav = async (itemId, navigation, setIsFavorited, setIsFavLoading) => {
  setIsFavLoading(true);
  const accountState = await getAccountState(itemId, navigation);
  if (accountState) {
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
          ToastAndroid.show(strings.messages.removedfromfavorites, ToastAndroid.SHORT);
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
          ToastAndroid.show(strings.messages.addedtofavorites, ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  setIsFavLoading(false);
};

const watchlist = async (
  itemId,
  navigation,
  setIsWatchList,
  setIsWatchListLoading,
) => {
  setIsWatchListLoading(true);
  const accountState = await getAccountState(itemId, navigation);
  if (accountState) {
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
          ToastAndroid.show(strings.messages.removedfromwatchlist, ToastAndroid.SHORT);
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
          ToastAndroid.show(strings.messages.addedtowatchlist, ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  setIsWatchListLoading(false);
};

const star = async (data, navigation, setIsStarLoading) => {
  setIsStarLoading(true);
  const accountState = await getAccountState(data.id, navigation);
  if (accountState)
    navigation.navigate('StarItem', {
      itemId: data.id,
      sessionId: accountState.sessionId,
      mediaType: 'movie',
    });
  setIsStarLoading(false);
};

const list = async (id, navigation) => {
  const sessionId = await getSessionId(navigation);
  if (sessionId) {
    navigation.navigate('CreatedLists', {itemId: id, mediaType: 'movie'});
  }
};

export {fav, watchlist, star, list};
