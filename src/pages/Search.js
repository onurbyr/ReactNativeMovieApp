import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useState, createContext, useContext} from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {api, apiKey, apiImgUrl} from '../../services/api/api';

const InputContext = createContext();

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
    setLoading(true)
    value && search();
  }, [value]);

  if (value) {
    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator/>
        ) : (
          <FlatList
            data={data}
            keyExtractor={({id}) => id}
            renderItem={({item}) =>
              item.title ? <Text>{item.title}</Text> : <Text>{item.name}</Text>
            }
          />
        )}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Bos</Text>
      </SafeAreaView>
    );
  }
};

const Movies = () => <RenderItems apiType={'movie'} />;
const TvSeries = () => <RenderItems apiType={'tv'} />;

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
});

export default Search;
