import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MovieDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const {itemId} = route.params;

  useEffect(() => {
    getMovieDetails();
  }, []);

  //getdata with axios3 (baseurl)
  const getMovieDetails = async navigation => {
    try {
      const response = await api.get('/movie/' + itemId, {
        params: {
          api_key: apiKey.API_KEY,
        },
      });
      //console.log(response.data);
      setData(response.data);
      console.log(data);
    } catch (error) {
      // handle error
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonImage}>
        <ImageBackground
          source={{
            uri: 'http://via.placeholder.com/1920x1080',
          }}
          resizeMode="cover"
          style={{flex: 1}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" color={'white'} size={20} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.body}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  buttonImage: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  body: {
    flex: 1.5,
    backgroundColor: 'red',
  },
});

export default MovieDetails;
