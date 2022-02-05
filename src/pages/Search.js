import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {api, apiKey, apiImgUrl} from '../../services/api/api';

const searchItems = async mediaType => {
  try {
    const response = await api.get('/search/' + mediaType, {
      params: {
        api_key: apiKey.API_KEY,
        query: 'spider',
      },
    });
    //console.log(response.data);
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
  return (
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
          onChangeText={text => navigation.jumpTo('Movies', {input: text})}
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
  );
};

const Tab = createMaterialTopTabNavigator();

const Movies = ({navigation, route}) => {
  const [data, setData] = useState([]);
  //route?.params?.input ? console.log(route.params.input):console.log('bos')

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const search = async () => {
        const asyncdata = await searchItems('movie');
        setData(asyncdata);
      };
      search();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Movies</Text>
      <Text></Text>
    </View>
  );
};
const TvSeries = () => {
  return (
    <View style={styles.container}>
      <Text>Tv Series</Text>
    </View>
  );
};

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
