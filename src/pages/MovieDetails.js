import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isConnected, setConnected] = useState(false);
  const [recommend, setRecommend] = useState([]);

  const {itemId} = route.params;

  useEffect(() => {
    getNetInfo();
    getMovieDetails();
    dateConvert();
    getMovieRecommend();
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      setConnected(state.isConnected);
    });
  };

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
    } catch (error) {
      // handle error
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMovieRecommend = async navigation => {
    try {
      const response = await api.get('/movie/' + itemId + '/recommendations', {
        params: {
          api_key: apiKey.API_KEY,
        },
      });
      //console.log(response.data.results);
      setRecommend(response.data.results);
    } catch (error) {
      // handle error
      console.log(error.message);
    } finally {
      //setLoading(false);
    }
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

  if (isConnected)
    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('HomeScreen')}>
              <MaterialIcons
                name="arrow-back-ios"
                color={'white'}
                size={20}
                style={{paddingLeft: 5}}
              />
            </TouchableOpacity>
            <ScrollView style={{flex: 1}}>
              <Image
                source={{
                  uri: apiImgUrl.API_IMAGE_URL + '/w1280' + data.backdrop_path,
                }}
                resizeMode="stretch"
                style={{height: 250}}></Image>
              <Text style={styles.title}>{data.title}</Text>
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
                <Text style={styles.stars}>
                  {data.vote_average + ' (Tmdb)'}
                </Text>
              </View>
              <Hr />
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.releaseDateText}>Release Date</Text>
                <Text style={styles.genreText}>Genre</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.releaseDate}>{dateConvert()}</Text>
                <ScrollView horizontal={true} style={styles.genreScrollView}>
                  {data.genres.map(n => (
                    <View key={n.id} style={styles.genreBox}>
                      <Text style={styles.genreText2}>{n.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <Hr />
              <Text style={styles.overviewText}>Overview</Text>
              <Text style={styles.overview}>{data.overview}</Text>
              <Hr />
              <Text style={styles.rmText}>Recommendations</Text>
              <ScrollView horizontal={true} style={styles.rmScrollView}>
                {recommend
                  .filter((i, index) => index < 5)
                  .map((n, index) => (
                    <TouchableOpacity
                      key={n.id}
                      style={{marginRight: 25, width: 150}}
                      onPress={() =>
                        navigation.push('MovieDetails', {
                          itemId: n.id,
                        })
                      }>
                      <Image
                        style={{width: 150, height: 80, borderRadius: 10}}
                        source={{
                          uri:
                            apiImgUrl.API_IMAGE_URL + '/w300' + n.backdrop_path,
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          marginVertical: 10,
                        }}>
                        {n.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#15141F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={[styles.backButton, {left: 0, top: 0}]}
        onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="arrow-back-ios"
          color={'white'}
          size={20}
          style={{paddingLeft: 5}}
        />
      </TouchableOpacity>
      <Text style={{color: '#ffffff'}}>
        Check your connection and try again.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
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
    position: 'absolute',
    zIndex: 1,
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
  releaseDateText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Lato',
    marginLeft: 25,
  },
  releaseDate: {
    flex: 1,
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    marginLeft: 25,
    marginTop: 15,
  },
  genreText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Lato',
  },
  genreScrollView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
  genreBox: {
    width: 80,
    height: 32,
    backgroundColor: '#212028',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#58575D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    paddingHorizontal: 2,
  },
  genreText2: {
    fontSize: 12,
    fontFamily: 'Lato-Light',
    color: '#ffffff',
  },
  overviewText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Lato',
    marginLeft: 25,
  },
  overview: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    marginLeft: 25,
    marginTop: 5,
    marginRight: 25,
  },
  rmText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Lato',
    marginLeft: 25,
  },
  rmScrollView: {
    marginLeft: 25,
    marginTop: 5,
  },
});

export default MovieDetails;
