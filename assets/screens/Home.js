import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'native-base'
import { firebase } from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/core'

export default function Home() {
const navigation = useNavigation();
    async function logout() {
        await firebase.auth().signOut();
        navigation.navigate('Login');
    }
  return (
    <SafeAreaView>
        <Text>Home</Text>
        <Button onPress={logout}>Logout</Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})