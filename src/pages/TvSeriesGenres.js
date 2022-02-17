import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BackButton from '../components/BackButton';

const TvSeriesGenres = ({route}) => {
  const {itemId, itemName} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <BackButton />
        <Text style={styles.headerText}>{itemName}</Text>
      </View>
    </View>
  );
};

export default TvSeriesGenres;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  headerView: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontSize: 26,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
  },
});
