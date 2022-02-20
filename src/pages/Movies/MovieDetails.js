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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import NetInfo from '@react-native-community/netinfo';
import NoImage from '../../images/noimage.png';
import NoAvatar from '../../images/noavatar.png';
import DefaultText from '../../components/DefaultText';
import BoldText from '../../components/BoldText';
import BackButton from '../../components/BackButton';

const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isConnected, setConnected] = useState(true);
  const [recommend, setRecommend] = useState([]);
  const [cast, setCast] = useState([]);

  const {itemId} = route.params;

  useEffect(() => {
    getNetInfo();
    multipleRequests();
    dateConvert();
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      setConnected(state.isConnected);
    });
  };

  const concurrentRequests = [
    api.get('/movie/' + itemId, {
      params: {
        api_key: apiKey.API_KEY,
      },
    }),
    api.get('/movie/' + itemId + '/recommendations', {
      params: {
        api_key: apiKey.API_KEY,
      },
    }),
    api.get('/movie/' + itemId + '/credits', {
      params: {
        api_key: apiKey.API_KEY,
      },
    }),
  ];
  const multipleRequests = () => {
    Promise.all(concurrentRequests)
      .then(result => {
        setData(result[0].data);
        setRecommend(result[1].data.results);
        setCast(result[2].data.cast);
      })
      .catch(err => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
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
                <BoldText>Overview</BoldText>
                <DefaultText style={styles.overview}>
                  {data.overview}
                </DefaultText>
                <Hr />
                <View style={{flexDirection: 'row'}}>
                  <BoldText>Cast</BoldText>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() =>
                      navigation.navigate('ListCast', {
                        cast: cast,
                      })
                    }>
                    <DefaultText style={{fontSize: 14}}>See All</DefaultText>
                    <Entypo name="chevron-right" color={'white'} size={14} />
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} style={{marginTop: 10}}>
                  {cast
                    .filter((i, index) => index < 5)
                    .map((n, index) => (
                      <TouchableOpacity
                        key={n.id}
                        style={{marginRight: 25, width: 100}}
                        // onPress={() =>
                        //   navigation.push('MovieDetails', {
                        //     itemId: n.id,
                        //   })
                        // }
                      >
                        <Image
                          style={{width: 100, height: 150, borderRadius: 10}}
                          source={{
                            uri: n.profile_path
                              ? apiImgUrl.API_IMAGE_URL +
                                '/w185' +
                                n.profile_path
                              : NO_AVATAR_IMAGE,
                          }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            marginTop: 5,
                          }}>
                          {n.name}
                        </Text>
                        <DefaultText
                          style={{
                            fontSize: 10,
                            textAlign: 'center',
                            marginTop: 5,
                          }}>
                          {n.character}
                        </DefaultText>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
                <Hr />
                <BoldText>Recommendations</BoldText>
                <ScrollView horizontal={true} style={{marginTop: 10}}>
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
  seeAllButton: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 10,
  },
});

export default MovieDetails;
