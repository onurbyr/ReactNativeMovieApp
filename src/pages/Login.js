import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import BackButton from '../components/BackButton';
import {api, apiKey} from '../../services/api/api';

const Login = () => {
  const [userName, onChangeUserName] = useState('');
  const [password, onChangePassword] = useState('');

  const Login = async () => {
    if (userName && password) {
      let requestToken = '';
      let sessionId = '';
      try {
        const result = await api.get('/authentication/token/new', {
          params: {
            api_key: apiKey.API_KEY,
          },
        });
        requestToken = result.data.request_token;
      } catch (err) {
        console.log(err);
      }
      try {
        const result = await api.post(
          '/authentication/token/validate_with_login',
          {
            username: userName,
            password: password,
            request_token: requestToken,
          },
          {
            params: {
              api_key: apiKey.API_KEY,
            },
          },
        );
        requestToken = result.data.request_token;
      } catch (err) {
        //console.log(err);
        err.response.status == 401 &&
          ToastAndroid.show('Invalid Username or Password', ToastAndroid.SHORT);
      }
      try {
        const result = await api.post(
          '/authentication/session/new',
          {
            request_token: requestToken,
          },
          {
            params: {
              api_key: apiKey.API_KEY,
            },
          },
        );
        if (result.data.success == true) {
          ToastAndroid.show('Successful Login', ToastAndroid.SHORT);
          sessionId = result.data.session_id;
        }
      } catch (err) {
        //console.log(err);
      }
    } else {
      ToastAndroid.show(
        'Please enter your username and password',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <BackButton style={{position: 'absolute', top: 20}} />
      <Image style={styles.image} source={require('../images/tmdb.png')} />
      <View style={{paddingHorizontal: 30}}>
        <Text style={styles.topText}>Welcome Back!</Text>
        <Text style={styles.topText2}>Sign in to your TMDB account</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#BBBBBB"
          placeholder="Username"
          onChangeText={text => onChangeUserName(text)}
          value={userName}
        />
        <TextInput
          style={[styles.input, {marginTop: 10}]}
          placeholderTextColor="#BBBBBB"
          placeholder="Password"
          onChangeText={text => onChangePassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity>
          <Text style={styles.forgetPassword}>Forget Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={Login}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
    justifyContent: 'center',
  },
  image: {
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  topText: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 10,
  },
  topText2: {
    color: '#818185',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#1E1C24',
    borderColor: '#3B3A43',
    borderRadius: 10,
    paddingLeft: 20,
    color: '#ffffff',
  },
  forgetPassword: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  signInButton: {
    borderWidth: 1,
    backgroundColor: '#5E5CE6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 20,
    borderRadius: 10,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  signUp: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    alignSelf: 'center',
  },
});
