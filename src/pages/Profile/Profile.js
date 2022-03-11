import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4} from '../../../services/api/api';

const Profile = () => {
  const Logout = async () => {
    try {
      //const value = await AsyncStorage.getItem('@session_id');
      const sessionId = await AsyncStorage.getItem('@session_id');
      const accessToken = await AsyncStorage.getItem('@access_token');
      if (sessionId !== null) {
        try {
          const result = await apiv4.delete(
            '/auth/access_token',
            {
              data: {
                access_token: accessToken,
              },
            },
          );
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          width: 100,
          height: 30,
          backgroundColor: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
        }}
        onPress={Logout}>
        <Text style={{color: 'white'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
});
