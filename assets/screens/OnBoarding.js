import { Image, SafeAreaView, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'native-base'
import Onboarding from 'react-native-onboarding-swiper'
import { useNavigation } from '@react-navigation/core';
import { firebase } from '@react-native-firebase/auth';

export default function OnBoarding() {
  const navigation = useNavigation();
  const user =firebase.auth().currentUser;
  const [isLoading, setLoading] = useState(true);
  useEffect(() =>{
    if(user){
      navigation.navigate('Home');
    }
    else{
      setLoading(false);
    }
  })

  
  return (
    <SafeAreaView>
      <View h='100%'>
        <Onboarding
        onSkip={() => {navigation.navigate('Login')}}
        onDone={() => {navigation.navigate('Login')}}
        pages={[
          {
            backgroundColor: '#FDCA89',
            image: <View><Image style={{height:200, width:180}} source={require('../images/onboard1.png')}/></View>,
            title: 'Carpool with neighbours',
            subtitle: 'Find neighbours from your area and carpool with them',
            },
            {
            backgroundColor: '#B5A7B6',
            image: <View><Image style={{height:200, width:180,}} source={require('../images/onboard2.png')}/></View>,
            title: 'Split cost, Share fun',
            subtitle: 'Save your cost by splitting seats and have fun with co-riders',
            },
            {
            backgroundColor: '#C7E1FF',
            image: <View><Image style={{height: 200, width: 180}} source={require('../images/onboard3.png')}/></View>,
            title: 'Choose Your Co-Riders',
            subtitle: 'Know your ride partners and be able to chat with them in advance',
            },
        ]}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})