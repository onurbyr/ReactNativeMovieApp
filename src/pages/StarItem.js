import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {apiImgUrl} from '../../services/api/api';
import NoImage from '../images/noimage.png';
import useOrientation from '../hooks/useOrientation';
import BackButton from '../components/BackButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {api} from '../../services/api/api';

const StarItem = ({route,navigation}) => {
  const {itemId, name, posterPath, backdropPath, sessionId, ratedValue} = route.params;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
  const [imageWidth, setImageWidth] = useState(Dimensions.get('window').width);
  const [imageHeight, setImageHeight] = useState(
    Dimensions.get('window').height,
  );
  const orientation = useOrientation(setImageWidth, setImageHeight);
  const [starIndex, setStarIndex] = useState(-1);

  useEffect(() => {
    ratedValue && setStarIndex(ratedValue-1)
  }, []);


  const rateItem = async () => {
    console.log(starIndex + 1);
    if (starIndex < 0 || starIndex > 9) {
      ToastAndroid.show('Please select your rating value', ToastAndroid.SHORT);
    } else {
      try {
        const result = await api.post(
          `/movie/${itemId}/rating`,
          {
            value: starIndex + 1,
          },
          {
            params: {
              session_id: sessionId,
            },
          },
        );
        if (result.data.success == true) {
          ToastAndroid.show('Successfuly Rated', ToastAndroid.SHORT);
          navigation.goBack()
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    }
  };

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
      <ScrollView>
        <Image
          style={styles.posterImage}
          source={{
            uri: posterPath
              ? apiImgUrl.API_IMAGE_URL + '/w500' + posterPath
              : NO_IMAGE,
          }}
          resizeMode={posterPath ? 'stretch' : 'center'}
        />
        <Text style={styles.name}>Rate the {name}</Text>
        <View style={styles.starsView}>
          {[...Array(10)].map((x, i) => (
            <TouchableOpacity key={i} onPress={() => setStarIndex(i)}>
              {starIndex >= i ? (
                <MaterialIcons
                  name="star"
                  color={'#F57800'}
                  size={32}
                  style={styles.starIcon}
                />
              ) : (
                <MaterialIcons
                  name="star-outline"
                  color={'#424242'}
                  size={32}
                  style={styles.starIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={rateItem} style={styles.rateButton}>
          <Text style={styles.buttonText}>Rate</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default StarItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  backButton: {
    marginTop: 20,
    position: 'absolute',
    zIndex: 1,
  },
  posterImage: {
    width: 125,
    height: 180,
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 20,
  },
  name: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 22,
    color: '#dddddd',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    width: 300,
  },
  starsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  starIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  rateButton: {
    backgroundColor: '#1C1C3A',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#dddddd',
    fontSize: 18,
  },
});
