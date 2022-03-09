import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';

const CustomActivityIndicator = props => {
  return (
    <View style={[styles.customActivityIndicator, props.style]}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  customActivityIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 37, 65, 0.8)',
  },
});

export default CustomActivityIndicator;
