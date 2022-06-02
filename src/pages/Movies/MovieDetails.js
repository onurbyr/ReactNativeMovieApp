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
  ToastAndroid,
} from 'react-native';
import {api, apiImgUrl} from '../../../services/api/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import NoImage from '../../images/noimage.png';
import NoAvatar from '../../images/noavatar.png';
import DefaultText from '../../components/DefaultText';
import BoldText from '../../components/BoldText';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton/CustomButton';
import Hr from '../../components/Hr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fav, watchlist, star, list} from './postItem';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import strings from '../../localization/strings';

const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const {itemId} = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWatchList, setIsWatchList] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isWatchListLoading, setIsWatchListLoading] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);

  const req1 = `/movie/${itemId}`;
  const req2 = `/movie/${itemId}/recommendations`;
  const req3 = `/movie/${itemId}/credits`;
  const req4 = `/movie/${itemId}/videos`;
  const req5 = `/movie/${itemId}/account_states`;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@session_id');
      if (value !== null) {
        multipleRequests([
          {
            req: req1,
            params: {
              language: strings.getLanguage(),
            },
          },
          {
            req: req2,
            params: {
              language: strings.getLanguage(),
            },
          },
          {req: req3},
          {
            req: req4,
            params: {
              language: strings.getLanguage(),
            },
          },
          {
            req: req5,
            params: {
              session_id: value,
            },
          },
        ]);
      } else {
        multipleRequests([
          {
            req: req1,
            params: {
              language: strings.getLanguage(),
            },
          },
          {
            req: req2,
            params: {
              language: strings.getLanguage(),
            },
          },
          {req: req3},
          {
            req: req4,
            params: {
              language: strings.getLanguage(),
            },
          },
        ]);
      }
    } catch (e) {
      // error reading value
    }
  };

  const multipleRequests = requests => {
    const concurrentRequests = requests.map(n =>
      api.get(n.req, {params: n.params}).catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }),
    );

    Promise.all(concurrentRequests)
      .then(result => {
        setData(result[0].data);
        setRecommend(result[1].data.results);
        setCast(result[2].data.cast);
        setVideos(result[3].data.results);
        setLoading(false);
        result[4].data && setIsFavorited(result[4].data.favorite);
        result[4].data && setIsWatchList(result[4].data.watchlist);
        result[4].data && result[4].data.rated.value
          ? setIsStarred(true)
          : setIsStarred(false);
      })
      .catch(err => {
        //console.log(err.message);
      });
  };

  const dateConvert = n => {
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
    const d = new Date(n);
    const date =
      strings.months[months[d.getMonth()]] +
      ' ' +
      d.getDate() +
      ',' +
      ' ' +
      d.getFullYear();
    return date;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <BackButton style={[styles.backButton, {top: 0}]} />
          <ActivityIndicator />
        </View>
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
            {isFavLoading ? (
              <CustomActivityIndicator style={styles.favoriteButton} />
            ) : isFavorited ? (
              <CustomButton
                style={styles.favoriteButton}
                type="MaterialIcons"
                name="favorite"
                color="#CF3131"
                size={22}
                onPress={() =>
                  fav(data.id, navigation, setIsFavorited, setIsFavLoading)
                }
              />
            ) : (
              <CustomButton
                style={styles.favoriteButton}
                type="MaterialIcons"
                name="favorite-border"
                color="white"
                size={22}
                onPress={() =>
                  fav(data.id, navigation, setIsFavorited, setIsFavLoading)
                }
              />
            )}
            {isWatchListLoading ? (
              <CustomActivityIndicator style={styles.watchListButton} />
            ) : isWatchList ? (
              <CustomButton
                style={styles.watchListButton}
                type="MaterialIcons"
                name="bookmark"
                color="#CF3131"
                size={22}
                onPress={() =>
                  watchlist(
                    data.id,
                    navigation,
                    setIsWatchList,
                    setIsWatchListLoading,
                  )
                }
              />
            ) : (
              <CustomButton
                style={styles.watchListButton}
                type="MaterialIcons"
                name="bookmark-border"
                color="white"
                size={22}
                onPress={() =>
                  watchlist(
                    data.id,
                    navigation,
                    setIsWatchList,
                    setIsWatchListLoading,
                  )
                }
              />
            )}
            {isStarLoading ? (
              <CustomActivityIndicator style={styles.starButton} />
            ) : isStarred ? (
              <CustomButton
                style={styles.starButton}
                type="MaterialIcons"
                name="star"
                color="#F57800"
                size={22}
                onPress={() => star(data, navigation, setIsStarLoading)}
              />
            ) : (
              <CustomButton
                style={styles.starButton}
                type="MaterialIcons"
                name="star-border"
                color="white"
                size={22}
                onPress={() => star(data, navigation, setIsStarLoading)}
              />
            )}
            <CustomButton
              style={styles.listButton}
              type="MaterialIcons"
              name="add"
              color="white"
              size={22}
              onPress={() => list(data.id, navigation)}
            />
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
                  {data.runtime + ' ' + strings.minutes}
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
                  <BoldText>{strings.releasedate}</BoldText>
                  <DefaultText style={styles.releaseDate}>
                    {dateConvert(data.release_date)}
                  </DefaultText>
                </View>
                <View style={{flex: 1}}>
                  <BoldText>{strings.genre}</BoldText>
                  <ScrollView horizontal={true} style={styles.genreScrollView}>
                    {data.genres &&
                      data.genres.map(n => (
                        <TouchableOpacity
                          key={n.id}
                          style={styles.genreBox}
                          onPress={() =>
                            navigation.push('Genres', {
                              itemId: n.id,
                              itemName: n.name,
                              genreType: 'movie',
                            })
                          }>
                          <DefaultText>{n.name}</DefaultText>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </View>
              <Hr />
              {Object.keys(data.overview).length > 0 && (
                //Overview
                <View>
                  <BoldText>{strings.overview}</BoldText>
                  <DefaultText style={styles.overview}>
                    {data.overview}
                  </DefaultText>
                  <Hr />
                </View>
              )}
              {Object.keys(cast).length > 0 && (
                //Cast
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <BoldText>{strings.cast}</BoldText>
                    {Object.keys(cast).length > 5 && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() =>
                          navigation.navigate('ListCast', {
                            cast: cast,
                          })
                        }>
                        <DefaultText style={{fontSize: 14}}>
                          {strings.seeall}
                        </DefaultText>
                        <Entypo
                          name="chevron-right"
                          color={'white'}
                          size={14}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <ScrollView horizontal={true} style={{marginTop: 10}}>
                    {cast
                      .filter((i, index) => index < 5)
                      .map((n, index) => (
                        <TouchableOpacity
                          key={n.id}
                          style={{marginRight: 25, width: 100}}
                          onPress={() =>
                            navigation.push('PeopleDetails', {
                              itemId: n.id,
                            })
                          }>
                          <Image
                            style={{
                              width: 100,
                              height: 150,
                              borderRadius: 10,
                            }}
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
                </View>
              )}
              {Object.keys(videos).length > 0 && (
                //Videos
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <BoldText>{strings.videos}</BoldText>
                    {Object.keys(videos).length > 5 && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() =>
                          navigation.navigate('ListVideos', {
                            videos,
                          })
                        }>
                        <DefaultText style={{fontSize: 14}}>
                          {strings.seeall}
                        </DefaultText>
                        <Entypo
                          name="chevron-right"
                          color={'white'}
                          size={14}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <ScrollView horizontal={true} style={{marginTop: 10}}>
                    {videos
                      .filter((i, index) => index < 5)
                      .map((n, index) => (
                        <TouchableOpacity
                          key={n.id}
                          style={{marginRight: 25, width: 200}}
                          onPress={() =>
                            navigation.navigate('Videos', {
                              itemId: n.key,
                            })
                          }>
                          <Image
                            style={{
                              width: 200,
                              height: 150,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: `https://img.youtube.com/vi/${n.key}/hqdefault.jpg`,
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
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                  <Hr />
                </View>
              )}
              {Object.keys(recommend).length > 0 && (
                //Recommendations
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <BoldText>{strings.recommendations}</BoldText>
                    {Object.keys(recommend).length > 5 && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() =>
                          navigation.push('ListRecommends', {
                            itemId: data.id,
                            recommendType: 'movie',
                          })
                        }>
                        <DefaultText style={{fontSize: 14}}>
                          {strings.seeall}
                        </DefaultText>
                        <Entypo
                          name="chevron-right"
                          color={'white'}
                          size={14}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
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
              )}
            </View>
          </ScrollView>
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
  favoriteButton: {
    marginTop: 20,
    right: 20,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  watchListButton: {
    marginTop: 70,
    right: 20,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  starButton: {
    marginTop: 120,
    right: 20,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  listButton: {
    marginTop: 170,
    right: 20,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
});

export default MovieDetails;
