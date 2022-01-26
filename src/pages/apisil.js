import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import axios from 'axios';
import {api,apiKey} from './services/api/api';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  let session_id='2d2dcd967233d5f70b3c116cfd744b650907f767'
  let language='en-US'
  let page='1'


  const getMovies = async () => {
     try {
      const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=640289113ecd0be43e11a44ff0aa7296&language=en-US&page=1');
      const json = await response.json();
      console.log(json.results)
      setData(json.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  //getdata with axios
  const getDataUsingAsyncAwaitGetCall = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/popular?api_key=640289113ecd0be43e11a44ff0aa7296&language=en-US&page=1',
      );
      //alert(JSON.stringify(response.data));
      console.log(response.data)
      setData(response.data.results);
    } catch (error) {
      // handle error
      console.log(error.message);
    }
    finally {
      setLoading(false);
    }
  };
  //getdata with axios2
  const getDataUsingAsyncAwaitGetCall2 = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params:{
          api_key,
          language,
          page
        }
      });
      //alert(JSON.stringify(response.data));
      console.log(response.data)
      setData(response.data.results);
    } catch (error) {
      // handle error
      console.log(error.message);
    }
    finally {
      setLoading(false);
    }
  };
  //getdata with axios3 (baseurl)
  const getDataUsingAsyncAwaitGetCall3 = async () => {
    try {
      const response = await api.get('/movie/popular', {
        params:{
          api_key:apiKey.API_KEY,
          language,
          page
        }
      });
      //alert(JSON.stringify(response.data));
      console.log(response.data)
      setData(response.data.results);
    } catch (error) {
      // handle error
      console.log(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  //post method with axios
  const postDataUsingSimplePostCall = () => {
    axios
      .post('https://api.themoviedb.org/3/account/{account_id}/favorite?api_key=640289113ecd0be43e11a44ff0aa7296&session_id=2d2dcd967233d5f70b3c116cfd744b650907f767', {
        media_type: 'movie',
        media_id: 590,
        favorite: true,
      })
      .then(function (response) {
        // handle success
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // handle error
        console.log(error.message);
      });
  };

  //post method axios with params
  const postDataUsingSimplePostCallWithParams = () => {
    axios
      .post('https://api.themoviedb.org/3/account/{account_id}/favorite', {
        media_type: 'movie',
        media_id: 590,
        favorite: true,
      },{
        params:{
          api_key: '640289113ecd0be43e11a44ff0aa7296',
          session_id:'2d2dcd967233d5f70b3c116cfd744b650907f767'
        }
      })
      .then(function (response) {
        // handle success
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // handle error
        console.log(error.message);
      });
  };

  //post method axios with params 2
  const postDataUsingSimplePostCallWithParams2 = () => {
    axios
      .post('https://api.themoviedb.org/3/account/{account_id}/favorite', {
        media_type: 'movie',
        media_id: 590,
        favorite: true,
      },{
        params:{
          api_key,
          session_id
        }
      })
      .then(function (response) {
        // handle success
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // handle error
        console.log(error.message);
      });
  };



  useEffect(() => {
    //getMovies();
    //getDataUsingAsyncAwaitGetCall()
    //getDataUsingAsyncAwaitGetCall2()
    getDataUsingAsyncAwaitGetCall3()
    //postDataUsingSimplePostCall()
    //postDataUsingSimplePostCallWithParams()
    //postDataUsingSimplePostCallWithParams2()
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.vote_average}</Text>
          )}
        />
      )}
    </View>
  );
};

export default App;


