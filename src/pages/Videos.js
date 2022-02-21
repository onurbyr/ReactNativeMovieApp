import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BackButton from '../components/BackButton';
import {WebView} from 'react-native-webview';

const Videos = ({route}) => {
  const {itemId} = route.params;
  
  return (
    <View style={styles.container}>
      <BackButton style={{position:'absolute', left: 0, top: 20}}>Video</BackButton>
      <View style={{height: 300}}>
        <WebView
          style={{backgroundColor:'#15141F'}}
          javaScriptEnabled={true}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          source={{uri: `https://www.youtube.com/embed/${itemId}?&autoplay=1&mute=1&showinfo=0&controls=1&fullscreen=1`}}
        />
      </View>
    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
    justifyContent:'center'
  },
});
