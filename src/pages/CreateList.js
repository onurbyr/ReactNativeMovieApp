import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import HeaderWithBack from '../components/HeaderWithBack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreateList = () => {
  const [name, onChangeName] = useState('');
  const [description, onChangeDescription] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);

  const toggleSwitch = () =>
    setIsToggleEnabled(previousState => !previousState);
    
  return (
    <View style={styles.container}>
      <HeaderWithBack>Create List</HeaderWithBack>
      <View style={{paddingHorizontal:20}}>
        <View
          style={
            isNameFocused
              ? [styles.nameInputView, {borderColor: '#FF780D'}]
              : styles.nameInputView
          }>
          <FontAwesome5
            name="pen-alt"
            color={'white'}
            size={18}
            style={styles.nameIcon}
          />
          <TextInput
            style={styles.nameInput}
            placeholder="Name *"
            placeholderTextColor="#BBBBBB"
            onChangeText={text => onChangeName(text)}
            value={name}
            onFocus={() => {
              setIsDescriptionFocused(false), setIsNameFocused(true);
            }}
          />
        </View>
        <View
          style={
            isDescriptionFocused
              ? [styles.descriptionInputView, {borderColor: '#FF780D'}]
              : styles.descriptionInputView
          }>
          <MaterialIcons
            name="description"
            color={'white'}
            size={18}
            style={styles.descriptionIcon}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description"
            placeholderTextColor="#BBBBBB"
            onChangeText={text => onChangeDescription(text)}
            value={description}
            onFocus={() => {
              setIsNameFocused(false), setIsDescriptionFocused(true);
            }}
          />
        </View>
        <View style={styles.toggleView}>
          <Text style={styles.toggleText}>Private</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isToggleEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isToggleEnabled}
          />
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  nameInputView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#3B3A43',
    backgroundColor: '#1E1C24',
    marginTop: 10,
  },
  nameIcon: {
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  nameInput: {
    flex: 1,
    color: '#ffffff',
  },
  descriptionInputView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#3B3A43',
    backgroundColor: '#1E1C24',
    marginTop: 20,
  },
  descriptionIcon: {
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  descriptionInput: {
    flex: 1,
    color: '#ffffff',
  },
  toggleView: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  toggleText: {
    color: '#dddddd',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#5E5CE6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});