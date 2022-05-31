import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {apiv4Authorized, apiImgUrl} from '../../../../services/api/api';
import usePrevious from '../../../hooks/usePrevious';
import BackButton from '../../../components/BackButton';
import RenderFooter from '../../../components/RenderFooter';
import BoldText from '../../../components/BoldText';
import DefaultText from '../../../components/DefaultText';
import Stars from '../../../components/Stars/Stars';
import Collapse from '../../../components/Collapse';
import CustomDialogBox from '../../../components/CustomDialogBox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NoImage from '../../../images/noimage.png';

const ProfileListDetails = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(false);
  const [sort, setSort] = useState('original_order.desc');
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(true);
  const [idIndexMediaType, setIdIndexMediaType] = useState({});
  const prevSortRef = useRef();
  const childCompRef = useRef();
  const {listId, listName} = route.params;
  const NO_IMAGE = Image.resolveAssetSource(NoImage).uri;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetList();
  }, []);

  const resetList = () => {
    setLoading(true);
    setPage(1);
  };

  useEffect(() => {
    getItems();
  }, [page, sort, refreshing]);

  useEffect(() => {
    //assign the ref's current value to the count Hook
    prevSortRef.current = sort;
  }, [sort]); //run this code when the value of count changes

  const getItems = async () => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const response = await apiv4.get(`/list/${listId}`, {
          params: {
            page,
            sort_by: sort,
          },
        });
        if (prevPage == page - 1) {
          setData([...data, ...response.data.results]);
          setIsExtraLoading(false);
        } else {
          setData(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
        setRefreshing(false);
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

  const removeFavorite = async () => {
    data.splice(idIndexMediaType.index, 1);
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const result = await apiv4.delete(`/list/${listId}/items`, {
          data: {
            items: [
              {
                media_type: idIndexMediaType.mediaType,
                media_id: idIndexMediaType.itemId,
              },
            ],
          },
        });
        if (result.data.success == true) {
          ToastAndroid.show(
            'Successfully Removed from List',
            ToastAndroid.SHORT,
          );
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    }
  };

  const cancel = () => {
    setIsDialogBoxHidden(true);
  };

  const ok = () => {
    setIsDialogBoxHidden(true);
    removeFavorite();
  };

  const renderItem = (item, index) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.flatlistItems}
          onPress={() =>
            item.media_type == 'movie'
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
            <BoldText>
              {item.media_type == 'movie' ? item.title : item.name}
            </BoldText>
            <DefaultText style={{marginTop: 8}}>
              {dateConvert(
                item.media_type == 'movie'
                  ? item.release_date
                  : item.first_air_date,
              )}
            </DefaultText>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Stars count={item.vote_average} size={14} />
              <DefaultText style={{marginLeft: 3}}>
                {item.vote_average}
              </DefaultText>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setIsDialogBoxHidden(false);
              setIdIndexMediaType({
                itemId: item.id,
                index,
                mediaType: item.media_type,
              });
            }}>
            <MaterialIcons name="delete-outline" color={'#dddddd'} size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Hr />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <BoldText style={styles.headerText}>{listName}</BoldText>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileListEdit', {listId})}
          style={styles.editListIconView}>
          <MaterialCommunityIcons
            name="playlist-edit"
            color={'white'}
            size={32}
          />
        </TouchableOpacity>
      </View>
      <CustomDialogBox
        isHidden={isDialogBoxHidden}
        cancel={cancel}
        ok={ok}
        title="Confirm Delete">
        Are you sure you want to delete this?
      </CustomDialogBox>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <Collapse ref={childCompRef}>
            <View style={styles.collapseContainer}>
              <TouchableOpacity
                style={styles.collapseButtons}
                onPress={() => {
                  setLoading(true);
                  setPage(1);
                  prevSortRef.current === 'original_order.desc'
                    ? setSort('original_order.asc')
                    : setSort('original_order.desc');
                }}>
                {(sort === 'original_order.asc' ||
                  sort === 'original_order.desc') && (
                  <MaterialIcons name="check" color={'#e0b422'} size={24} />
                )}
                <BoldText style={{marginLeft: 10}}>Original Order</BoldText>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  {sort === 'original_order.asc' && (
                    <MaterialIcons
                      name="arrow-downward"
                      color={'#e0b422'}
                      size={24}
                    />
                  )}
                  {sort === 'original_order.desc' && (
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
            style={{marginBottom: 130}}
            onEndReached={() => {
              if (page < totalPages) {
                setPage(page + 1);
                setIsExtraLoading(true);
              } else {
                setIsExtraLoading(false);
              }
            }}
            keyExtractor={(item, index) => String(index)}
            ListFooterComponent={RenderFooter(isExtraLoading)}
            renderItem={({item, index}) => renderItem(item, index)}
            onScroll={() => childCompRef.current.setExpand()}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileListDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    marginLeft: 20,
  },
  editListIconView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
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
});
