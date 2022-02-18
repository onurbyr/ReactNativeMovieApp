import {Text, StyleSheet} from 'react-native';
import React from 'react';

const BoldText = props => {
  return (
    <Text style={[styles.defaultStyle, props.style]}>{props.children}</Text>
  );
};
const styles = StyleSheet.create({
  defaultStyle: {
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
});

export default BoldText;