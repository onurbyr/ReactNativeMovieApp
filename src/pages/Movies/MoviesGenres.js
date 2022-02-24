import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiKey, apiImgUrl} from '../../../services/api/api';
import usePrevious from '../../hooks/usePrevious';
import HeaderWithBack from '../../components/HeaderWithBack';
import RenderFooter from '../../components/RenderFooter';
import Stars from '../../components/Stars/Stars';

const MoviesGenres = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);
  const {itemId, itemName} = route.params;

  useEffect(() => {
    getItems();
  }, [page]);

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get('/discover/movie/', {
        params: {
          api_key: apiKey.API_KEY,
          page,
          with_genres: itemId,
        },
      });
      if (prevPage == page - 1) {
        setData([...data, ...response.data.results]);
        setIsExtraLoading(false);
      } else {
        setData(response.data.results);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const dateConvert = dt => {
    const d = new Date(dt);
    const date = d.getFullYear();
    return date;
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack>{itemName}</HeaderWithBack>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          onEndReached={() => {
            setPage(page + 1);
            setIsExtraLoading(true);
          }}
          keyExtractor={({id}) => id}
          ListFooterComponent={RenderFooter(isExtraLoading)}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingBottom: 20,
                marginHorizontal: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#1f1f2b',
                borderRadius: 16,
              }}
              onPress={() =>
                navigation.push('MovieDetails', {
                  itemId: item.id,
                })
              }>
              <Image
                style={{width: 125, height: 175, borderRadius: 16}}
                source={{
                  uri: apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path,
                }}
              />
              <View
                style={{flex: 1, justifyContent: 'flex-end', marginLeft: 10}}>
                <Text style={{color: 'white', fontSize: 22}}>{item.title}</Text>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Stars count={item.vote_average} />
                  <Text style={{color: '#FF7652', fontSize: 12, marginLeft: 5}}>
                    {item.vote_average}/10 TMDB
                  </Text>
                </View>
                <Text style={{color: 'white', fontSize: 12, marginTop: 5}}>
                  {dateConvert(item.release_date)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MoviesGenres;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
});
