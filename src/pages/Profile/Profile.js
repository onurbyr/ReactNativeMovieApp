import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, apiKey} from '../../../services/api/api';

const Profile = () => {
  const Logout = async () => {
    try {
      const value = await AsyncStorage.getItem('@session_id');
      if (value !== null) {
        try {
          console.log(value);
          const result = await api.delete(
            '/authentication/session?api_key=' + apiKey.API_KEY,
            {
              data: {
                session_id: value,
              },
            },
          );
          if (result.data.success == true) {
            try {
              await AsyncStorage.removeItem('@session_id');
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
