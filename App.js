import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Movies from './src/pages/Movies/Movies';
import TvSeries from './src/pages/TvSeries/TvSeries';
import Search from './src/pages/Search';
import IconFeather from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FD8266',
        tabBarInactiveTintColor: 'lightgray',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#15141F',
          position: 'absolute',
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Movies"
        component={Movies}
        options={{
          tabBarIcon: ({color, size}) => (
            <IconFeather name="home" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="TvSeries"
        component={TvSeries}
        options={{
          tabBarIcon: ({color, size}) => (
            <IconFeather name="tv" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({color, size}) => (
            <IconFeather name="search" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};

export default App;
