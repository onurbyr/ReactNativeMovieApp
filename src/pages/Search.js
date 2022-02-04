import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import IconFeather from 'react-native-vector-icons/Feather';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const Movies = () => {
  return (
    <View style={styles.container}>
      <Text>Movies</Text>
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

const Search = () => {
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
        <Tab.Screen name="Tv Series" component={TvSeries} />
      </Tab.Navigator>
    </SafeAreaView>
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
