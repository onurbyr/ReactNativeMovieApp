import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import BackButton from '../components/BackButton';

const PeopleDetails = ({route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {itemId} = route.params;

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
          <BoldText>People</BoldText>
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
});
