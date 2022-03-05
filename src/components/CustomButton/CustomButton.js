import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from './icons';

const CustomButton = props => {
  const Component = Icon[props.type];
  if (props.type)
    return (
      <TouchableOpacity
        style={[styles.button, props.style]}
        onPress={props.onPress}>
        <Component name={props.name} color={props.color} size={props.size} />
      </TouchableOpacity>
    );
  else return null;
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 37, 65, 0.8)',
  },
});

export default CustomButton;
