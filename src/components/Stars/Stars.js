import React from 'react';
import {View, Image} from 'react-native';
import StarsImages from './StarsImages';

const Stars = ({count}) => {
  const getIntegerPart = num => {
    const decimalStr = num.toString().split('.')[0];
    return Number(decimalStr);
  };

  const getDecimalPart = num => {
    if (Number.isInteger(num)) {
      return 0;
    } else {
      const decimalStr = num.toString().split('.')[1][0];
      return Number(decimalStr);
    }
  };

  const halfstars = Math.round((count + Number.EPSILON) * 5) / 10;

  const integer = getIntegerPart(halfstars);
  const decimal = getDecimalPart(halfstars);

  return (
    <View style={{flexDirection: 'row'}}>
      {[...Array(integer)].map((e, i) => (
        <Image
          key={i}
          style={{width: 15, height: 14, marginRight: 1}}
          source={require('../../images/stars/10.png')}
        />
      ))}
      {decimal !== 0 && (
        <Image
          style={{width: 15, height: 14, marginRight: 1}}
          source={StarsImages[decimal]}
        />
      )}
    </View>
  );
};

export default Stars;
