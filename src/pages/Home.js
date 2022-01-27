import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {api,apiKey,apiImgUrl} from '../../services/api/api';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieDetails from './MovieDetails';



const HomeScreen = ({navigation} ) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getPopularMovies()
      }, []);
      

    const addElement = (newData) => {
      let newArray = [...data , ...newData];
      setData(newArray);
    }

//getdata with axios
  const getPopularMovies = async () => {
    try {
      const response = await api.get('/movie/popular', {
        params:{
          api_key:apiKey.API_KEY,
          page
        }
      });
      setPage(page+1)
      addElement(response.data.results)
      console.log(response.data.results)
    } catch (error) {
      console.log(error.message);
    }
    finally {
      setLoading(false);
    }
  };


  const onPress = (id) => {
    // navigation.navigate('MovieDetails')
    navigation.navigate('MovieDetails', {
      itemId: id
    });
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
            <Text style={styles.headerText}>Popular</Text>
            <Text style={styles.headerText2}> Movies</Text>
        </View>
        <View style={styles.bodyView}>
        {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          onEndReached={({ distanceFromEnd }) => {
            getPopularMovies()
            }}
          keyExtractor={({ id }, index) => id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.items} onPress={()=>(onPress(item.id))}>
                <Image
                style={{width:150, height:250, borderRadius:10}}
                source={{
                    uri: apiImgUrl.API_IMAGE_URL+item.poster_path,
                }}
              />
              <Text style={styles.itemsText}>
                  {item.title}
              </Text>
              <Text style={styles.itemsText2}>
                  {item.vote_average}
              </Text>
            </TouchableOpacity>     
          )}
        />
      )}
        </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#15141F',
        color:'#ffffff',
    },
    headerView:{
        flex:1,
        flexDirection:'row',
        marginLeft:20,
    },
    headerText:{
        color:'white',
        fontSize:28,
        textAlignVertical:'center',
        fontFamily:'Lato-Regular'
    },
    headerText2:{
        color:'#FD8266',
        fontSize:28,
        textAlignVertical:'center',
        fontFamily:'Lato-Regular'
    },
    bodyView:{
        flex:8,
    },
    items:{
        flex:1,
        alignItems:'center',
        padding:20
        
    },
    itemsText:{
        marginTop:10,
        fontSize:12,
        color:'#ffffff',
        textAlign: 'center',
    },
    itemsText2:{
        marginTop:5,
        fontSize:12,
        color:'#ffffff',
        textAlign: 'center',
    }
});



const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
      name="HomeScreen" 
      component={HomeScreen} 
      options={{ headerShown: false }}
      />
      <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetails} 
      //options={{ headerShown: false }}
      />
    </Stack.Navigator>

  )
};



export default Home;