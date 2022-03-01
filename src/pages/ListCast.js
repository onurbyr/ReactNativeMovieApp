import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {apiImgUrl} from '../../services/api/api';
import HeaderWithBack from '../components/HeaderWithBack';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import NoAvatar from '../images/noavatar.png';

const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;

const ListCast = ({route, navigation}) => {
  const {cast} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack>Cast</HeaderWithBack>
      <FlatList
        data={cast}
        keyExtractor={({id}) => id}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.items}
            onPress={() =>
              navigation.navigate('PeopleDetails', {
                itemId: item.id,
              })
            }>
            <Image
              style={{width: 150, height: 250, borderRadius: 10}}
              source={{
                uri: item.profile_path
                  ? apiImgUrl.API_IMAGE_URL + '/w500' + item.profile_path
                  : NO_AVATAR_IMAGE,
              }}
              resizeMode={item.profile_path ? 'cover' : 'center'}
            />
            <BoldText style={styles.itemsText}>{item.name}</BoldText>
            <DefaultText style={styles.itemsText2}>
              {item.character}
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
  },
  itemsText2: {
    marginTop: 5,
    color: '#FF7652',
  },
});

export default ListCast;
