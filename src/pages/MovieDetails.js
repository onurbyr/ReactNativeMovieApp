import { View, Text } from 'react-native';
import React from 'react';

const MovieDetails = ({route}) => {
const { itemId } = route.params;
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};

export default MovieDetails;
