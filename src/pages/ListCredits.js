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
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import HeaderWithBack from '../components/HeaderWithBack';
import Stars from '../components/Stars/Stars';
import NoImage from '../images/noimage.png';

const ListCredits = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {itemId, itemName, creditType} = route.params;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;

  useEffect(() => {
    getItems();
  }, []);

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get(
        `/person/${itemId}/${creditType}_credits`,
        {
          params: {
            api_key: apiKey.API_KEY,
          },
        },
      );
      setData(response.data.cast);
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
          keyExtractor={(item, index) => String(index)}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.touchableOpacityView}
              onPress={() =>
                creditType == 'movie'
                  ? navigation.push('MovieDetails', {
                      itemId: item.id,
                    })
                  : navigation.push('TvSeriesDetails', {
                      itemId: item.id,
                    })
              }>
              <Image
                style={styles.image}
                source={{
                  uri: item.poster_path
                    ? apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path
                    : NO_IMAGE,
                }}
                resizeMode={item.poster_path ? 'cover' : 'center'}
              />
              <View style={styles.imageRight}>
                <Text style={{color: 'white', fontSize: 18}}>
                  {creditType == 'movie' ? item.title : item.name}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Stars count={item.vote_average} size={14} />
                  <Text style={{color: '#FF7652', fontSize: 12, marginLeft: 3}}>
                    {item.vote_average}
                  </Text>
                </View>
                <Text style={{color: 'white', fontSize: 12, marginTop: 5}}>
                  {dateConvert(
                    creditType == 'movie'
                      ? item.release_date
                      : item.first_air_date,
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  touchableOpacityView: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 30,
    borderRadius: 16,
    backgroundColor: '#1D1C3B',
  },
  image: {
    width: 125,
    height: 175,
    marginTop: -30,
    borderRadius: 10,
  },
  imageRight: {
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
});

export default ListCredits;
