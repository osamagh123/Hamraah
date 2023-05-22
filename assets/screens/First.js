import { BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Button, Center, Image, ScrollView, Text, View } from 'native-base'
import { firebase } from '@react-native-firebase/auth'
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { AirbnbRating } from 'react-native-ratings';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native'

import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';

export default function First() {
    const user = firebase.auth().currentUser;
    console.log(user)
    const navigation = useNavigation();
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    
    


    useFocusEffect(
        useCallback(() =>{
          const onBackPress = () =>{
            return true;
          };
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
    
          return () =>
          BackHandler.removeEventListener('hardwareBackPress',onBackPress);
        },[])
      );


  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test',
      channelName: 'Test Channel',
    })
  }

  useEffect(() => {

    const ReadUser = async() =>{ 
      var users = [];
      try{
        await firestore()
        .collection('Users')
        .where('uid','==',user.uid)
        .get()
        .then((querySnapshot) =>{
          querySnapshot.docs.forEach((doc)=>{
            users.push({...doc.data(), key: doc.id});
            console.log(users.length)
          })
          if(users.length >= 1){
          }
          else{
            if(!user.email){
              navigation.navigate('NewProfilePhone')
            }
            else if (!user.phoneNumber){
              navigation.navigate('NewProfile')
            }

          }
        })
      }
      catch(error){
        alert(error);
      }
    }

    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;    
      if (enabled) {
        console.log('Authorization status:', authStatus);        
      }
    }
    ReadUser();
    createChannels();
    requestUserPermission();
  },[])

  return (
    <SafeAreaView>
        <ScrollView h='100%' p='5' bgColor="#252525" >
            <View  justifyContent='center' h={windowHeight - 100}>
            <Text fontSize='28' ml={windowWidth >= 500 ? 30 : 1} color='#00AFCD'>Welcome,</Text>
            <Text color='white' ml={windowWidth >= 500 ? 30 : 1} fontSize='24'>{user.displayName}</Text>
            <Center mt='0'>
            
                <Image resizeMode='contain'   h={windowWidth >= 500 ? '700' : '350' } w='100%' source={require('../images/home.png')} alt='first'/>
                {/* <Button bgColor='#00AFCD' w='200' onPress={() => {navigation.navigate('Offer')}} _pressed={{backgroundColor: '#07b3d1'}}><Text color='white'>Post</Text></Button> */}

                <Button  mt='0' borderWidth='1' borderColor='#00AFCD' borderRadius='8' bgColor='transparent' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' onPress={() => {navigation.navigate('Offer')}} _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}}><Text fontSize='16' color='white'>Post a ride</Text></Button>
                <Button mt='5'  borderWidth='1' borderColor='#00AFCD' borderRadius='8' bgColor='transparent' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' onPress={() => {navigation.navigate('Request')}} _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}}><Text fontSize='16' color='white'>Search a ride</Text></Button>
                <Button mt='5' mb='10' borderWidth='1' borderColor='#00AFCD' borderRadius='8' bgColor='transparent' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' onPress={() => {navigation.navigate('Scheduled')}} _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}}><Text fontSize='16' color='white'>Scheduled rides</Text></Button>
            </Center>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})