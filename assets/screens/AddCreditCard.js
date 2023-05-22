import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {View , Text , Image, Input, HStack, Center, Button, ScrollView} from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddCreditCard() {
    const windowWidth = Dimensions.get('window').width;
    const twoWidth = windowWidth/2 - 10;
    const navigation = useNavigation();
  return (
    <ScrollView p='3' bgColor='white' h='100%'>
      <TouchableOpacity onPress={() => {navigation.goBack()}}><FontAwesomeIcon size={18} style={{color: '#31373E'}} icon={faArrowLeft}/></TouchableOpacity>

        <Text mt='5' fontSize="20" color="#31373E">Add Credit Card</Text>
        <View mt='10' bgColor='#31373E' justifyContent='center' alignItems='center' h='180' borderRadius='18'>
            <Image source={require('../images/scan.png')} alt='scan'/>
            <Text color='white' textTransform='uppercase' mt='2' fontSize='10'>Scan your card</Text>
        </View>
        <View mt='5'>
            <Text mt='3' color='#798293' fontSize='10'>Name</Text>
            <Input borderColor='#E7EAEF' mt='1'/>
            <Text mt='3' color='#798293' fontSize='10'>Credit Card Number</Text>
            <Input type='password' borderColor='#E7EAEF' mt='1'/>
            <HStack>
                <View w={twoWidth} mr='3'>
                    <Text mt='3' color='#798293' fontSize='10'>Expires</Text>
                    <Input borderColor='#E7EAEF' mt='1'/>
                </View>
                <View w={twoWidth}>
                    <Text mt='3' color='#798293' fontSize='10'>CVV</Text>
                    <Input borderColor='#E7EAEF' mt='1'/>
                </View>
            </HStack>
        </View>
        <Center mt='10'>
          <Button bgColor='#00AFCD' w='200' mb='10'>
            <Text color='white'>Save</Text>
          </Button>
        </Center>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})