import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import BackButton from '../../../components/BackButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {apiv4Authorized} from '../../../../services/api/api';
import CustomDialogBox from '../../../components/CustomDialogBox';
import strings from '../../../localization/strings';

const ProfileListEdit = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
  const {listId} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(true);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const response = await apiv4.get(`/list/${listId}`, {
          params: {
            language: strings.getLanguage(),
          },
        });
        setName(response.data.name);
        setDescription(response.data.description);
        setIsToggleEnabled(response.data.public);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSwitch = () =>
    setIsToggleEnabled(previousState => !previousState);

  const save = async () => {
    if (name) {
      const apiv4 = await apiv4Authorized();
      if (apiv4) {
        try {
          const result = await apiv4.put(`/list/${listId}`, {
            name,
            description,
            public: isToggleEnabled,
          });
          if (result.data.success == true) {
            ToastAndroid.show(
              strings.messages.listsuccessfullyupdated,
              ToastAndroid.SHORT,
            );
            navigation.navigate('ProfileListDetails', {listId, listName: name});
          }
        } catch (err) {
          ToastAndroid.show(
            strings.messages.anerroroccured,
            ToastAndroid.SHORT,
          );
        }
      }
    } else {
      ToastAndroid.show(
        strings.messages.listnamecannotbeempty,
        ToastAndroid.SHORT,
      );
    }
  };

  const del = async () => {
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 3];
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const result = await apiv4.delete(`/list/${listId}`, {});
        if (result.data.success == true) {
          ToastAndroid.show(
            strings.messages.listsuccessfullydeleted,
            ToastAndroid.SHORT,
          );
          prevRoute.params
            ? navigation.navigate(prevRoute, prevRoute.params)
            : navigation.navigate(prevRoute);
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>{strings.editlist}</Text>
        <TouchableOpacity
          onPress={() => setIsDialogBoxHidden(false)}
          style={styles.editListIconView}>
          <MaterialCommunityIcons
            name="delete-sweep-outline"
            color={'white'}
            size={32}
          />
        </TouchableOpacity>
      </View>
      <CustomDialogBox
        isHidden={isDialogBoxHidden}
        cancel={() => setIsDialogBoxHidden(true)}
        ok={() => {
          setIsDialogBoxHidden(true);
          del();
        }}
        title={strings.confirmdelete}>
        {strings.messages.doyoureallywantdeletelist}
      </CustomDialogBox>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{paddingHorizontal: 20}}>
          <View
            style={
              isNameFocused
                ? [styles.nameInputView, {borderColor: '#5E5CE6'}]
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
              placeholder={`${strings.name} *`}
              placeholderTextColor="#BBBBBB"
              onChangeText={text => setName(text)}
              value={name}
              onFocus={() => {
                setIsDescriptionFocused(false), setIsNameFocused(true);
              }}
            />
          </View>
          <View
            style={
              isDescriptionFocused
                ? [styles.descriptionInputView, {borderColor: '#5E5CE6'}]
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
              placeholder={strings.description}
              placeholderTextColor="#BBBBBB"
              onChangeText={text => setDescription(text)}
              value={description}
              onFocus={() => {
                setIsNameFocused(false), setIsDescriptionFocused(true);
              }}
            />
          </View>
          <View style={styles.toggleView}>
            <Text style={styles.toggleText}>{strings.public}</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isToggleEnabled ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isToggleEnabled}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={save}>
            <Text style={styles.saveButtonText}>{strings.save}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileListEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
  },
  editListIconView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
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
