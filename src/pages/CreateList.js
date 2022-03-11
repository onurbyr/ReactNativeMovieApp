import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderWithBack from '../components/HeaderWithBack'

const CreateList = () => {
  return (
    <View style={styles.container}>
      <HeaderWithBack>
        Create List
      </HeaderWithBack>
    </View>
  )
}

export default CreateList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#15141F',
      },
})