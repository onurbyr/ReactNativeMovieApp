import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const CustomDialogBox = props => {
  const {width} = useWindowDimensions();
  const height = 150;

  return props.isHidden ? null : (
    <View
      style={[
        styles.dialogBox,
        {
          width: width * 0.8, //%80 of the screen width
          height,
          transform: [
            {translateX: (-width * 0.8) / 2},
            {translateY: -height / 2},
          ],
        },
      ]}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.messageText}>{props.children}</Text>
      <View style={styles.buttonsView}>
        <TouchableOpacity onPress={props.cancel}>
          <Text style={[styles.buttons, {marginRight: 30}]}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.buttons}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
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
