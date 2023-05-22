import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Image, View } from 'native-base'

export default function Car() {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  return (
    <View>
          <Image resizeMode='contain' w={windowWidth >= 500 ? '300' : '160' } h={windowWidth >= 500 ? '260' : '150' }  source={require('../images/cars.png')} alt='Motorcycle'/>
    </View>
  )
}

const styles = StyleSheet.create({})