import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'

export default function AnimatedScreen() {
  return (
    <View>
        <View style={{height: '100%',backgroundColor: '#030303'}}>
      <View style={{flex:1, justifyContent:'center'}}>
      <FastImage
      style={{width: '100%', height: 300, resizeMode: "contain"}}
      source={require('../gif/animation-2.gif')}
      resizeMode={FastImage.resizeMode.contain}
      />
      </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({})