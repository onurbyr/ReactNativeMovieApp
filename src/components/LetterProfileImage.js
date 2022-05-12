import {Text, StyleSheet, View} from 'react-native';
import React from 'react';

const LetterProfileImage = props => {
  return (
    <View style={[styles.nameContainer, props.style]}>
      <Text style={styles.name}>{props.children.charAt(0).toUpperCase()}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  nameContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0177D2',
  },
  name: {
    textAlign: 'center',
    fontSize: 30,
    lineHeight: 80,
    color: '#dddddd',
  },
});

export default LetterProfileImage;
