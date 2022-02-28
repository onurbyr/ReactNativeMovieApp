import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BackButton from './BackButton';

const HeaderWithBack = props => {
  return (
    <View style={styles.headerView}>
      <BackButton />
      <Text style={styles.headerText}>{props.children}</Text>
    </View>
  );
};

export default HeaderWithBack;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    color: '#dddddd',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
  },
});
