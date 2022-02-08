import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState, createContext, useContext} from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {api, apiKey, apiImgUrl} from '../../services/api/api';

const TypeContext = createContext({});

const searchItems = async (mediaType, input) => {
  try {
    const response = await api.get('/search/' + mediaType, {
      params: {
        api_key: apiKey.API_KEY,
        query: input,
      },
    });
    console.log(response.data);
    return response.data;
    //setData(response.data);
  } catch (error) {
    // handle error
    console.log(error.message);
  } finally {
    //setLoading(false);
  }
};

const Search = ({navigation}) => {
  const [type, setType] = useState('Movies');
  return (
    <TypeContext.Provider value={{type, setType}}>
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
            onChangeText={text => navigation.jumpTo(type, {input: text})}
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
    </TypeContext.Provider>
  );
};

const Tab = createMaterialTopTabNavigator();

const RenderItems = ({navigation, route, type, apiType}) => {
  const {setType} = useContext(TypeContext);
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');

  const search = async () => {
    const asyncdata = await searchItems(apiType, route.params.input);
    setData(asyncdata);
  };

  useEffect(() => {
    route?.params?.input && search();

    const unsubscribe = navigation.addListener('focus', () => {
      setType(type);
      route?.params?.input && search();
    });
    return unsubscribe;
  }, [route, navigation]);

  if (route?.params?.input) {
    return (
      <View style={styles.container}>
        <Text>Movies</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Bos</Text>
      </View>
    );
  }
};

const Movies = ({navigation, route}) => (
  <RenderItems
    navigation={navigation}
    route={route}
    type={'Movies'}
    apiType={'movie'}
  />
);
const TvSeries = ({navigation, route}) => (
  <RenderItems
    navigation={navigation}
    route={route}
    type={'TvSeries'}
    apiType={'tv'}
  />
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
