import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Rating, AirbnbRating,Button } from 'react-native-ratings';
import { ScrollView, Text } from 'native-base';

export default function RatingScreen() {
    const [rate,setRate] = useState(0);
  return (
    <SafeAreaView>
      <ScrollView bgColor='#252525'h='100%'>
      <Text mb='3' textAlign='center' fontSize='24' color='white'>Rating Screen</Text>
        <Rating
        type='custom'
        startingValue={0}
        onFinishRating={(rating) => setRate(rating)}
        tintColor='#252525'
        style={{backgroundColor: 'transparent'}}
        readonly
        />
        {/* <Button
        title="Submit Rating"
        onPress={() => submitRating()}
        /> */}

        <Text textAlign='center' color='white'>{rate}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})