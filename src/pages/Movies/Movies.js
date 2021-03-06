import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiImgUrl} from '../../../services/api/api';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MovieDetails from './MovieDetails';
import Genres from '../Genres';
import ListCast from '../ListCast';
import ListRecommends from '../ListRecommends';
import Videos from '../Videos';
import ListVideos from '../ListVideos';
import PeopleDetails from '../PeopleDetails';
import ListCredits from '../ListCredits';
import TvSeriesDetails from '../TvSeries/TvSeriesDetails';
import Login from '../Login/Login';
import StarItem from '../StarItem';
import CreateList from '../CreateList';
import CreatedLists from '../CreatedLists';
import ProfileListDetails from '../Profile/Lists/ProfileListDetails';
import ProfileListEdit from '../Profile/Lists/ProfileListEdit';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import usePrevious from '../../hooks/usePrevious';
import RenderFooter from '../../components/RenderFooter';
import Stars from '../../components/Stars/Stars';
import NoImage from '../../images/noimage.png';
import strings from '../../localization/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;

const MoviesScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('popular');
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);

  useEffect(() => {
    getItems();
  }, [category, page]);

  useEffect(() => {
    setLanguage();
  }, []);

  const setLanguage = async () => {
    const preferredLanguage = await AsyncStorage.getItem('@preferred_lang');
    if (preferredLanguage !== null) {
      strings.setLanguage(preferredLanguage);
    }
  };

  //getdata with axios
  const getItems = async () => {
    const preferredLanguage = await AsyncStorage.getItem('@preferred_lang');
    try {
      const response = await api.get('/movie/' + category, {
        params: {
          page,
          language: preferredLanguage
            ? preferredLanguage
            : strings.getLanguage(),
        },
      });
      if (prevPage == page - 1) {
        setData([...data, ...response.data.results]);
        setIsExtraLoading(false);
      } else {
        setData(response.data.results);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPress = id => {
    navigation.navigate('MovieDetails', {
      itemId: id,
    });
  };

  const onPressCategory = categoryType => {
    setLoading(true);
    setPage(1);
    setCategory(categoryType);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>
          {category == 'popular'
            ? strings.popular
            : category == 'top_rated'
            ? strings.toprated
            : strings.upcoming}
        </Text>
        <Text style={styles.headerText2}> {strings.movies}</Text>
      </View>
      <View>
        <ScrollView horizontal={true} style={styles.categoryScrollView}>
          <TouchableOpacity
            disabled={category == 'popular' ? true : false}
            style={[
              styles.categoryBox,
              category == 'popular' && {backgroundColor: '#151517'},
            ]}
            onPress={() => onPressCategory('popular')}>
            <Text style={styles.categoryText}>{strings.popular}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={category == 'top_rated' ? true : false}
            style={[
              styles.categoryBox,
              category == 'top_rated' && {backgroundColor: '#151517'},
            ]}
            onPress={() => onPressCategory('top_rated')}>
            <Text style={styles.categoryText}>{strings.toprated}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={category == 'upcoming' ? true : false}
            style={[
              styles.categoryBox,
              category == 'upcoming' && {backgroundColor: '#151517'},
            ]}
            onPress={() => onPressCategory('upcoming')}>
            <Text style={styles.categoryText}>{strings.upcoming}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          style={{marginBottom: 50}}
          data={data}
          onEndReached={() => {
            setPage(page + 1);
            setIsExtraLoading(true);
          }}
          keyExtractor={({id}) => id}
          numColumns={2}
          ListFooterComponent={RenderFooter(isExtraLoading)}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.items}
              onPress={() => onPress(item.id)}>
              <Image
                style={{width: 150, height: 250, borderRadius: 10}}
                source={{
                  uri: item.poster_path
                    ? apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path
                    : NO_IMAGE,
                }}
                resizeMode={item.poster_path ? 'cover' : 'contain'}
              />
              <Text style={styles.itemsText}>{item.title}</Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Stars count={item.vote_average} size={15} />
                <Text style={styles.itemsText2}>{item.vote_average}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  headerView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    textAlignVertical: 'center',
    fontFamily: 'Lato-Regular',
  },
  headerText2: {
    color: '#FD8266',
    fontSize: 28,
    textAlignVertical: 'center',
    fontFamily: 'Lato-Regular',
  },
  categoryScrollView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginVertical: 20,
  },
  categoryBox: {
    width: 100,
    height: 36,
    backgroundColor: '#212028',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#58575D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Lato-Light',
    color: '#ffffff',
  },
  items: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  itemsText: {
    marginTop: 10,
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    width: 150,
  },
  itemsText2: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    marginLeft: 3,
  },
});

const MoviesStack = createNativeStackNavigator();

const Movies = ({navigation, route}) => {
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
      <MoviesStack.Navigator initialRouteName="Movies">
        <MoviesStack.Screen
          name="MoviesScreen"
          component={MoviesScreen}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="MovieDetails"
          component={MovieDetails}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="Genres"
          component={Genres}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ListCast"
          component={ListCast}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ListRecommends"
          component={ListRecommends}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="Videos"
          component={Videos}
          options={{headerShown: false, orientation: 'landscape'}}
        />
        <MoviesStack.Screen
          name="ListVideos"
          component={ListVideos}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="PeopleDetails"
          component={PeopleDetails}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ListCredits"
          component={ListCredits}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="TvSeriesDetails"
          component={TvSeriesDetails}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="StarItem"
          component={StarItem}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="CreateList"
          component={CreateList}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="CreatedLists"
          component={CreatedLists}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ProfileListDetails"
          component={ProfileListDetails}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ProfileListEdit"
          component={ProfileListEdit}
          options={{headerShown: false}}
        />
      </MoviesStack.Navigator>
    </View>
  );
};

export default Movies;
