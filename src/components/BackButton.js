import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const BackButton = ({style}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.backButton, {...style}]}
      onPress={() => navigation.goBack()}>
      <MaterialIcons name="arrow-back-ios" color={'white'} size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
    paddingLeft: 5,
  },
});

export default BackButton;
