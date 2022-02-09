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
import IconFeather from 'react-native-vector-icons/Feather';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import NoImage from '../images/noimage.png';
import NoAvatar from '../images/noavatar.png';

const InputContext = createContext();
const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

const searchItems = async (mediaType, input, setLoading) => {
  try {
    const response = await api.get('/search/' + mediaType, {
      params: {
        api_key: apiKey.API_KEY,
        query: input,
      },
    });
    //console.log(response.data);
    return response.data.results;
    //setData(response.data);
  } catch (error) {
    // handle error
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

const Search = () => {
  const [value, onChangeText] = useState('');
  return (
    <InputContext.Provider value={value}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>
          Find Movies, Tv series,{'\n'}and more...
        </Text>
        <View style={styles.searchSection}>
          <IconFeather
            style={styles.searchIcon}
            name="search"
            color="white"
            size={18}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#BBBBBB"
            placeholder="Search"
            //onChangeText={text => navigation.jumpTo(type, {input: text})}
            onChangeText={text => onChangeText(text)}
            value={value}
          />
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
          <Tab.Screen name="Movies" component={Movies} />
          <Tab.Screen name="TvSeries" component={TvSeries} />
          <Tab.Screen name="People" component={People} />
        </Tab.Navigator>
      </SafeAreaView>
    </InputContext.Provider>
  );
};

const Tab = createMaterialTopTabNavigator();

const RenderItems = ({apiType}) => {
  const [data, setData] = useState([]);
  const value = useContext(InputContext);
  const [isLoading, setLoading] = useState(true);

  const search = async () => {
    const asyncdata = await searchItems(apiType, value, setLoading);
    setData(asyncdata);
  };

  useEffect(() => {
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      value && search();
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  if (value) {
    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({id}) => id}
            numColumns={2}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.items}
                //onPress={() => onPress(item.id)}
              >
                {apiType == 'person' ? (
                  <Image
                    style={{width: 150, height: 220, borderRadius: 10}}
                    source={{
                      uri: item.profile_path
                        ? apiImgUrl.API_IMAGE_URL + '/w500' + item.profile_path
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
        <IconFeather name="search" color="white" size={60} />
      </SafeAreaView>
    );
  }
};

const Movies = () => <RenderItems apiType={'movie'} />;
const TvSeries = () => <RenderItems apiType={'tv'} />;
const People = () => <RenderItems apiType={'person'} />;

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
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#BBBBBB',
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

export default Search;
