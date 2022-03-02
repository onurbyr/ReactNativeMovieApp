import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import BackButton from '../components/BackButton';
import NoAvatar from '../images/noavatar.png';
import NoImage from '../images/noimage.png';
import Entypo from 'react-native-vector-icons/Entypo';
import Hr from '../components/Hr';

const PeopleDetails = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const {itemId} = route.params;
  const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 5); //to check the text is more than 5 lines or not
  }, []);

  useEffect(() => {
    multipleRequests();
  }, []);

  const concurrentRequests = [
    api
      .get('/person/' + itemId, {
        params: {
          api_key: apiKey.API_KEY,
        },
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }),
    api
      .get('/person/' + itemId + '/movie_credits', {
        params: {
          api_key: apiKey.API_KEY,
        },
      })
      .catch(err => {
        //console.log(err.message);
      }),
    api
      .get('/person/' + itemId + '/tv_credits', {
        params: {
          api_key: apiKey.API_KEY,
        },
      })
      .catch(err => {
        //console.log(err.message);
      }),
  ];

  const multipleRequests = () => {
    Promise.all(concurrentRequests)
      .then(result => {
        setData(result[0].data);
        setMovieCredits(result[1].data.cast);
        setTvCredits(result[2].data.cast);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const getAge = dateString => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const yearsDiff = (d1, d2) => {
    let bornDate = new Date(d1);
    let deathDate = new Date(d2);
    let yearsDiff = deathDate.getFullYear() - bornDate.getFullYear();
    let m = deathDate.getMonth() - bornDate.getMonth();
    if (m < 0 || (m === 0 && deathDate.getDate() < bornDate.getDate())) {
      yearsDiff--;
    }
    return yearsDiff;
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
          <ScrollView>
            {data.profile_path && (
              <Image
                source={{
                  uri: apiImgUrl.API_IMAGE_URL + '/h632' + data.profile_path,
                }}
                blurRadius={5}
                style={{height: 250}}
              />
            )}
            <View
              style={
                data.profile_path ? styles.info : styles.noProfileImageInfo
              }>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: data.profile_path
                      ? apiImgUrl.API_IMAGE_URL + '/w500' + data.profile_path
                      : NO_AVATAR_IMAGE,
                  }}
                  resizeMode={data.profile_path ? 'cover' : 'center'}
                  style={
                    data.profile_path
                      ? styles.profileImage
                      : styles.noProfileImage
                  }
                />
                <View style={styles.imageLeftPanel}>
                  <BoldText>{data.name}</BoldText>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Known For:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.known_for_department}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Gender:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.gender == 1 ? 'Female' : ' Male'}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>Age:</DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.deathday
                        ? data.birthday &&
                          yearsDiff(data.birthday, data.deathday) + '(Dead)'
                        : data.birthday && getAge(data.birthday)}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Place of Birth:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.place_of_birth ? data.place_of_birth : '-'}
                    </DefaultText>
                  </View>
                </View>
              </View>
              {Object.keys(data.biography).length > 0 && (
                <View>
                  <BoldText style={{marginTop: 20}}>Biography</BoldText>
                  <Text
                    onTextLayout={onTextLayout}
                    numberOfLines={textShown ? undefined : 5}
                    style={styles.seeMoreText}>
                    {data.biography}
                  </Text>

                  {lengthMore ? (
                    <Text
                      onPress={toggleNumberOfLines}
                      style={styles.seeMoreText2}>
                      {textShown ? 'Read less...' : 'Read more...'}
                    </Text>
                  ) : null}
                </View>
              )}
              {Object.keys(movieCredits).length > 0 && (
                //movieCredits
                <View>
                  <Hr />
                  <View style={{flexDirection: 'row'}}>
                    <BoldText>Movie Credits</BoldText>
                    {Object.keys(movieCredits).length > 5 && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() =>
                          navigation.push('ListCredits', {
                            itemId: data.id,
                            creditType: 'movie',
                          })
                        }>
                        <DefaultText style={{fontSize: 14}}>
                          See All
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
                    {movieCredits
                      .filter((i, index) => index < 5)
                      .map((n, index) => (
                        <TouchableOpacity
                          key={index}
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
                          <BoldText
                            style={{
                              textAlign: 'center',
                              marginVertical: 10,
                              fontSize: 12,
                            }}>
                            {n.title}
                          </BoldText>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
              {Object.keys(tvCredits).length > 0 && (
                //tvCredits
                <View>
                  <Hr />
                  <View style={{flexDirection: 'row'}}>
                    <BoldText>Tv Credits</BoldText>
                    {Object.keys(tvCredits).length > 5 && (
                      <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() =>
                          navigation.push('ListCredits', {
                            itemId: data.id,
                            creditType: 'tv',
                          })
                        }>
                        <DefaultText style={{fontSize: 14}}>
                          See All
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
                    {tvCredits
                      .filter((i, index) => index < 5)
                      .map((n, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{marginRight: 25, width: 150}}
                          onPress={() =>
                            navigation.push('TvSeriesDetails', {
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
                          <BoldText
                            style={{
                              textAlign: 'center',
                              marginVertical: 10,
                              fontSize: 12,
                            }}>
                            {n.name}
                          </BoldText>
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

export default PeopleDetails;

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
  info: {
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: '#15141F',
    paddingHorizontal: 20,
  },
  noProfileImageInfo: {
    backgroundColor: '#15141F',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  profileImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginTop: -50,
  },
  noProfileImage: {
    width: 120,
    height: 180,
    marginTop: -20,
  },
  imageLeftPanel: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
  },
  imageLeftPanelItems: {
    flexDirection: 'row',
    marginTop: 5,
  },
  imageLeftPanelItemsText: {
    flex: 1,
    color: '#B6B6B6',
    marginLeft: 2,
  },
  seeMoreText: {
    lineHeight: 21,
    color: '#B6B6B6',
    fontFamily: 'Lato-Light',
    fontSize: 12,
    marginTop: 5,
  },
  seeMoreText2: {
    lineHeight: 21,
    marginTop: 5,
    color: '#B6B6B6',
    fontFamily: 'Lato-Regular',
  },
  seeAllButton: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 10,
  },
});
