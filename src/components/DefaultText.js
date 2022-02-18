import {Text, StyleSheet} from 'react-native';
import React from 'react';

const DefaultText = props => {
  return (
    <Text style={[styles.defaultStyle, props.style]}>{props.children}</Text>
  );
};
const styles = StyleSheet.create({
  defaultStyle: {
    color: '#ffffff',
    fontFamily: 'Lato-Light',
    fontSize: 12,
  },
});

export default DefaultText;
