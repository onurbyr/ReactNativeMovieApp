import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {Text, View, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import BoldText from './BoldText';
import DefaultText from './DefaultText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Collapse = forwardRef((props, ref) => {
  const [animatedHeight] = useState(new Animated.Value(50));
  const [expanded, setExpanded] = useState(false);

  useImperativeHandle(ref, () => ({
    setExpand() {
      if (expanded == true) {
        // collapse dropdown
        Animated.timing(animatedHeight, {
          toValue: 50,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }

      setExpanded(false);
    },
  }));

  const toggleDropdown = () => {
    if (expanded == true) {
      // collapse dropdown
      Animated.timing(animatedHeight, {
        toValue: 50,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      // expand dropdown
      Animated.timing(animatedHeight, {
        toValue: 250,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <Animated.View style={[styles.container, {height: animatedHeight}]}>
      <TouchableOpacity
        onPress={() => toggleDropdown()}
        style={styles.toggleBtn}>
        <BoldText>Sort By</BoldText>
        <MaterialIcons name="sort" color={'white'} size={24} />
      </TouchableOpacity>
      {expanded == true ? props.children : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  toggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Collapse;
