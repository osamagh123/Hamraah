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
import Motorcycle from '../components/Motorcycle';
import Car from '../components/Car';


export default function OnBoard() {
  const navigation = useNavigation();
  const [value, setValue] = React.useState("rider");
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
  const [isButtonDisabled,setIsButtonDisabled] = useState(false);

  const [error, setError] = useState(false);


  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test',
      channelName: 'Test Channel',
    })
  }


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


  useEffect(()=>{
    const UserData = async() =>{
      try{
        setLoading(true)
        var userInfo = [];
        const getInfo = await firestore()
        .collection('Users')
        .where('uid','==',user.uid)
        .get()
        .then((querySnapshot) =>{
          querySnapshot.docs.forEach((doc) => {
            userInfo.push({...doc.data(),key: doc.id});
            
          })
          setUserData(userInfo);
        })

      }
      catch(error){
        alert(error);
      }
      setLoading(false)
    }
    const ReadData = async() => {
      try{
        setLoading(true)
        var rider = [];
        const getPost = await firestore()
        .collection('Ride')
        .where('userId','==', user.uid)
        .where('status', 'in', ['Pending','Requested','In Progress'])
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            rider.push({...doc.data(), key: doc.id});
            if(rider){
              if(rider[0].status === 'Pending' || rider[0].status === 'Requested'){
                if(rider[0].rideType === "Car"){
                  navigation.navigate('FindCar');
                }
                else if(rider[0].rideType === "Motorcycle"){
                  navigation.navigate('Find');
                }
              }
              else if(rider[0].status === 'In Progress'){
                if(rider[0].rideType === 'Motorcycle'){
                  navigation.navigate('RiderMyRide');
                }
                else if (rider[0].rideType === 'Car'){
                  navigation.navigate('CarMyRide');
                }
              }
              else{
                
              }
            }
          });
          setRiderData(rider);
          
        });
        
      }
      catch(error){
        alert(error)
      }
    setLoading(false)

    }
    const ReadConsumerData = async() =>{
      try{
        setLoading(true)
        var consumer = [];
        const getPost = await firestore()
        .collection('Consumer')
        .where('userId','==', user.uid)
        .where('status', 'in', ['Pending','Requested','In Progress','Waiting'])
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            consumer.push({...doc.data(), key: doc.id});
            console.log(consumer)
            if(consumer){
              if(consumer[0].status === 'Pending'){
                navigation.navigate('ConsumerRide');
              }
              else if(consumer[0].status === 'Requested'){
                navigation.navigate('RideStarted')
              }
              else if(consumer[0].status === 'In Progress'){
                navigation.navigate('MyRide');
              }
              else if(consumer[0].status === 'Waiting'){
                navigation.navigate('RideStarted');
              }
            }
          });
          setConsumerData(consumer);
          
        });
      }
      catch(error){
        alert(error)
      }
    setLoading(false)

    }
    UserData();
    ReadData();
    ReadConsumerData();
    createChannels();
  },[])


  if(isLoading){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#252525'}}>
         <ActivityIndicator/>
     </View>
    )
  }

 
  function riderForm(){

    const user = firebase.auth().currentUser;
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
          status: 'Pending'
        })
        .then(()=>{
          console.log('Added');
          setLoading(false)
          setIsButtonDisabled(true)


          if(seats == 1) {
            navigation.navigate('Find');
            setDestinationTo('');
            setDestinationFrom('');
          }
          else{
            navigation.navigate('FindCar');
            setDestinationTo('');
            setDestinationFrom('');
          }
        })
        .catch((error)=>{
          setLoading(false)
          alert(error);
        })

      }
    }

    const handleMotorcycle = () => {
      setRideType('Motorcycle');
      setSeats(1);

      console.log(rideType)
  }
  const handleCar = () => {
      setRideType('Car');
      console.log(rideType)

  }

 
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
                <Text color='white' mt='5' textAlign='center' mb='5'>Ride Type</Text>
                <HStack mb='5' justifyContent='space-around'>
                  <TouchableOpacity py='10' onPress={handleMotorcycle}>
                    {rideType === 'Motorcycle' ? (
                      <Motorcycle/>
                    ) : (
                      <Image resizeMode='contain' w='160' h='150'  source={require('../images/bike-1.png')} alt='Motorcycle'/>
                    )}
                      <Text mt='3' color='white' fontSize='12' fontWeight='600' textAlign='center'>Two Wheeler Ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity py='10' onPress={handleCar}>
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
                    <Text fontSize='14'>No. of Seats</Text>
                    <Text mt='1' fontSize='14'>{seats}</Text>
                  </View>): rideType === 'Car' ? (<View ml='3' borderRadius='7' justifyContent='center' alignItems='center' w='37%' h='20' bgColor='white'>
                    <Text fontSize='14'>No. of Seats</Text>
                    <HStack mt='1'>
                      <Pressable onPress={() => {
                        if (seats > 1) {
                          setSeats(seats - 1);
                        }
                        console.log(seats)
                      }}>
                      <View w='6'h='6' mr='2' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize='14'>-</Text>
                        </View>
                      </Pressable>
                      <Text>{seats}</Text>
                      <Pressable onPress={() => {
                        if(seats < 4){
                          setSeats(seats + 1);
                        }
                        console.log(seats)

                      }}>
                        <View w='6'h='6' ml='2' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize='14'>+</Text>
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

  function consumerForm(){
    const user = firebase.auth().currentUser;

    const ConsumerSubmit = () =>{
      setLoading(true)

      if(!destinationFromConsumer.trim()){
        setLoading(false)
        alert('Enter Destination(To)');
        setError(true)
      }
      else if (!destinationToConsumer.trim()){
        setLoading(false)
        alert('Enter Destination(From)');
        setError(true)
      }
      else{
        firestore()
        .collection('Consumer')
        .add({
          userId: user.uid,
          name: user.displayName,
          to: destinationToConsumer,
          from: destinationFromConsumer,
          gender: userData[0].gender,
          description: descriptionConsumer,
          info: 'Consumer',
          status: 'Pending',
        })
        .then(()=>{
          setLoading(false)
          console.log('Added');
          navigation.navigate('ConsumerRide');
          setDestinationToConsumer('');
          setDestinationFromConsumer('');
          setIsButtonDisabled(true)

        })
        .catch((error)=>{
          setLoading(false)
          alert(error);
        })

      }
    }
    return(
      <View mt='2' p='5'>
                <View  bgColor='transparent' borderWidth='1' borderColor='#00AFCD' p='3' pb='0' borderRadius='5' style={{
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
                  <Input color='white' variant='unstyled' borderColor='red.600' mt='1' onChange={() => {setError(false) }} borderWidth={error === true ? 1 : 0} mb='2' placeholder='Destination (From)' w='100%' value={destinationFromConsumer} onChangeText={text => setDestinationFromConsumer(text)}/>
                  <Divider/>
                  <Text mt='2' fontSize='12' color='white'>Going to</Text>
                  <Input color='white' variant='unstyled' borderColor='red.600' mt='2' onChange={() => {setError(false) }} borderWidth={error === true ? 1 : 0}  mb='2' placeholder='Destination (To)' w='100%' value={destinationToConsumer} onChangeText={text => setDestinationToConsumer(text)}/>
                </View>
                {/* <View mt='10' borderColor='#4C565F' borderWidth='1' mb='5'>
                  <Picker style={{color: 'white'}} dropdownIconColor='white'
                    selectedValue={genderConsumer}
                    onValueChange={(itemValue, itemIndex) =>
                      setGenderConsumer(itemValue)
                    }>
                    <Picker.Item style={{fontSize: 12}} label="Male" value="Male" />
                    <Picker.Item style={{fontSize: 12}} label="Female" value="Female" />
                  </Picker>
                </View> */}
                {/* <View borderColor='#4C565F' borderWidth='1' mb='5'>
                  <Picker style={{color: 'white'}} dropdownIconColor='white'
                    selectedValue={persons}
                    onValueChange={(itemValue, itemIndex) =>
                      setPersons(itemValue)
                    }>
                    <Picker.Item style={{fontSize: 12}} label="1" value="1" />
                    <Picker.Item style={{fontSize: 12}} label="2" value="2" />
                    <Picker.Item style={{fontSize: 12}} label="3" value="3" />
                    <Picker.Item style={{fontSize: 12}} label="4" value="4" />
                    <Picker.Item style={{fontSize: 12}} label="5" value="5" />
                    <Picker.Item style={{fontSize: 12}} label="6" value="6" />
                    <Picker.Item style={{fontSize: 12}} label="7" value="7" />
                  </Picker>
                </View> */}
                <TextArea color='white' mt='5' mb='5' borderColor='#00AFCD' h={20} placeholder="Description" w="100%" value={descriptionConsumer} onChangeText={text => setDescriptionConsumer(text)} />
                <Center mt='5'>
                    <Button bgColor='#00AFCD' w='200' _pressed={{backgroundColor: '#07b3d1'}} onPress={ConsumerSubmit}><Text color='white'>Post</Text></Button>
                </Center>
            </View>
    )
  }
  return (
    <SafeAreaView>
        <ScrollView h='100%' bgColor='#252525' keyboardShouldPersistTaps='handled'>
        <Center mb='10'>
          <HStack mt='10'>
            <Button onPress={() => {setValue('rider')}} borderRadius='10' w='130' bgColor={value === 'rider' ? '#ffffff' : '#8A8A8A'} mr='2'><Text color={value === 'rider' ? '#000000' : '#ffffff'}>Offer</Text></Button>
            <Button onPress={() => {setValue('consumer')}} borderRadius='10' w='130' bgColor={value === 'consumer' ? '#ffffff' : '#8A8A8A'}><Text color={value === 'consumer' ? '#000000' : '#ffffff'}>Request</Text></Button>
          </HStack>
            {/* <Text mt='5' color='white' fontSize='32'>Get On Board</Text>
            <Text mb='5' color='#939AA8'>Add Post</Text> */}
            {/* <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
            setValue(nextValue);
          }}>
              <HStack w='70%' justifyContent='space-around'>
              <Radio value="rider" my={1}>
                <Text color='white'>Rider</Text>
              </Radio>
              <Radio value="consumer" my={1}>
                <Text color='white'>Consumer</Text>
              </Radio>
              </HStack>
            </Radio.Group> */}

            { value === 'rider' ? <View w='100%'>{riderForm()}</View> : value === 'consumer' ? <View w='100%'>{consumerForm()}</View> : <View></View>}
            
        </Center>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})