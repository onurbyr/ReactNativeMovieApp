import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4Authorized, apiImgUrl} from '../../../services/api/api';
import usePrevious from '../../hooks/usePrevious';
import HeaderWithBack from '../../components/HeaderWithBack';
import RenderFooter from '../../components/RenderFooter';
import BoldText from '../../components/BoldText';
import DefaultText from '../../components/DefaultText';
import Stars from '../../components/Stars/Stars';
import Collapse from '../../components/Collapse';
import CustomDialogBox from '../../components/CustomDialogBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Favorites = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(false);
  const [mediaType, setMediaType] = useState('movie');
  const [sort, setSort] = useState('created_at.desc');
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(true);
  const prevSortRef = useRef();
  const childCompRef = useRef();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetList();
  }, []);

  const resetList = () => {
    setLoading(true);
    setPage(1);
    setMediaType('movie');
    setSort('created_at.desc');
    getItems();
    setRefreshing(false);
  };

  useEffect(() => {
    getItems();
  }, [page, sort, mediaType]);

  useEffect(() => {
    //assign the ref's current value to the count Hook
    prevSortRef.current = sort;
  }, [sort]); //run this code when the value of count changes

  const getItems = async () => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const accountId = await AsyncStorage.getItem('@account_id');
        const response = await apiv4.get(
          `/account/${accountId}/${mediaType}/favorites`,
          {
            params: {
              page,
              sort_by: sort,
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
    }
  };

  const dateConvert = dt => {
    const d = new Date(dt);
    const date = d.getFullYear();
    return date;
  };

  const onPressMediaType = mediaType => {
    setLoading(true);
    setPage(1);
    setMediaType(mediaType);
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

  const navigateMovieDetails = itemId => {
    navigation.navigate('MovieDetails', {
      itemId: itemId,
    });
  };

  const navigateTvSeriesDetails = itemId => {
    navigation.navigate('TvSeriesDetails', {
      itemId: itemId,
    });
  };

  const deleteItem = () => {
    setIsDialogBoxHidden(false);
  };

  const cancel = () => {
    setIsDialogBoxHidden(true);
  };

  const renderItem = item => {
    return (
      <View>
        <TouchableOpacity
          style={styles.flatlistItems}
          onPress={() =>
            mediaType == 'movie'
              ? navigateMovieDetails(item.id)
              : navigateTvSeriesDetails(item.id)
          }>
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
            <BoldText>{mediaType == 'movie' ? item.title : item.name}</BoldText>
            <DefaultText style={{marginTop: 8}}>
              {dateConvert(
                mediaType == 'movie' ? item.release_date : item.first_air_date,
              )}
            </DefaultText>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Stars count={item.vote_average} size={14} />
              <DefaultText style={{marginLeft: 3}}>
                {item.vote_average}
              </DefaultText>
            </View>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteItem}>
            <MaterialIcons name="delete-outline" color={'#dddddd'} size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Hr />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack>Favorites</HeaderWithBack>
      <CustomDialogBox isHidden={isDialogBoxHidden} cancel={cancel}>
        Are you sure want to delete ?
      </CustomDialogBox>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <View style={styles.mediaTypeView}>
            <TouchableOpacity
              disabled={mediaType == 'movie' ? true : false}
              style={[
                styles.mediaTypeBox,
                mediaType == 'movie' && {backgroundColor: '#151517'},
              ]}
              onPress={() => onPressMediaType('movie')}>
              <DefaultText>Movies</DefaultText>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={mediaType == 'tv' ? true : false}
              style={[
                styles.mediaTypeBox,
                mediaType == 'tv' && {backgroundColor: '#151517'},
              ]}
              onPress={() => onPressMediaType('tv')}>
              <DefaultText>Tv Series</DefaultText>
            </TouchableOpacity>
          </View>
          <Collapse ref={childCompRef}>
            <View style={styles.collapseContainer}>
              <TouchableOpacity
                style={styles.collapseButtons}
                onPress={() => {
                  setLoading(true);
                  setPage(1);
                  prevSortRef.current === 'created_at.desc'
                    ? setSort('created_at.asc')
                    : setSort('created_at.desc');
                }}>
                {(sort === 'created_at.asc' || sort === 'created_at.desc') && (
                  <MaterialIcons name="check" color={'#e0b422'} size={24} />
                )}
                <BoldText style={{marginLeft: 10}}>Created At</BoldText>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  {sort === 'created_at.asc' && (
                    <MaterialIcons
                      name="arrow-downward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                  {sort === 'created_at.desc' && (
                    <MaterialIcons
                      name="arrow-upward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Hr />
              <TouchableOpacity
                style={styles.collapseButtons}
                onPress={() => {
                  setLoading(true);
                  setPage(1);
                  prevSortRef.current === 'release_date.desc'
                    ? setSort('release_date.asc')
                    : setSort('release_date.desc');
                }}>
                {(sort === 'release_date.asc' ||
                  sort === 'release_date.desc') && (
                  <MaterialIcons name="check" color={'#e0b422'} size={24} />
                )}
                <BoldText style={{marginLeft: 10}}>Date</BoldText>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  {sort === 'release_date.asc' && (
                    <MaterialIcons
                      name="arrow-downward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                  {sort === 'release_date.desc' && (
                    <MaterialIcons
                      name="arrow-upward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Hr />
              <TouchableOpacity
                style={styles.collapseButtons}
                onPress={() => {
                  setLoading(true);
                  setPage(1);
                  prevSortRef.current === 'title.asc'
                    ? setSort('title.desc')
                    : setSort('title.asc');
                }}>
                {(sort === 'title.asc' || sort === 'title.desc') && (
                  <MaterialIcons name="check" color={'#e0b422'} size={24} />
                )}
                <BoldText style={{marginLeft: 10}}>Title</BoldText>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  {sort === 'title.asc' && (
                    <MaterialIcons
                      name="arrow-downward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                  {sort === 'title.desc' && (
                    <MaterialIcons
                      name="arrow-upward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Hr />
              <TouchableOpacity
                style={styles.collapseButtons}
                onPress={() => {
                  setLoading(true);
                  setPage(1);
                  prevSortRef.current === 'vote_average.desc'
                    ? setSort('vote_average.asc')
                    : setSort('vote_average.desc');
                }}>
                {(sort === 'vote_average.asc' ||
                  sort === 'vote_average.desc') && (
                  <MaterialIcons name="check" color={'#e0b422'} size={24} />
                )}
                <BoldText style={{marginLeft: 10}}>Vote</BoldText>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  {sort === 'vote_average.asc' && (
                    <MaterialIcons
                      name="arrow-downward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                  {sort === 'vote_average.desc' && (
                    <MaterialIcons
                      name="arrow-upward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Hr />
            </View>
          </Collapse>
          <FlatList
            data={data}
            style={{marginBottom: 180}}
            onEndReached={() => {
              if (page < totalPages) {
                setPage(page + 1);
                setIsExtraLoading(true);
              } else {
                setIsExtraLoading(false);
              }
            }}
            keyExtractor={({id}) => id}
            ListFooterComponent={RenderFooter(isExtraLoading)}
            renderItem={({item}) => renderItem(item)}
            onScroll={() => childCompRef.current.setExpand()}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
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
    flex: 1,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  collapseContainer: {
    backgroundColor: '#202020',
    marginTop: 10,
  },
  collapseButtons: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    padding: 10,
  },
  mediaTypeView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
  mediaTypeBox: {
    width: 100,
    height: 36,
    backgroundColor: '#212028',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#58575D',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
