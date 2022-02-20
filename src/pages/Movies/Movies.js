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
import {api, apiKey, apiImgUrl} from '../../../services/api/api';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MovieDetails from './MovieDetails';
import MoviesGenres from './MoviesGenres';
import ListCast from '../ListCast';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import usePrevious from '../../hooks/usePrevious';
import RenderFooter from '../../components/RenderFooter';

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

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get('/movie/' + category, {
        params: {
          api_key: apiKey.API_KEY,
          page,
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
            ? 'Popular'
            : category == 'top_rated'
            ? 'Top Rated'
            : 'Upcoming'}
        </Text>
        <Text style={styles.headerText2}> Movies</Text>
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
            <Text style={styles.categoryText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={category == 'top_rated' ? true : false}
            style={[
              styles.categoryBox,
              category == 'top_rated' && {backgroundColor: '#151517'},
            ]}
            onPress={() => onPressCategory('top_rated')}>
            <Text style={styles.categoryText}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={category == 'upcoming' ? true : false}
            style={[
              styles.categoryBox,
              category == 'upcoming' && {backgroundColor: '#151517'},
            ]}
            onPress={() => onPressCategory('upcoming')}>
            <Text style={styles.categoryText}>Upcoming</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {isLoading ? (
        <ActivityIndicator />
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
                  uri: apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path,
                }}
              />
              <Text style={styles.itemsText}>{item.title}</Text>
              <Text style={styles.itemsText2}>{item.vote_average}</Text>
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
  },
  itemsText2: {
    marginTop: 5,
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
});

const MoviesStack = createNativeStackNavigator();

const Movies = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = ['MovieDetails', 'MoviesGenres', 'ListCast'];
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
          name="MoviesGenres"
          component={MoviesGenres}
          options={{headerShown: false}}
        />
        <MoviesStack.Screen
          name="ListCast"
          component={ListCast}
          options={{headerShown: false}}
        />
      </MoviesStack.Navigator>
    </View>
  );
};

export default Movies;
