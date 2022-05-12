import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4, api} from '../../../services/api/api';
import LetterProfileImage from '../../components/LetterProfileImage';
import BoldText from '../../components/BoldText';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Login from '../Login/Login';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

const ProfileScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems();
    });

    return unsubscribe;
  }, [navigation]);

  const getItems = async () => {
    const value = await AsyncStorage.getItem('@session_id');
    if (value !== null) {
      try {
        const response = await api.get(`/account`, {
          params: {
            session_id: value,
          },
        });
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const Logout = async () => {
    try {
      //const value = await AsyncStorage.getItem('@session_id');
      const sessionId = await AsyncStorage.getItem('@session_id');
      const accessToken = await AsyncStorage.getItem('@access_token');
      if (sessionId !== null) {
        try {
          const result = await apiv4.delete('/auth/access_token', {
            data: {
              access_token: accessToken,
            },
          });
          if (result.data.success == true) {
            try {
              await AsyncStorage.removeItem('@session_id');
              await AsyncStorage.removeItem('@access_token');
              await AsyncStorage.removeItem('@account_id');
              ToastAndroid.show('Successful Logout', ToastAndroid.SHORT);
            } catch (e) {
              // remove error
            }
          }
        } catch (err) {
          console.log(err.response.data);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  return isLoading ? (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={styles.container}>
      <BoldText style={styles.userName}>
        {data.username.charAt(0).toUpperCase() + data.username.slice(1)}
      </BoldText>
      <View style={styles.profileContainer}>
        <LetterProfileImage style={styles.letterProfileImage}>
          {data.username}
        </LetterProfileImage>
      </View>

      <TouchableOpacity
        style={{
          width: 100,
          height: 30,
          backgroundColor: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 50,
        }}
        onPress={Logout}>
        <Text style={{color: 'white'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  profileContainer: {
    width: windowWidth + 100,
    height: windowWidth + 100,
    backgroundColor: '#714EBB',
    borderRadius: (windowWidth + 100) / 2,
    marginTop: -(windowWidth / 2 + 120),
    marginLeft: -50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 50,
  },
  letterProfileImage: {
    top: 35,
  },
});

const ProfileStack = createNativeStackNavigator();

const Profile = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = [
      //
    ];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#15141F',
          borderTopWidth: 0,
          position: 'absolute',
        },
      });
    }
  }, [navigation, route]);
  return (
    <View style={{flex: 1, backgroundColor: '#15141F'}}>
      <ProfileStack.Navigator initialRouteName="Profile">
        <ProfileStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false, orientation: 'portrait'}}
        />
        <ProfileStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      </ProfileStack.Navigator>
    </View>
  );
};

export default Profile;
