import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';
import usePrevious from '../hooks/usePrevious';
import {apiv4Authorized} from '../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderFooter from '../components/RenderFooter';
import CheckBox from '@react-native-community/checkbox';

const CreatedLists = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems();
    });

    return unsubscribe;
  }, [page, navigation]);

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
        // response.data.results.map((x,index) => {
        //   response.data.results[index].isChecked=true
        // });
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

  const onCheckBoxValueChange = (itemId, newValue) => {
    let temp = data.map(data => {
      if (itemId === data.id) {
        return {...data, isChecked: !data.isChecked};
      }
      return data;
    });
    setData(temp);
  };

  const renderItem = item => {
    return (
      <View style={{borderWidth: 1, flexDirection: 'row'}}>
        <CheckBox
          disabled={false}
          value={item.isChecked}
          onValueChange={() => onCheckBoxValueChange(item.id)}
        />
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
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
});
