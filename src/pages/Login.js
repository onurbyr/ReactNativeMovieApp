import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import HeaderWithBack from '../components/HeaderWithBack';

const Login = () => {
  const [userName, onChangeUserName] = useState('');
  const [password, onChangePassword] = useState('');
  return (
    <View style={styles.container}>
      <HeaderWithBack>Login</HeaderWithBack>
      <View style={{padding: 30}}>
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
        />
        <TouchableOpacity>
          <Text style={styles.forgetPassword}>Forget Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
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
