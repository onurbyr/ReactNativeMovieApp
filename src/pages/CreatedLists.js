import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import BackButton from '../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';
import usePrevious from '../hooks/usePrevious';
import {apiv4Authorized} from '../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderFooter from '../components/RenderFooter';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useDidMountEffect from '../hooks/useDidMountEffect';

const CreatedLists = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);
  const {itemId, mediaType} = route.params;

  const flatListRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems();
      setPage(1);
      setData([]);
    });

    return unsubscribe;
  }, [navigation]);

  // runs if 'key' changes, but not on initial render
  useDidMountEffect(() => {
    getItems();
  }, [page]);

  //getdata with axios
  const getItems = async () => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const accountId = await AsyncStorage.getItem('@account_id');
        const response = await apiv4.get(`/account/${accountId}/lists`, {
          params: {
            page,
          },
        });
        if (prevPage === page - 1) {
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

  const toTop = () => {
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
  };

  const addItem = async item => {
    const apiv4 = await apiv4Authorized();
    if (apiv4) {
      try {
        const result = await apiv4.post(`/list/${item.id}/items`, {
          items: [{media_type: mediaType, media_id: itemId}],
        });
        if (result.data.success == true) {
          toTop();
          setPage(1);
          ToastAndroid.show('Successfully added', ToastAndroid.SHORT);
        }
      } catch (err) {
        ToastAndroid.show('An error occured', ToastAndroid.SHORT);
      }
    } else {
      navigation.navigate('Login');
    }
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
        <Hr />
        <TouchableOpacity style={styles.listView} onPress={() => addItem(item)}>
          <BoldText>{item.name}</BoldText>
          {item.public ? (
            <MaterialIcons
              style={styles.public}
              name="public"
              color={'#726C8D'}
              size={12}
            />
          ) : (
            <MaterialIcons
              style={styles.public}
              name="lock"
              color={'#726C8D'}
              size={12}
            />
          )}
          <View style={{flex: 1}}>
            <TouchableOpacity style={styles.rightView}>
              <DefaultText>{item.number_of_items}</DefaultText>
              <MaterialIcons name="chevron-right" color={'white'} size={24} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return isLoading ? (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <BackButton style={{position: 'absolute', top: 20}} />
      <ActivityIndicator />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>Created Lists</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateList')}
          style={styles.addListIconView}>
          <Entypo name="add-to-list" color={'white'} size={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={{paddingHorizontal: 20}}
        ref={flatListRef}
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
        ListFooterComponent={RenderFooter(isExtraLoading)}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
};

export default CreatedLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#dddddd',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    marginLeft: 20,
  },
  addListIconView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  listView: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  public: {
    marginLeft: 5,
    marginTop: 2,
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flex: 1,
  },
});