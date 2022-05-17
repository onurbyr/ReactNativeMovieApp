import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4, api} from '../../../services/api/api';
import LetterProfileImage from '../../components/LetterProfileImage';
import BoldText from '../../components/BoldText';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Login from '../Login/Login';
import Favorites from './Favorites';
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

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

const ProfileScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
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
              ToastAndroid.show('Successful Logout', ToastAndroid.SHORT);
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
      <BoldText style={styles.userName}>
        {data.username.charAt(0).toUpperCase() + data.username.slice(1)}
      </BoldText>
      <LinearGradient
        colors={['#4736AE', '#9761C6']}
        start={{x: 0.3, y: 0.5}}
        end={{x: 1.0, y: 1.0}}
        style={styles.profileContainer}>
        <LetterProfileImage style={styles.letterProfileImage}>
          {data.username}
        </LetterProfileImage>
      </LinearGradient>
      <ScrollView style={{marginBottom: 50}}>
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => navigation.navigate('Favorites')}>
          <MaterialIcons name="favorite-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>Favorites</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity style={styles.profileItem}>
          <MaterialIcons name="bookmark-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>Watchlist</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity style={styles.profileItem}>
          <MaterialIcons name="star-border" color={'#593FEE'} size={36} />
          <Text style={styles.profileItemText}>Ratings</Text>
          <View style={styles.rightArrow}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'#593FEE'}
              size={36}
            />
          </View>
        </TouchableOpacity>
        <Hr />
        <TouchableOpacity style={styles.profileItem}>
          <MaterialIcons
            name="format-list-bulleted"
            color={'#593FEE'}
            size={36}
          />
          <Text style={styles.profileItemText}>Lists</Text>
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
            <Text style={styles.logoutText}>Logout</Text>
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
  profileContainer: {
    width: windowWidth + 100,
    height: windowWidth + 100,
    backgroundColor: '#714EBB',
    borderRadius: (windowWidth + 100) / 2,
    marginTop: -(windowWidth / 2 + 120),
    marginLeft: -50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
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
