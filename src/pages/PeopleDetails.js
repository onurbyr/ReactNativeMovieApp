import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {api, apiKey, apiImgUrl} from '../../services/api/api';
import DefaultText from '../components/DefaultText';
import BoldText from '../components/BoldText';
import BackButton from '../components/BackButton';
import NoAvatar from '../images/noavatar.png';

const PeopleDetails = ({route}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {itemId} = route.params;
  const NO_AVATAR_IMAGE = Image.resolveAssetSource(NoAvatar).uri;
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 5); //to check the text is more than 5 lines or not
  }, []);

  useEffect(() => {
    getItems();
  }, []);

  //getdata with axios
  const getItems = async () => {
    try {
      const response = await api.get('/person/' + itemId, {
        params: {
          api_key: apiKey.API_KEY,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const getAge = dateString => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <BackButton style={[styles.backButton, {top: 0}]} />
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          <BackButton style={styles.backButton} />
          <ScrollView>
            <Image
              source={{
                uri: data.profile_path
                  ? apiImgUrl.API_IMAGE_URL + '/h632' + data.profile_path
                  : NO_AVATAR_IMAGE,
              }}
              resizeMode={data.profile_path ? 'cover' : 'center'}
              blurRadius={5}
              style={{height: 250}}
            />
            <View style={styles.info}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: data.profile_path
                      ? apiImgUrl.API_IMAGE_URL + '/w500' + data.profile_path
                      : NO_AVATAR_IMAGE,
                  }}
                  resizeMode={data.profile_path ? 'cover' : 'center'}
                  style={styles.profileImage}
                />
                <View style={styles.imageLeftPanel}>
                  <BoldText>{data.name}</BoldText>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Known For:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.known_for_department}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Gender:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.gender == 1 ? 'Female' : ' Male'}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>Age:</DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {getAge(data.birthday)}
                    </DefaultText>
                  </View>
                  <View style={styles.imageLeftPanelItems}>
                    <DefaultText style={{color: '#B6B6B6'}}>
                      Place of Birth:
                    </DefaultText>
                    <DefaultText style={styles.imageLeftPanelItemsText}>
                      {data.place_of_birth ? data.place_of_birth : '-'}
                    </DefaultText>
                  </View>
                </View>
              </View>
              <BoldText style={{marginTop: 20}}>Biography</BoldText>
              <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 5}
                style={styles.seeMoreText}>
                {data.biography}
              </Text>

              {lengthMore ? (
                <Text onPress={toggleNumberOfLines} style={styles.seeMoreText2}>
                  {textShown ? 'Read less...' : 'Read more...'}
                </Text>
              ) : null}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PeopleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15141F',
  },
  backButton: {
    marginTop: 20,
    position: 'absolute',
    zIndex: 1,
  },
  info: {
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: '#15141F',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginTop: -50,
  },
  imageLeftPanel: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
  },
  imageLeftPanelItems: {
    flexDirection: 'row',
    marginTop: 5,
  },
  imageLeftPanelItemsText: {
    flex: 1,
    color: '#B6B6B6',
    marginLeft: 2,
  },
  seeMoreText: {
    lineHeight: 21,
    color: '#B6B6B6',
    fontFamily: 'Lato-Light',
    fontSize: 12,
    marginTop: 5,
  },
  seeMoreText2: {
    lineHeight: 21,
    marginTop: 5,
    color: '#B6B6B6',
    fontFamily: 'Lato-Regular',
  },
});
