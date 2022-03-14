import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';
import usePrevious from '../hooks/usePrevious';
import {apiv4Authorized} from '../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderFooter from '../components/RenderFooter';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreatedLists = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1)
      getItems();
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
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

  const renderItem = item => {
    return (
      <TouchableOpacity style={styles.listView}>
        <DefaultText style={styles.itemText}>
          {item.number_of_items}{' '}
          {item.number_of_items === 0 || item.number_of_items === 1
            ? 'item'
            : 'items'}
        </DefaultText>
        <View>
          <BoldText>{item.name}</BoldText>
          {item.public ? (
            <MaterialIcons
              style={styles.public}
              name="public"
              color={'white'}
              size={14}
            />
          ) : (
            <MaterialIcons
              style={styles.public}
              name="lock"
              color={'white'}
              size={14}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.rightIconView}>
            <MaterialIcons name="chevron-right" color={'white'} size={24} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  itemText: {
    textAlignVertical: 'center',
    marginHorizontal: 25,
  },
  listView: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#1C1C3A',
    borderRadius: 10,
    marginBottom: 20,
  },
  public: {
    marginTop: 40,
  },
  rightIconView: {
    justifyContent: 'center',
    paddingRight: 10,
    alignSelf: 'flex-end',
    flex: 1,
  },
});
