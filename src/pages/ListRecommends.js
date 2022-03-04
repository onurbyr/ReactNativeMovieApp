import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, apiImgUrl} from '../../services/api/api';
import usePrevious from '../hooks/usePrevious';
import RenderFooter from '../components/RenderFooter';
import HeaderWithBack from '../components/HeaderWithBack';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import NoImage from '../images/noimage.png';

const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;

const ListRecommends = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);

  const {itemId} = route.params;
  const {recommendType} = route.params;

  useEffect(() => {
    getItems();
  }, [page]);

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get(
        `/${recommendType}/${itemId}/recommendations`,
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
        setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const dateConvert = dt => {
    const d = new Date(dt);
    const date = d.getFullYear();
    return date;
  };

  return isLoading ? (
    <ActivityIndicator style={styles.container} />
  ) : (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack>Recommendations</HeaderWithBack>
      <FlatList
        data={data}
        onEndReached={() => {
          if (page < totalPages) {
            setPage(page + 1);
            setIsExtraLoading(true);
          } else {
            setIsExtraLoading(false);
          }
        }}
        keyExtractor={({id}) => id}
        numColumns={2}
        ListFooterComponent={RenderFooter(isExtraLoading)}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.items}
            onPress={() =>
              recommendType == 'movie'
                ? navigation.push('MovieDetails', {
                    itemId: item.id,
                  })
                : navigation.push('TvSeriesDetails', {
                    itemId: item.id,
                  })
            }>
            <Image
              style={{width: 150, height: 250, borderRadius: 10}}
              source={{
                uri: item.poster_path
                  ? apiImgUrl.API_IMAGE_URL + '/w500' + item.poster_path
                  : NO_IMAGE,
              }}
              resizeMode={item.poster_path ? 'cover' : 'center'}
            />
            <BoldText style={styles.itemsText}>
              {recommendType == 'movie' ? item.title : item.name}
            </BoldText>
            <DefaultText style={styles.itemsText2}>
              {dateConvert(
                recommendType == 'movie'
                  ? item.release_date
                  : item.first_air_date,
              )}
            </DefaultText>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  items: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  itemsText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  itemsText2: {
    marginTop: 5,
    color: '#FF7652',
  },
});

export default ListRecommends;
