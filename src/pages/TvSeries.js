import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TvSeriesDetails from './TvSeriesDetails';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const TvSeriesScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPopular();
  }, [page]);

  //getdata with axios
  const getPopular = async () => {
    try {
      const response = await api.get('/tv/popular', {
        params: {
          api_key: apiKey.API_KEY,
          page,
        },
      });
      setData([...data, ...response.data.results]);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPress = id => {
    navigation.navigate('TvSeriesDetails', {
      itemId: id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Popular</Text>
        <Text style={styles.headerText2}> TV Shows</Text>
      </View>


      <View style={styles.bodyView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            onEndReached={() => {
              setPage(page + 1);
            }}
            keyExtractor={({id}) => id}
            numColumns={2}
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
                <Text style={styles.itemsText}>{item.name}</Text>
                <Text style={styles.itemsText2}>{item.vote_average}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
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
  bodyView: {
    flex: 8,
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

const TvSeriesStack = createNativeStackNavigator();

const TvSeries = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = ['TvSeriesDetails'];
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
      <TvSeriesStack.Navigator initialRouteName="TvSeries">
        <TvSeriesStack.Screen
          name="TvSeriesScreen"
          component={TvSeriesScreen}
          options={{headerShown: false}}
        />
        <TvSeriesStack.Screen
          name="TvSeriesDetails"
          component={TvSeriesDetails}
          options={{headerShown: false}}
        />
      </TvSeriesStack.Navigator>
    </View>
  );
};

export default TvSeries;
