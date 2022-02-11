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
import {Picker} from '@react-native-picker/picker';

const TvSeriesScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedGenre, setSelectedGenre] = useState();

  useEffect(() => {
    getPopular();
  }, []);

  const addElement = newData => {
    let newArray = [...data, ...newData];
    setData(newArray);
  };

  //getdata with axios
  const getPopular = async () => {
    try {
      const response = await api.get('/tv/popular', {
        params: {
          api_key: apiKey.API_KEY,
          page,
        },
      });
      setPage(page + 1);
      addElement(response.data.results);
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

      <View style={styles.pickerView}>
        <Picker
          style={styles.pickers}
          dropdownIconColor="#FF937A"
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCategory(itemValue)
          }>
          <Picker.Item color="#FF937A" label="Popular" value="popular" />
          <Picker.Item color="#FF937A" label="Upcoming" value="upcoming" />
          <Picker.Item color="#FF937A" label="Top Rated" value="toprated" />
        </Picker>
        <Picker
          style={styles.pickers}
          dropdownIconColor="#FF937A"
          selectedValue={selectedGenre}
          onValueChange={(itemValue, itemIndex) => setSelectedGenre(itemValue)}>
          <Picker.Item enabled={false} color="#737373" label="Genre" />
          <Picker.Item color="#FF937A" label="Test" value="test" />
        </Picker>
      </View>

      <View style={styles.bodyView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            onEndReached={() => {
              getPopular();
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
  pickerView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pickers: {
    flex: 1,
    marginLeft: 10,
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
