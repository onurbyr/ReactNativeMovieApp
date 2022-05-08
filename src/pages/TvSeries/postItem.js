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
      const result = await api.get(`/tv/${itemId}/account_states`, {
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
          'tv',
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
          'tv',
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
          'tv',
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
          'tv',
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
  }
  setIsWatchListLoading(false);
};

const star = async (data, navigation, setIsStarLoading) => {
  setIsStarLoading(true);
  const accountState = await getAccountState(data.id, navigation);
  if (accountState)
    navigation.navigate('StarItem', {
      itemId: data.id,
      name: data.name,
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      sessionId: accountState.sessionId,
      ratedValue: accountState.result.data.rated.value,
      mediaType: 'tv',
    });
  setIsStarLoading(false);
};

const list = async (id, navigation) => {
  const sessionId = await getSessionId(navigation);
  if (sessionId) {
    navigation.navigate('CreatedLists', {itemId: id, mediaType: 'tv'});
  }
};

export {fav, watchlist, star, list};
