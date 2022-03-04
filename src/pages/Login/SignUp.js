import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
import BackButton from '../../components/BackButton';
import {useNavigation} from '@react-navigation/native';

const SignUp = ({route}) => {
  const {url} = route.params;
  const navigation = useNavigation();

  const goBack = e => {
    if (
      e.url == 'https://www.themoviedb.org/login' ||
      e.url.indexOf('www.themoviedb.org/u/') > -1
    ) {
      navigation.goBack();
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

export default SignUp;


