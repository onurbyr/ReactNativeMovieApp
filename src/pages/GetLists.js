import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import BackButton from '../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';

const Lists = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>Created Lists</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateList')}
          style={styles.addListIconView}>
          <Entypo name="add-to-list" color={'white'} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Lists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#dddddd',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
  },
  addListIconView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
});
