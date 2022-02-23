import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import HeaderWithBack from '../components/HeaderWithBack';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';

const ListVideos = ({route, navigation}) => {
  const {videos} = route.params;

  const win = Dimensions.get('window');
  const ratio = win.width / 1280; //1280 is actual image width

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack>Videos</HeaderWithBack>
      <FlatList
        data={videos}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.items}
            onPress={() =>
              navigation.navigate('Videos', {
                itemId: item.key,
              })
            }>
            <Image
              style={{
                width: win.width,
                height: 720 * ratio, //720 is actual height of image
              }}
              source={{
                uri:
                  'http://img.youtube.com/vi/' +
                  item.key +
                  '/maxresdefault.jpg',
              }}
            />
            <BoldText style={styles.itemsText}>{item.name}</BoldText>
            <DefaultText style={styles.itemsText2}>{item.type}</DefaultText>
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

export default ListVideos;
