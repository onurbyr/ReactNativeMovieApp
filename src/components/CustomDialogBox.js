import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from 'react-native';
import React, {useRef} from 'react';
import useDidMountEffect from '../hooks/useDidMountEffect';

const CustomDialogBox = props => {
  const {width} = useWindowDimensions();
  const height = 150;
  const animationDuration = 200;

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
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
        styles.dialogBox,
        {
          width: width * 0.8, //%80 of the screen width
          height,
          transform: [
            {translateX: (-width * 0.8) / 2},
            {translateY: -height / 2},
          ],
          opacity: fadeAnim,
        },
      ]}>
      {props.title ? (
        <Text style={styles.title}>{props.title}</Text>
      ) : (
        <Text style={styles.title}>Title</Text>
      )}
      <Text style={styles.messageText}>{props.children}</Text>
      <View style={styles.buttonsView}>
        <TouchableOpacity onPress={cancel}>
          <Text style={[styles.buttons, {marginRight: 30}]}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.buttons}>OK</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CustomDialogBox;

const styles = StyleSheet.create({
  dialogBox: {
    backgroundColor: '#343434',
    position: 'absolute',
    padding: 20,
    zIndex: 1,
    left: '50%',
    top: '50%',
    borderRadius: 5,
  },
  title: {
    color: '#E5E5E5',
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    marginBottom: 10,
  },
  messageText: {
    color: '#aaaaaa',
    fontFamily: 'Lato-Light',
    fontSize: 16,
  },
  buttonsView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  buttons: {
    color: '#0088EF',
    fontSize: 16,
  },
});
