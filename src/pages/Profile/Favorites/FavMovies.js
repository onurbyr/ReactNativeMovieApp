import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiv4Authorized, apiImgUrl} from '../../../../services/api/api';
import usePrevious from '../../../hooks/usePrevious';
import RenderFooter from '../../../components/RenderFooter';
import BoldText from '../../../components/BoldText';
import DefaultText from '../../../components/DefaultText';
import Stars from '../../../components/Stars/Stars';
import Collapse from '../../../components/Collapse';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FavMovies = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);
  const [sort, setSort] = useState('created_at.desc');
  const prevSortRef = useRef();
  const childCompRef = useRef();

  useEffect(() => {
    getItems();
  }, [page, sort]);

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
          `/account/${accountId}/movie/favorites`,
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

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', marginBottom: 50}}>
      <ActivityIndicator />
    </View>
  ) : (
    <View>
      <Collapse ref={childCompRef}>
        <View style={styles.collapseContainer}>
          <TouchableOpacity
            style={styles.collapseButtons}
            onPress={() =>
              prevSortRef.current === 'created_at.desc'
                ? setSort('created_at.asc')
                : setSort('created_at.desc')
            }>
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
            onPress={() =>
              prevSortRef.current === 'release_date.desc'
                ? setSort('release_date.asc')
                : setSort('release_date.desc')
            }>
            {(sort === 'release_date.asc' || sort === 'release_date.desc') && (
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
            onPress={() =>
              prevSortRef.current === 'title.asc'
                ? setSort('title.desc')
                : setSort('title.asc')
            }>
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
            onPress={() =>
              prevSortRef.current === 'vote_average.desc'
                ? setSort('vote_average.asc')
                : setSort('vote_average.desc')
            }>
            {(sort === 'vote_average.asc' || sort === 'vote_average.desc') && (
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
        // onEndReached={() => {
        //   setPage(page + 1);
        //   setIsExtraLoading(true);
        // }}
        keyExtractor={({id}) => id}
        // ListFooterComponent={RenderFooter(isExtraLoading)}
        renderItem={({item}) => renderItem(item)}
        onScroll={() => childCompRef.current.setExpand()}
      />
    </View>
  );
};

export default FavMovies;

const styles = StyleSheet.create({
  flatlistItems: {
    flexDirection: 'row',
    padding: 10,
  },
  itemDetails: {
    padding: 10,
    justifyContent: 'center',
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
