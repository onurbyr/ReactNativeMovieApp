import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import {api,apiKey,apiImgUrl} from '../../services/api/api';

const Home = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getPopularMovies()
      }, []);

      //getdata with axios
  const getPopularMovies = async () => {
    try {
      const response = await api.get('/movie/popular', {
        params:{
          api_key:apiKey.API_KEY,
          page
        }
      });
      setData(response.data.results);
      console.log(response.data)
    } catch (error) {
      console.log(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
            <Text style={styles.headerText}>Pupular</Text>
            <Text style={styles.headerText2}> Movies</Text>
        </View>
        <View style={styles.bodyView}>
        {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.items}>
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
            </View>
              

            
            
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
        color:'orange',
        fontSize:28,
        textAlignVertical:'center',
        fontFamily:'Lato-Regular'
    },
    bodyView:{
        flex:5,
    },
    items:{
        flex:1,
        alignItems:'center',
        padding:20
        
    },
    itemsText:{
        marginTop:10,
        fontSize:12,
        color:'#ffffff'
    },
    itemsText2:{
        marginTop:5,
        fontSize:12,
        color:'#ffffff'
    }
});



export default Home;