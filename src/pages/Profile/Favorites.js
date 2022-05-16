import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4Authorized, apiImgUrl} from '../../../services/api/api';
import usePrevious from '../../hooks/usePrevious';
import HeaderWithBack from '../../components/HeaderWithBack';
import RenderFooter from '../../components/RenderFooter';
import BoldText from '../../components/BoldText';
import DefaultText from '../../components/DefaultText';
import Stars from '../../components/Stars/Stars';

const Favorites = ({route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);

  useEffect(() => {
    getItems();
  }, [page]);

  const getItems = async () => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const accountId = await AsyncStorage.getItem('@account_id');
        const response = await apiv4.get(
          `/account/${accountId}/movie/favorites`,
          {
            params: {
              page,
            },
          },
        );
        if (prevPage == page - 1) {
          setData([...data, ...response.data.results]);
          setIsExtraLoading(false);
        } else {
          setData(response.data.results);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const dateConvert = dt => {
    const d = new Date(dt);
    const date = d.getFullYear();
    return date;
  };

  const Hr = () => {
    return (
      <View
        style={{
          borderBottomColor: '#515151',
          borderBottomWidth: 0.8,
          opacity: 0.3,
        }}
      />
    );
  };

  const renderItem = item => {
    return (
      <View>
        <View style={styles.flatlistItems}>
          <Image
            style={{width: 110, height: 160}}
            source={{
              uri: item.poster_path
                ? apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path
                : NO_IMAGE,
            }}
            resizeMode={item.poster_path ? 'cover' : 'center'}
          />
          <View style={styles.itemDetails}>
            <BoldText>{item.title}</BoldText>
            <DefaultText style={{marginTop: 8}}>
              {dateConvert(item.release_date)}
            </DefaultText>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Stars count={item.vote_average} size={14} />
              <DefaultText style={{marginLeft: 3}}>
                {item.vote_average}
              </DefaultText>
            </View>
          </View>
        </View>
        <Hr />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack>Favorites</HeaderWithBack>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={data}
          style={{marginBottom: 50}}
          // onEndReached={() => {
          //   setPage(page + 1);
          //   setIsExtraLoading(true);
          // }}
          keyExtractor={({id}) => id}
          // ListFooterComponent={RenderFooter(isExtraLoading)}
          renderItem={({item}) => renderItem(item)}
        />
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  flatlistItems: {
    flexDirection: 'row',
    padding: 10,
  },
  itemDetails: {
    padding: 10,
    justifyContent: 'center',
  },
});
