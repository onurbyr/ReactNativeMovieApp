import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import {api, apiKey, apiImgUrl} from '../../../services/api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import NoImage from '../../images/noimage.png';
import axios from 'axios';
import DefaultText from '../../components/DefaultText';
import BoldText from '../../components/BoldText';
import BackButton from '../../components/BackButton';

const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isConnected, setConnected] = useState(false);
  const [recommend, setRecommend] = useState([]);
  const [cast, setCast] = useState([]);

  const {itemId} = route.params;

  useEffect(() => {
    multipleRequests();
    getNetInfo();
    dateConvert();
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      setConnected(state.isConnected);
    });
  };

  const reqDetails = api.get('/movie/' + itemId, {
    params: {
      api_key: apiKey.API_KEY,
    },
  });
  const reqRecommend = api.get('/movie/' + itemId + '/recommendations', {
    params: {
      api_key: apiKey.API_KEY,
    },
  });
  const reqCredits = api.get('/movie/' + itemId + '/credits', {
    params: {
      api_key: apiKey.API_KEY,
    },
  });

  const multipleRequests = () => {
    axios
      .all([reqDetails, reqRecommend, reqCredits])
      .then(
        axios.spread((...responses) => {
          setData(responses[0].data);
          setRecommend(responses[1].data.results);
          setCast(responses[2].data.cast);
          setLoading(false);
        }),
      )
      .catch(errors => {
        // handle error
        console.log(errors.message);
      });
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
          marginVertical: 20,
          marginRight: 20,
          opacity: 0.3,
        }}
      />
    );
  };

  if (isConnected)
    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator style={{flex: 1}} />
        ) : (
          <View style={styles.container}>
            <BackButton style={styles.backButton} />
            <ScrollView style={{flex: 1}}>
              <Image
                source={{
                  uri: data.backdrop_path
                    ? apiImgUrl.API_IMAGE_URL + '/w1280' + data.backdrop_path
                    : NO_IMAGE,
                }}
                resizeMode={data.backdrop_path ? 'stretch' : 'center'}
                style={{height: 250}}></Image>
              <View style={{paddingLeft: 25}}>
                <BoldText style={styles.title}>{data.title}</BoldText>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="time-outline"
                    color={'white'}
                    size={12}
                    style={styles.minutesIcon}
                  />
                  <DefaultText style={styles.minutes}>
                    {data.runtime + ' minutes'}
                  </DefaultText>
                  <Ionicons
                    name="star"
                    color={'white'}
                    size={12}
                    style={styles.starsIcon}
                  />
                  <DefaultText style={styles.stars}>
                    {data.vote_average + ' (Tmdb)'}
                  </DefaultText>
                </View>
                <Hr />
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <BoldText>Release Date</BoldText>
                    <DefaultText style={styles.releaseDate}>
                      {dateConvert()}
                    </DefaultText>
                  </View>
                  <View style={{flex: 1}}>
                    <BoldText>Genre</BoldText>
                    <ScrollView
                      horizontal={true}
                      style={styles.genreScrollView}>
                      {data.genres &&
                        data.genres.map(n => (
                          <TouchableOpacity
                            key={n.id}
                            style={styles.genreBox}
                            onPress={() =>
                              navigation.push('MoviesGenres', {
                                itemId: n.id,
                                itemName: n.name,
                              })
                            }>
                            <DefaultText>{n.name}</DefaultText>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                </View>

                <Hr />
                <BoldText style={styles.overviewText}>Overview</BoldText>
                <DefaultText style={styles.overview}>
                  {data.overview}
                </DefaultText>
                <Hr />
                <BoldText style={styles.rmText}>Recommendations</BoldText>
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
                            uri: n.backdrop_path
                              ? apiImgUrl.API_IMAGE_URL +
                                '/w300' +
                                n.backdrop_path
                              : NO_IMAGE,
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
              </View>
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
      <BackButton style={[styles.backButton, {left: 0, top: 0}]} />
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
    marginTop: 20,
    position: 'absolute',
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    marginRight: 25,
    marginTop: 20,
  },
  minutesIcon: {
    marginTop: 15,
  },
  minutes: {
    marginLeft: 5,
    marginTop: 15,
  },
  starsIcon: {
    marginLeft: 25,
    marginTop: 15,
  },
  stars: {
    marginLeft: 5,
    marginTop: 15,
  },
  releaseDate: {
    marginTop: 15,
  },
  genreScrollView: {
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
  overview: {
    marginTop: 5,
    marginRight: 25,
  },
  rmScrollView: {
    marginTop: 5,
  },
});

export default MovieDetails;
