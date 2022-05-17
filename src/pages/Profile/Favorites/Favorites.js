import {
  StyleSheet,
  View,
} from 'react-native';
import React from 'react'
import HeaderWithBack from '../../../components/HeaderWithBack';
import FavMovies from './FavMovies';

const Favorites = () => {
  return (
    <View style={styles.container}>
      <HeaderWithBack>Favorites</HeaderWithBack>
      <FavMovies />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
});