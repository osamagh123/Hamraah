import { BackHandler, Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Button, Image, Pressable, Text, View } from 'native-base'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import auth,{ firebase } from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';


export default function VerifyEmail(props) {
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
  
  const mail = props.mail;
    const navigation = useNavigation();
    const returnLogin = () =>{

      const user = firebase.auth().currentUser;
    if(user){
      firebase.auth().signOut()
      .then(() => {
        navigation.navigate('Login')
      })
      .catch((error)=> {
        alert(error);
      })    }
    else{
      navigation.navigate('Login')

    }
      
  }
  return (
    <SafeAreaView>
      <View bgColor="#252525" h="100%" justifyContent='center'>
      <View  alignItems="center">
        <Image resizeMode='contain' h='220' mt="10" source={require('../images/email.png')} alt="img"/>
        <Text fontSize="32" color="white" mt="5">Check Your Email</Text>
        <Text px='3' mt='3' textAlign="center" mb="3" color="#939AA8" fontSize="14" fontWeight="400">We've sent an email to <Text textTransform='lowercase' color="#00DAFF">{mail}</Text> with instructions to reset your password. Make sure to check your Spam/Junk folder.</Text>
        {/* <Pressable mt='5' borderRadius='8' w='90%' h='50' bgColor='#07b3d1' mb='2' _pressed={{backgroundColor: '#07b3d1'}} onPress={returnLogin}>
                    <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Continue</Text>  
                      </View>
                    </LinearGradient>
        </Pressable> */}
        <Pressable mt='5' borderRadius='8' w={windowWidth >= 500 ? '70%' : '85%'} h='50' borderWidth='1' bgColor='transparent' borderColor='#07b3d1' mb='2' _pressed={{backgroundColor: '#07b3d1'}} onPress={returnLogin}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Continue</Text>  
                      </View>
        </Pressable>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})