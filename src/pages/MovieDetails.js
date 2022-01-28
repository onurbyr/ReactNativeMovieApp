import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const {itemId} = route.params;

  useEffect(() => {
    getMovieDetails();
    dateConvert();
  }, []);

  //getdata with axios3 (baseurl)
  const getMovieDetails = async navigation => {
    try {
      const response = await api.get('/movie/' + itemId, {
        params: {
          api_key: apiKey.API_KEY,
        },
      });
      //console.log(response.data);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      // handle error
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const Hr = () => {
    return (
      <View
        style={{
          borderBottomColor: '#515151',
          borderBottomWidth: 0.8,
          margin: 20,
          opacity: 0.3,
        }}
      />
    );
  };

  const dateConvert = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const d = new Date(data.release_date);
    const date =
      months[d.getMonth()] + ' ' + d.getDate() + ',' + ' ' + d.getFullYear();
    return date;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.buttonImage}>
            <ImageBackground
              source={{
                uri: apiImgUrl.API_IMAGE_URL + '/w1280' + data.backdrop_path,
              }}
              resizeMode="stretch"
              style={{flex: 1}}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <MaterialIcons
                  name="arrow-back-ios"
                  color={'white'}
                  size={20}
                  style={{paddingLeft: 5}}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{data.original_title}</Text>
            <View style={styles.titleMinutes}>
              <Ionicons
                name="time-outline"
                color={'white'}
                size={12}
                style={styles.minutesIcon}
              />
              <Text style={styles.minutes}>{data.runtime + ' minutes'}</Text>
              <Ionicons
                name="star"
                color={'white'}
                size={12}
                style={styles.starsIcon}
              />
              <Text style={styles.stars}>{data.vote_average + ' (Tmdb)'}</Text>
            </View>
            <Hr />
          </View>
          <View style={styles.info2}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.releaseDateText}>Release Date</Text>
              <Text style={styles.genreText}>Genre</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.releaseDate}>{dateConvert()}</Text>
            </View>
          </View>
          <View style={styles.info3}></View>
          <View style={styles.info4}></View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  buttonImage: {
    flex: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  info: {
    flex: 1,
  },
  titleMinutes: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
    marginHorizontal: 25,
    marginTop: 20,
  },
  minutesIcon: {
    marginLeft: 25,
    marginTop: 15,
  },
  minutes: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    marginLeft: 5,
    marginTop: 15,
  },
  starsIcon: {
    marginLeft: 25,
    marginTop: 15,
  },
  stars: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    marginLeft: 5,
    marginTop: 15,
  },
  info2: {
    flex: 1,
  },
  releaseDateText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Lato',
    marginLeft: 25,
  },
  releaseDate: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    marginLeft: 25,
    marginTop: 15,
  },
  genreText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Lato',
    marginLeft: 50,
  },
  info3: {
    flex: 1,
  },
  info4: {
    flex: 1,
  },
});

export default MovieDetails;
