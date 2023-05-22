import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Rating } from 'react-native-ratings'

export default function Rate() {
    const [rating, setRating] = useState(0)
    const [rating2, setRating2] = useState(0)
    const [submitted, setSubmitted] = useState(false)
  return (
    <SafeAreaView>
      <Text>Rate</Text>
      <Rating
          type='custom'
          startingValue={rating}
          ratingBackgroundColor='#c8c7c8'
          onFinishRating={(rating) => setRating(rating)}
          tintColor='#FFFFFF'
          imageSize={16}
          readonly={submitted}
          />

        <Rating
          type='custom'
          startingValue={rating2}
          ratingBackgroundColor='#c8c7c8'
          onFinishRating={(rating) => setRating2(rating)}
          tintColor='#FFFFFF'
          imageSize={16}
          readonly={submitted}
          />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})