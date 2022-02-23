import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import BackButton from '../components/BackButton';
import {WebView} from 'react-native-webview';

const Videos = ({route}) => {
  const [isVisible, setIsVisible] = useState(true);
  const {itemId} = route.params;
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

  const timerRef = useRef(null);
  const delaySetVisible = () => {
    timerRef.current = setTimeout(() => setIsVisible(false), 4000);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const setBackButtonVisibility = () => {
    setIsVisible(true);
    delaySetVisible();
  };
  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={setBackButtonVisibility}>
      <StatusBar hidden={true} />
      {isVisible && (
        <BackButton
          style={{
            position: 'absolute',
            marginTop: 10,
            marginLeft: 10,
            zIndex: 1,
          }}>
          Video
        </BackButton>
      )}

      <WebView
        style={{backgroundColor: '#15141F'}}
        javaScriptEnabled={true}
        scrollEnabled={false}
        allowsFullscreenVideo={true}
        scalesPageToFit={true}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        //userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
        source={{
          uri: `https://www.youtube.com/embed/${itemId}?controls=1&fs=0&modestbranding=1`,
        }}
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

export default Videos;
