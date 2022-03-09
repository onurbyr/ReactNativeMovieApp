import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {apiImgUrl} from '../../services/api/api';
import NoImage from '../images/noimage.png';
import useOrientation from '../hooks/useOrientation';
import BackButton from '../components/BackButton';

const StarItem = ({route}) => {
  const {name, posterPath, backdropPath} = route.params;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
  const [imageWidth, setImageWidth] = useState(Dimensions.get('window').width);
  const [imageHeight, setImageHeight] = useState(
    Dimensions.get('window').height,
  );
  const orientation = useOrientation(setImageWidth, setImageHeight);

  return (
    <View style={styles.container}>
      <Image
        style={{
          width: imageWidth,
          height: imageHeight,
          position: 'absolute',
        }}
        source={{
          uri:
            orientation == 'PORTRAIT' && posterPath
              ? apiImgUrl.API_IMAGE_URL + '/w500' + posterPath
              : orientation == 'LANDSCAPE' && backdropPath
              ? apiImgUrl.API_IMAGE_URL + '/w500' + backdropPath
              : NO_IMAGE,
        }}
        resizeMode={
          orientation == 'PORTRAIT' && posterPath
            ? 'cover'
            : orientation == 'LANDSCAPE' && backdropPath
            ? 'cover'
            : 'center'
        }
        blurRadius={10}
      />
      <BackButton style={styles.backButton} />
      <Image
        style={styles.posterImage}
        source={{
          uri: posterPath
            ? apiImgUrl.API_IMAGE_URL + '/w500' + posterPath
            : NO_IMAGE,
        }}
        resizeMode={posterPath ? 'stretch' : 'center'}
      />
      <Text style={styles.rateText}>Rate the {name}</Text>
    </View>
  );
};

export default StarItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  backButton:{
    marginTop:20
  },
  posterImage:{
    width: 125,
    height: 180,
    alignSelf:'center',
    marginVertical:20
  },
  rateText:{
    alignSelf:'center',
    textAlign:'center',
    fontSize:22,
    color:'#dddddd',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    width:300
  }

});
