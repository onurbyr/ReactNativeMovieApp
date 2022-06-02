import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderWithBack from '../components/HeaderWithBack';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import useOrientation from '../hooks/useOrientation';
import strings from '../localization/strings';

const ListVideos = ({route, navigation}) => {
  const {videos} = route.params;
  const [imageWidth, setImageWidth] = useState(Dimensions.get('window').width);
  const orientation = useOrientation(setImageWidth);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack>{strings.videos}</HeaderWithBack>
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
              resizeMode="contain"
              style={{
                width: imageWidth,
                height:
                  orientation == 'PORTRAIT' ? (imageWidth / 1280) * 720 : 200,
                borderRadius: 10,
              }}
              source={{
                uri: `https://img.youtube.com/vi/${item.key}/maxresdefault.jpg`,
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
