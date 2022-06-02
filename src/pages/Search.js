import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState, createContext, useContext} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {api, apiImgUrl} from '../../services/api/api';
import NoImage from '../images/noimage.png';
import NoAvatar from '../images/noavatar.png';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MovieDetails from './Movies/MovieDetails';
import TvSeriesDetails from './TvSeries/TvSeriesDetails';
import Genres from './Genres';
import ListCast from './ListCast';
import ListRecommends from './ListRecommends';
import Videos from './Videos';
import ListVideos from './ListVideos';
import PeopleDetails from './PeopleDetails';
import ListCredits from './ListCredits';
import Login from './Login/Login';
import StarItem from './StarItem';
import CreateList from './CreateList';
import CreatedLists from './CreatedLists';
import ProfileListDetails from './Profile/Lists/ProfileListDetails';
import ProfileListEdit from './Profile/Lists/ProfileListEdit';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import strings from '../localization/strings';

const InputContext = createContext();
const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

const SearchScreen = () => {
  const [value, onChangeText] = useState('');
  const [closeButtonVisible, setCloseButtonVisible] = useState(false);
  return (
    <InputContext.Provider value={{value: value, setCloseButtonVisible}}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>{strings.findmoviestvseries}</Text>
        <View style={styles.searchSection}>
          <Feather
            style={styles.searchIcon}
            name="search"
            color="white"
            size={18}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#BBBBBB"
            placeholder={strings.search}
            //onChangeText={text => navigation.jumpTo(type, {input: text})}
            onChangeText={text => onChangeText(text)}
            value={value}
          />
          {closeButtonVisible && (
            <TouchableOpacity
              style={styles.closeIconTouchable}
              onPress={() => onChangeText('')}>
              <AntDesign
                style={styles.closeIcon}
                name="close"
                color="white"
                size={18}
              />
            </TouchableOpacity>
          )}
        </View>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {fontSize: 14, textTransform: 'none'},
            tabBarItemStyle: {width: 100},
            tabBarActiveTintColor: '#FD8266',
            tabBarInactiveTintColor: '#E2E2E2',
            tabBarStyle: {
              backgroundColor: '#15141F',
            },
            tabBarIndicatorStyle: {
              width: 20,
              backgroundColor: '#FD8266',
              marginLeft: 27,
            },
          }}>
          <Tab.Screen name={strings.movies} component={Movies} />
          <Tab.Screen name={strings.tvseries} component={TvSeries} />
          <Tab.Screen name={strings.people} component={People} />
        </Tab.Navigator>
      </SafeAreaView>
    </InputContext.Provider>
  );
};

const Tab = createMaterialTopTabNavigator();

const RenderItems = ({apiType, navigation}) => {
  const [data, setData] = useState([]);
  const value = useContext(InputContext).value;
  const setCloseButtonVisible = useContext(InputContext).setCloseButtonVisible;
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    value !== '' ? setCloseButtonVisible(true) : setCloseButtonVisible(false);
    getNetInfo();
    if (isConnected) {
      setLoading(true);
      setData([]);
      setPage(1);
      const delayDebounceFn = setTimeout(() => {
        value && searchItems(false);
      }, 100);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [value]);

  useEffect(() => {
    getNetInfo();
    if (isConnected) {
      value && searchItems(true);
    }
  }, [page]);

  const searchItems = async searchExtra => {
    try {
      const response = await api.get('/search/' + apiType, {
        params: {
          query: value,
          page,
          language: strings.getLanguage(),
        },
      });
      //console.log(response.data);
      searchExtra
        ? setData([...data, ...response.data.results])
        : setData(response.data.results);
    } catch (error) {
      // handle error
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      setConnected(state.isConnected);
    });
  };

  const onPress = item => {
    if (apiType == 'movie') {
      navigation.navigate('MovieDetails', {
        itemId: item.id,
      });
    } else if (apiType == 'tv') {
      navigation.navigate('TvSeriesDetails', {
        itemId: item.id,
      });
    } else {
      navigation.navigate('PeopleDetails', {
        itemId: item.id,
      });
    }
  };

  if (isConnected) {
    if (value) {
      return (
        <SafeAreaView style={styles.container}>
          {isLoading ? (
            <ActivityIndicator />
          ) : Object.keys(data).length !== 0 ? (
            <FlatList
              style={{marginBottom: 50}}
              data={data}
              onEndReached={() => setPage(page + 1)}
              keyExtractor={({id}) => id}
              numColumns={2}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.items}
                  onPress={() => onPress(item)}>
                  {apiType == 'person' ? (
                    <Image
                      style={{width: 150, height: 220, borderRadius: 10}}
                      source={{
                        uri: item.profile_path
                          ? apiImgUrl.API_IMAGE_URL +
                            '/w500' +
                            item.profile_path
                          : NO_AVATAR_IMAGE,
                      }}
                      resizeMode={'contain'}
                    />
                  ) : (
                    <Image
                      style={{width: 150, height: 220, borderRadius: 10}}
                      source={{
                        uri: item.poster_path
                          ? apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path
                          : NO_IMAGE,
                      }}
                      resizeMode={'contain'}
                    />
                  )}
                  <Text style={styles.itemsText}>
                    {item.title ? item.title : item.name}
                  </Text>
                  <Text style={styles.itemsText2}>{item.vote_average}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', paddingBottom: 50}}>
                {strings.thereareno}
                {apiType == 'movie'
                  ? ' ' + strings.movies.toLowerCase() + ' '
                  : apiType == 'tv'
                  ? ' ' + strings.tvshows.toLowerCase() + ' '
                  : ' ' + strings.people.toLowerCase() + ' '}
                {strings.thatmatchedyourquery}
              </Text>
            </View>
          )}
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView
          style={[
            styles.container,
            {alignItems: 'center', justifyContent: 'center', paddingBottom: 50},
          ]}>
          <Feather name="search" color="white" size={60} />
        </SafeAreaView>
      );
    }
  } else {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center', paddingBottom: 50},
        ]}>
        <Text style={{color: 'white'}}>
          {strings.messages.checkyourconnection}
        </Text>
      </SafeAreaView>
    );
  }
};

const Movies = ({navigation}) => (
  <RenderItems apiType={'movie'} navigation={navigation} />
);
const TvSeries = ({navigation}) => (
  <RenderItems apiType={'tv'} navigation={navigation} />
);
const People = ({navigation}) => (
  <RenderItems apiType={'person'} navigation={navigation} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  textHeader: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
    marginTop: 25,
  },
  searchSection: {
    flexDirection: 'row',
    backgroundColor: '#211F30',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    alignItems: 'center',
    height: 50,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#BBBBBB',
  },
  closeIconTouchable: {
    height: '100%',
    justifyContent: 'center',
  },
  closeIcon: {
    marginRight: 18,
  },
  items: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  itemsText: {
    marginTop: 10,
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  itemsText2: {
    marginTop: 5,
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
});

const SearchStack = createNativeStackNavigator();

const Search = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = [
      'MovieDetails',
      'TvSeriesDetails',
      'Genres',
      'ListCast',
      'ListRecommends',
      'Videos',
      'ListVideos',
      'PeopleDetails',
      'ListCredits',
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
      <SearchStack.Navigator initialRouteName="Search">
        <SearchStack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="MovieDetails"
          component={MovieDetails}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="TvSeriesDetails"
          component={TvSeriesDetails}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="Genres"
          component={Genres}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="ListCast"
          component={ListCast}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="ListRecommends"
          component={ListRecommends}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="Videos"
          component={Videos}
          options={{headerShown: false, orientation: 'landscape'}}
        />
        <SearchStack.Screen
          name="ListVideos"
          component={ListVideos}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="PeopleDetails"
          component={PeopleDetails}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="ListCredits"
          component={ListCredits}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="StarItem"
          component={StarItem}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="CreateList"
          component={CreateList}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="CreatedLists"
          component={CreatedLists}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="ProfileListDetails"
          component={ProfileListDetails}
          options={{headerShown: false}}
        />
        <SearchStack.Screen
          name="ProfileListEdit"
          component={ProfileListEdit}
          options={{headerShown: false}}
        />
      </SearchStack.Navigator>
    </View>
  );
};

export default Search;
