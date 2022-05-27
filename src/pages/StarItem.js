import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {apiImgUrl} from '../../services/api/api';
import NoImage from '../images/noimage.png';
import useOrientation from '../hooks/useOrientation';
import BackButton from '../components/BackButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {api} from '../../services/api/api';

const StarItem = ({route, navigation}) => {
  const {itemId, sessionId, mediaType} = route.params;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;
  const [imageWidth, setImageWidth] = useState(Dimensions.get('window').width);
  const [imageHeight, setImageHeight] = useState(
    Dimensions.get('window').height,
  );
  const orientation = useOrientation(setImageWidth, setImageHeight);
  const [starIndex, setStarIndex] = useState(-1);
  const [isStarred, setIsStarred] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    let endpoints = [
      `/${mediaType}/${itemId}`,
      `/${mediaType}/${itemId}/account_states`,
    ];

    const concurrentRequests = endpoints.map(endpoint =>
      api
        .get(endpoint, {
          params: {
            session_id: sessionId,
          },
        })
        .catch(err => {
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        }),
    );

    Promise.all(concurrentRequests)
      .then(result => {
        setDetails(result[0].data);
        if (result[1].data.rated.value) {
          setStarIndex(result[1].data.rated.value - 1);
          setIsStarred(true);
        }
        setLoading(false);
      })
      .catch(err => {
        //console.log(err.message);
      });
  };

  const rateItem = async () => {
    if (starIndex < 0 || starIndex > 9) {
      ToastAndroid.show('Please select your rating value', ToastAndroid.SHORT);
    } else {
      try {
        const result = await api.post(
          `/${mediaType}/${itemId}/rating`,
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
          navigation.goBack();
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    }
  };

  const deleteItem = async () => {
    try {
      const result = await api.delete(`/${mediaType}/${itemId}/rating`, {
        params: {
          session_id: sessionId,
        },
      });
      if (result.data.success == true) {
        ToastAndroid.show('Rating Successfully Deleted', ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              position: 'absolute',
            }}
            source={{
              uri:
                orientation == 'PORTRAIT' && details.poster_path
                  ? apiImgUrl.API_IMAGE_URL + '/w500' + details.poster_path
                  : orientation == 'LANDSCAPE' && details.backdrop_path
                  ? apiImgUrl.API_IMAGE_URL + '/w500' + details.backdrop_path
                  : NO_IMAGE,
            }}
            resizeMode={
              orientation == 'PORTRAIT' && details.poster_path
                ? 'cover'
                : orientation == 'LANDSCAPE' && details.backdrop_path
                ? 'cover'
                : 'center'
            }
            blurRadius={10}
          />
          <ScrollView>
            <Image
              style={styles.posterImage}
              source={{
                uri: details.poster_path
                  ? apiImgUrl.API_IMAGE_URL + '/w500' + details.poster_path
                  : NO_IMAGE,
              }}
              resizeMode={details.poster_path ? 'stretch' : 'center'}
            />
            <Text style={styles.name}>
              Rate the {mediaType === 'movie' ? details.title : details.name}
            </Text>
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
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
            {isStarred && (
              <TouchableOpacity
                onPress={deleteItem}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete Rating</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
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
  rateButtonText: {
    color: '#dddddd',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#CF3131',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#dddddd',
    fontSize: 18,
  },
});
