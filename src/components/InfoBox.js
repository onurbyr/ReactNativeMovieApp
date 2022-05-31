import {StyleSheet, useWindowDimensions, Animated} from 'react-native';
import React, {useRef} from 'react';
import useDidMountEffect from '../hooks/useDidMountEffect';

const InfoBox = props => {
  const window = useWindowDimensions();
  const animationDuration = 200;

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  useDidMountEffect(() => {
    if (props.isHidden === false) {
      fadeIn();
    }
  }, [props.isHidden]);

  const cancel = () => {
    fadeOut();
    setTimeout(() => {
      props.cancel();
    }, animationDuration);
  };

  return props.isHidden ? null : (
    <Animated.View
      style={[
        styles.container,
        {
          width: window.width,
          height: window.height,
          opacity: fadeAnim,
        },
      ]}
      onStartShouldSetResponder={cancel}>
      {props.children}
    </Animated.View>
  );
};

export default InfoBox;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    backgroundColor: '#15141F',
    position: 'absolute',
    alignItems:'center',
    justifyContent:'center',
    padding:50
  },
});
