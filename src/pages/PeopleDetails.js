import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import BackButton from '../components/BackButton';
import NoAvatar from '../images/noavatar.png';

const PeopleDetails = ({route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {itemId} = route.params;
  const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

  useEffect(() => {
    getItems();
  }, []);

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get('/person/' + itemId, {
        params: {
          api_key: apiKey.API_KEY,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <BackButton style={[styles.backButton, {top: 0}]} />
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          <BackButton style={styles.backButton} />
          <ScrollView>
            <Image
              source={{
                uri: data.profile_path
                  ? apiImgUrl.API_IMAGE_URL + '/h632' + data.profile_path
                  : NO_AVATAR_IMAGE,
              }}
              resizeMode={data.profile_path ? 'cover' : 'center'}
              blurRadius={5}
              style={{height: 250}}
            />
            <View style={styles.info}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: data.profile_path
                      ? apiImgUrl.API_IMAGE_URL + '/w500' + data.profile_path
                      : NO_AVATAR_IMAGE,
                  }}
                  resizeMode={data.profile_path ? 'cover' : 'center'}
                  style={styles.profileImage}
                />
                <View style={styles.imageLeftPanel}>
                  <BoldText>{data.name}</BoldText>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PeopleDetails;

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
  info: {
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: '#15141F',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginTop: -50,
  },
  imageLeftPanel: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
  },
});
