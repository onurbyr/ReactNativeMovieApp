import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import BackButton from '../../../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';
import usePrevious from '../../../hooks/usePrevious';
import {apiv4Authorized} from '../../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderFooter from '../../../components/RenderFooter';
import DefaultText from '../../../components/DefaultText';
import BoldText from '../../../components/BoldText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import strings from '../../../localization/strings'

const ProfileLists = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevPage = usePrevious(page);
  const [isExtraLoading, setIsExtraLoading] = useState(false);

  const flatListRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setPage(1);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getItems();
  }, [page, isLoading]);

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
        } else {
          setData(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
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
        <TouchableOpacity
          style={styles.listView}
          onPress={() =>
            navigation.navigate('ProfileListDetails', {
              listId: item.id,
              listName: item.name,
            })
          }>
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
            <View style={styles.rightView}>
              <DefaultText>{item.number_of_items}</DefaultText>
              <MaterialIcons name="chevron-right" color={'white'} size={24} />
            </View>
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
        <Text style={styles.headerText}>{strings.createdlists}</Text>
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

export default ProfileLists;

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
