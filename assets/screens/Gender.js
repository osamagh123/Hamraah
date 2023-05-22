import { BackHandler, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Center, HStack, Image, Pressable, Radio, Text, View } from 'native-base'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

export default function Gender() {
    const windowWidth = Dimensions.get('window').width;

    const navigation = useNavigation();
    const [selectedItem,setSelectedItem] = useState('Male');
    const user = firebase.auth().currentUser;

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

    const onPressHandler = () => {
      firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        gender: selectedItem,
      })
      .then(()=>{
        console.log('Added')
        navigation.navigate('Home')
      })
      .catch((error) =>{
        alert(error);
      })
    }
  return (
    <SafeAreaView>
      <View p='5' h='100%' bgColor='#252525' justifyContent='center'>
      <Text textAlign='center' color='white' fontSize='32'>Select Your Gender</Text>
      <View px='10' mt='10'>
         <HStack justifyContent='space-between'>
          <View>
          <Pressable borderRadius='70' onPress={() => setSelectedItem('Male')} borderWidth={selectedItem === 'Male' ? '2' : '0' } borderColor='#00AFCD'>
            <Image bgColor='#23272D' h='100' w='100' borderRadius='70' source={require('../images/male-7.png')} alt='male'/>
          </Pressable>
          <Text color='white' textAlign='center' mt='3'>Male</Text>
          </View>

          <View>
          <Pressable borderRadius='70' onPress={() => setSelectedItem('Female')} borderWidth={selectedItem === 'Female' ? '2' : '0'} borderColor='#00AFCD'>
            <Image bgColor='#23272D' h='100' w='100' borderRadius='70' source={require('../images/female-6.png')} alt='female'/>
          </Pressable>
          <Text color='white' textAlign='center' mt='3'>Female</Text>

          </View>
        </HStack>
      </View>
      <Center mt='10'>
        <Button onPress={onPressHandler} h='50' bgColor='transparent' borderWidth='1' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}} w={windowWidth >= 500 ? '70%' : '85%'}><Text color='white'>Continue</Text></Button>
      </Center>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})