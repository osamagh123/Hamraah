import { ActivityIndicator, BackHandler, SafeAreaView, StyleSheet,Platform, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Center, Divider, HStack, Image, Input, Modal, Pressable, Radio, ScrollView, Text, TextArea, View } from 'native-base'
import { NavigationContainerRefContext, useFocusEffect, useNavigation } from '@react-navigation/native'
import {Picker} from '@react-native-picker/picker';
import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { faCircleCheck, faPerson, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Car from './Car';
import Motorcycle from './Motorcycle';

export default function Offer() {
    const navigation = useNavigation();
    const [rideType, setRideType] = useState('Motorcycle');
    const [persons, setPersons] = useState(1);
    const [gender, setGender] = useState('Male');
    const [genderConsumer, setGenderConsumer] = useState('Male');
    const [destinationFrom, setDestinationFrom] =useState('');
    const [destinationTo, setDestinationTo] = useState('');
    const [destinationFromConsumer, setDestinationFromConsumer] = useState('');
    const [destinationToConsumer, setDestinationToConsumer] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionConsumer, setDescriptionConsumer] = useState('');
    const [riderData,setRiderData] = useState([]);
    const [userData,setUserData] = useState([]);
    const [consumerData,setConsumerData] = useState([]);
    const [status,setStatus] = useState(' ');
    const user = firebase.auth().currentUser;
    const [isLoading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [seats, setSeats] =useState(1);
    const [error, setError] = useState(false);

    const RiderSubmit = () =>{
      setLoading(true)

      if(!destinationFrom.trim()){
        alert('Enter Destination(To)');
        setLoading(false)
        setError(true)

      }
      else if (!destinationTo.trim()){
        alert('Enter Destination(From)');
        setLoading(false)
        setError(true)

      }
      else{
        firestore()
        .collection('Ride')
        .add({
          userId: user.uid,
          name: user.displayName,
          phoneNumber: userData[0].phone,
          to: destinationTo,
          from: destinationFrom,
          rideType: rideType,
          persons: seats,
          gender: userData[0].gender,
          description: description,
          info: 'Rider',
          status: 'Pending',
          photoURL: user.photoURL,
        })
        .then(()=>{
          console.log('Added');
          setLoading(false)

          if(seats == 1) {
            navigation.navigate('Find');
          }
          else{
            navigation.navigate('FindCar');
          }
        })
        .catch((error)=>{
          setLoading(false)
          alert(error);
        })

      }
    }

  const handlePress = useCallback((newRideType) => {
    setRideType(newRideType)
  },[rideType])


 
    return(
      <View mt='2' p='5'>
                <View bgColor='transparent' borderWidth='1' borderColor='#00AFCD' p='3' pb='0' borderRadius='5' style={{
                    ...Platform.select({
                        ios: {
                            shadowColor: '#ffffff',
                            shadowOffset: { width: 2, height: 3 },
                            shadowOpacity: 0.5,
                            shadowRadius: 4.65,
                        },
                        android: {
                            elevation: 24,
                        },
                    }),
                }}>
                  <Text fontSize='12' color='white'>Leaving from</Text>
                  <Input mt='1' onChange={() => {setError(false) }} color='white' mb='2' variant='unstyled' borderColor='red.600' borderWidth={error === true ? 1 : 0} placeholder='Destination (From)' w='100%' value={destinationFrom} onChangeText={text => setDestinationFrom(text)}/>
                  <Divider/>
                  <Text mt='2' fontSize='12' color='white'>Going to</Text>
                  <Input mt='2' onChange={() => {setError(false) }} color='white' mb='2' variant='unstyled' borderColor='red.600' borderWidth={error === true ? 1 : 0} placeholder='Destination (To)' w='100%' value={destinationTo} onChangeText={text => setDestinationTo(text)}/>
                </View>
                <Text color='white' mt='5' mb='5' textAlign='center'>Ride Type</Text>
                <HStack mb='5' justifyContent='space-around'>
                  <TouchableOpacity py='10' onPress={() => {setRideType('Motorcycle')}}>
                    {rideType === 'Motorcycle' ? (
                        <Motorcycle/>
                    ) : (
                      <Image resizeMode='contain' w='160' h='150'  source={require('../images/bike-1.png')} alt='Motorcycle'/>
                    )}
                      <Text mt='3' color='white' fontSize='12' fontWeight='600' textAlign='center'>Two Wheeler Ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity py='10' onPress={() => {setRideType('Car')}}>
                    {rideType === 'Car' ? (
                      <Image resizeMode='contain' w='160' h='150'  source={require('../images/cars-1.png')} alt='Car'/>
                    ) : (
                        <Car/>
                    )}
                    <Text mt='3' color='white' fontSize='12' fontWeight='600' textAlign='center'>Four Wheeler Ride</Text>
                  </TouchableOpacity>
                </HStack>
                
                <HStack>
                  <TextArea color='white' mb='5' borderColor='#00AFCD' h={20} placeholder="Description" w="60%" value={description} onChangeText={text => setDescription(text)} />
                  {rideType === 'Motorcycle' ? (<View ml='3' borderRadius='7' justifyContent='center' alignItems='center' w='37%' h='20' bgColor='white'>
                    <Text fontSize='12'>No. of Seats</Text>
                    <Text mt='1' fontSize='12'>{seats}</Text>
                  </View>): rideType === 'Car' ? (<View ml='3' borderRadius='7' justifyContent='center' alignItems='center' w='37%' h='20' bgColor='white'>
                    <Text fontSize='12'>No. of Seats</Text>
                    <HStack mt='1'>
                      <Pressable onPress={() => {
                        if (seats > 1) {
                          setSeats(seats - 1);
                        }
                        console.log(seats)
                      }}>
                      <View w='5'h='5' mr='2' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize='12'>-</Text>
                        </View>
                      </Pressable>
                      <Text>{seats}</Text>
                      <Pressable onPress={() => {
                        if(seats < 4){
                          setSeats(seats + 1);
                        }
                        console.log(seats)

                      }}>
                        <View w='5'h='5' ml='2' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize='12'>+</Text>
                        </View>
                      </Pressable>
                    </HStack>
                  </View>) : ''}
                </HStack>
                
                <Center mt='5'>
                    <Button bgColor='#00AFCD' w='200' onPress={RiderSubmit} _pressed={{backgroundColor: '#07b3d1'}}><Text color='white'>Post</Text></Button>
                </Center>
      </View>
    )
}

const styles = StyleSheet.create({})