import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4, api} from '../../../services/api/api';
import LetterProfileImage from '../../components/LetterProfileImage';
import BoldText from '../../components/BoldText';
import TransparentBox from '../../components/TransparentBox';
import CustomButton from '../../components/CustomButton/CustomButton';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Login from '../Login/Login';
import Favorites from './Favorites';
import Watchlist from './Watchlist';
import Ratings from './Ratings';
import ProfileLists from './Lists/ProfileLists';
import ProfileListDetails from './Lists/ProfileListDetails';
import ProfileListEdit from './Lists/ProfileListEdit';
import MovieDetails from '../Movies/MovieDetails';
import TvSeriesDetails from '../TvSeries/TvSeriesDetails';
import Genres from '../Genres';
import ListCast from '../ListCast';
import ListRecommends from '../ListRecommends';
import Videos from '../Videos';
import ListVideos from '../ListVideos';
import PeopleDetails from '../PeopleDetails';
import ListCredits from '../ListCredits';
import StarItem from '../StarItem';
import CreateList from '../CreateList';
import CreatedLists from '../CreatedLists';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import strings from '../../localization/strings';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

const ProfileScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isTransparentBoxHidden, setIsTransparentBoxHidden] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems();
    });

    return unsubscribe;
  }, [navigation]);

  const getItems = async () => {
    const value = await AsyncStorage.getItem('@session_id');
    if (value !== null) {
      try {
        const response = await api.get(`/account`, {
          params: {
            session_id: value,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const Logout = async () => {
    try {
      //const value = await AsyncStorage.getItem('@session_id');
      const sessionId = await AsyncStorage.getItem('@session_id');
      const accessToken = await AsyncStorage.getItem('@access_token');
      if (sessionId !== null) {
        try {
          const result = await apiv4.delete('/auth/access_token', {
            data: {
              access_token: accessToken,
            },
          });
          if (result.data.success == true) {
            try {
              await AsyncStorage.removeItem('@session_id');
              await AsyncStorage.removeItem('@access_token');
              await AsyncStorage.removeItem('@account_id');
              navigation.navigate('Movies', {screen: 'MoviesScreen'});
              ToastAndroid.show(
                strings.messages.successfullogout,
                ToastAndroid.SHORT,
              );
            } catch (e) {
              // remove error
            }
          }
        } catch (err) {
          console.log(err.response.data);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  const setLang = async lang => {
    try {
      await AsyncStorage.setItem('@preferred_lang', lang);
      setIsTransparentBoxHidden(true);
      ToastAndroid.show(
        strings.messages.youneedtorestartapp,
        ToastAndroid.SHORT,
      );
    } catch (e) {}
  };
  const clearLang = async () => {
    try {
      await AsyncStorage.removeItem('@preferred_lang');
      setIsTransparentBoxHidden(true);
      ToastAndroid.show(
        strings.messages.youneedtorestartapp,
        ToastAndroid.SHORT,
      );
    } catch (e) {}
  };

  const shareProfile = async () => {
    try {
      await Share.share({
        message: `${strings.mytmdbprofile} | https://www.themoviedb.org/u/${data.username}`,
      });
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  const Hr = () => {
    return (
      <View
        style={{
          borderBottomColor: '#959595',
          borderBottomWidth: 0.5,
          opacity: 0.3,
        }}
      />
    );
  };

  return isLoading ? (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={styles.container}>
      <TransparentBox
        isHidden={isTransparentBoxHidden}
        hide={() => setIsTransparentBoxHidden(true)}>
        <TouchableOpacity
          style={styles.languageButtons}
          onPress={() => setLang('en')}>
          <BoldText style={{fontSize: 28}}>{strings.english}</BoldText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.languageButtons}
          onPress={() => setLang('tr')}>
          <BoldText style={{fontSize: 28}}>{strings.turkish}</BoldText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.languageButtons}
          onPress={() => clearLang()}>
          <BoldText style={{fontSize: 28}}>{strings.systemlanguage}</BoldText>
        </TouchableOpacity>
        <CustomButton
          type="MaterialIcons"
          name="close"
          color="#4736AE"
          style={{backgroundColor: 'white'}}
          size={22}
          onPress={() => setIsTransparentBoxHidden(true)}
        />
      </TransparentBox>
      <BoldText style={styles.userName}>
        {data.username.charAt(0).toUpperCase() + data.username.slice(1)}
      </BoldText>
      <LinearGradient
        colors={['#4736AE', '#9761C6']}
        start={{x: 0.3, y: 0.5}}
        end={{x: 1.0, y: 1.0}}
        style={styles.profileContainer}>
        <View style={{flexDirection: 'row'}}>
          <CustomButton
            onPress={shareProfile}
            style={styles.profileContainerButtons}
            type="MaterialIcons"
            name="share"
            color="#dddddd"
            size={26}
          />
          <LetterProfileImage style={styles.letterProfileImage}>
            {data.username}
          </LetterProfileImage>
          <CustomButton
            onPress={() => setIsTransparentBoxHidden(false)}
            style={styles.profileContainerButtons}
            type="Ionicons"
            name="language"
            color="#dddddd"
            size={26}
          />
        </View>
      </LinearGradient>
      <ScrollView style={{marginBottom: 50}}>
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => navigation.navigate('Favorites')}>
          <MaterialIcons name="favorite-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>{strings.favorites}</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => navigation.navigate('Watchlist')}>
          <MaterialIcons name="bookmark-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>{strings.watchlist}</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => navigation.navigate('Ratings')}>
          <MaterialIcons name="star-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>{strings.ratings}</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => navigation.navigate('ProfileLists')}>
          <MaterialIcons
            name="format-list-bulleted"
            color={'#593FEE'}
            size={36}
          />
          <Text style={styles.profileItemText}>{strings.lists}</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <LinearGradient
          colors={['#4736AE', '#9761C6']}
          start={{x: 0.3, y: 0.5}}
          end={{x: 1.0, y: 1.0}}
          style={styles.logoutGradient}>
          <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
            <Text style={styles.logoutText}>{strings.logout}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  languageButtons: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  profileContainer: {
    width: windowWidth + 100,
    height: windowWidth + 100,
    borderRadius: (windowWidth + 100) / 2,
    marginTop: -(windowWidth / 2 + 120),
    marginLeft: -50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  profileContainerButtons: {
    top: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#593FEE',
  },
  userName: {
    fontSize: 28,
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 50,
  },
  letterProfileImage: {
    top: 35,
  },
  profileItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileItemText: {
    marginLeft: 30,
    fontSize: 18,
    color: '#959595',
  },
  rightArrow: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoutGradient: {
    width: 200,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  logoutButton: {
    width: 200,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
});

const ProfileStack = createNativeStackNavigator();

const Profile = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = [
      'MovieDetails',
      'Genres',
      'ListCast',
      'ListRecommends',
      'Videos',
      'ListVideos',
      'PeopleDetails',
      'ListCredits',
      'TvSeriesDetails',
      'Login',
      'StarItem',
    ];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#15141F',
          borderTopWidth: 0,
          position: 'absolute',
        },
      });
    }
  }, [navigation, route]);
  return (
    <View style={{flex: 1, backgroundColor: '#15141F'}}>
      <ProfileStack.Navigator initialRouteName="Profile">
        <ProfileStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false, orientation: 'portrait'}}
        />
        <ProfileStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Favorites"
          component={Favorites}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Watchlist"
          component={Watchlist}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Ratings"
          component={Ratings}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ProfileLists"
          component={ProfileLists}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ProfileListDetails"
          component={ProfileListDetails}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ProfileListEdit"
          component={ProfileListEdit}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="MovieDetails"
          component={MovieDetails}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="TvSeriesDetails"
          component={TvSeriesDetails}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Genres"
          component={Genres}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ListCast"
          component={ListCast}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ListRecommends"
          component={ListRecommends}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="Videos"
          component={Videos}
          options={{headerShown: false, orientation: 'landscape'}}
        />
        <ProfileStack.Screen
          name="ListVideos"
          component={ListVideos}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="PeopleDetails"
          component={PeopleDetails}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="ListCredits"
          component={ListCredits}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="StarItem"
          component={StarItem}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="CreateList"
          component={CreateList}
          options={{headerShown: false}}
        />
        <ProfileStack.Screen
          name="CreatedLists"
          component={CreatedLists}
          options={{headerShown: false}}
        />
      </ProfileStack.Navigator>
    </View>
  );
};

export default Profile;
