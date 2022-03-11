import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import BackButton from '../../components/BackButton';
import {createRequestToken, afterApproved} from './setSession';

const Login = ({navigation}) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    createRequestToken(setUrl);
  }, []);

  const goBack = e => {
    if (e.url == 'https://www.themoviedb.org/auth/access/approve') {
      if (!e.loading) {
        afterApproved(navigation);
      }
    }
  };
  return (
    <View style={styles.container}>
      <BackButton
        style={{
          position: 'absolute',
          marginTop: 10,
          marginLeft: 10,
          zIndex: 1,
        }}>
        Video
      </BackButton>
      <WebView
        javaScriptEnabled={true}
        incognito={true}
        onNavigationStateChange={e => goBack(e)}
        source={{uri: url}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
});

export default Login;
