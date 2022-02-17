import {View, ActivityIndicator} from 'react-native';
import React from 'react';

const RenderFooter = (isExtraLoading) => {
  return (
    <View style={{marginBottom: 50}}>
      {isExtraLoading ? <ActivityIndicator /> : null}
    </View>
  );
};

export default RenderFooter;
