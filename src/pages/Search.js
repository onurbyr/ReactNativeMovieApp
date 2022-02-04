import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import IconFeather from 'react-native-vector-icons/Feather';

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
        <TextInput style={styles.input} placeholderTextColor='#BBBBBB' placeholder="Search" />
      </View>
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
    margin:20,
    borderRadius:20,
    alignItems:'center'
  },
  searchIcon:{
    marginHorizontal:10
  },
  input: {
    color: '#BBBBBB',
    borderRadius:20,
  },
});

export default Search;
