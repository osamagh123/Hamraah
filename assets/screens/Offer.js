import { ActivityIndicator, BackHandler, SafeAreaView, StyleSheet,Platform, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Alert, Box, Button, Center, Divider, HStack, Image, Input, Modal, Pressable, Radio, ScrollView, Text, TextArea, View, VStack } from 'native-base'
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
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default function Offer(props) {
  const GOOGLE_PLACES_API_KEY = 'AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8';
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
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const destFrom = props.From;
  const destTo = props.To;
  const [Riderlatlng,setriderlatlng] = useState('');
  
  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');

  navigator.geolocation = require('@react-native-community/geolocation')

  const [error, setError] = useState(false);
  Geocoder.init("AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8");


  function getcurrentlocation(lat,long){
    Geocoder.init("AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8");
    Geocoder.from(lat, long)
    .then(json => {
            var addressComponent = json.results[0].address_components[0];
      // console.log(json.results[0].formatted_address);
      setDestinationFrom(json.results[0].formatted_address);
    })
    .catch(error => console.warn(error));
  }
  const getUserCurrentLocation = () => {
    let latitude, longitude
    Geolocation.getCurrentPosition(
        info => {
            const { coords } = info
console.log(info)
            latitude = coords.latitude
            longitude = coords.longitude
            // setLat(latitude)
            // setLng(longitude)
            getcurrentlocation(latitude, longitude)
        },
        error => console.log(error),
        {
            enableHighAccuracy: false,
            timeout: 2000,
            maximumAge: 3600000
        }
    )
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
    setError(false)
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
        .where('status', 'in', ['Pending','Requested','In Progress','Started'])
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
                  navigation.navigate('RiderOngoing');
                }
                else if (rider[0].rideType === 'Car'){
                  navigation.navigate('CarOngoing');
                }
              }
              else if(rider[0].status === 'Started'){
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
        .where('status', 'in', ['Pending','Requested','In Progress','Waiting','Started'])
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
                navigation.navigate('Ongoing');
              }
              else if(consumer[0].status === 'Waiting'){
                navigation.navigate('RideStarted');
              }
              else if(consumer[0].status === 'Started'){
                navigation.navigate('MyRide')
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
    getUserCurrentLocation()

  },[])


  if(isLoading){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#252525'}}>
         <ActivityIndicator/>
     </View>
    )
  }


  function  getlatlongfromaddress(address){
    // Geocoder.init("AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8");
   
  
  
 
  }
 
  function riderForm(){

 
    const RiderSubmit = () =>{
      setLoading(true)

      // getlatlongfromaddress(destFrom);
      // console.log(Riderlatlng,"latlong")

      
     
        
      
     
     
    
      



  if(!destFrom.trim()){
    setAlert(true)
    setErrormsg('Enter destination (from)');
    setError(true)
    setLoading(false)

  }
  else if (!destTo.trim()){
    setAlert(true)
    setErrormsg('Enter destination (to)');
    setError(true)
    setLoading(false)

  }



  else{

    var latlong
    Geocoder.from(destFrom)
    .then(json => {
      console.log(destFrom)
     console.log(json)
     latlong={lat:json.results[0].geometry.location.lat,lng:json.results[0].geometry.location.lng}
     const user = firebase.auth().currentUser;
     firestore()
     .collection('Ride')
     .add({
       userId: user.uid,
       name: user.displayName,
       phoneNumber: userData[0].phone,
       to: destTo,
       from: destFrom,
       rideType: rideType,
       persons: seats,
       gender: userData[0].gender,
       description: description,
       info: 'Rider',
       status: 'Pending',
       lat:latlong.lat,
       lng:latlong.lng,
       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
       photoURL: user.photoURL,
       date: 0,
       time: 0,
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
      <View w='100%' mt='2'>
                <Center>
                <View w={windowWidth >= 500 ? '80%' : '100%'} bgColor='transparent' borderWidth='1' borderColor='#00AFCD' mx='5' p='3' pb='0' borderRadius='8'>
                  <Text fontSize='14' mt='3' color='white'>Leaving from</Text>
                  <Pressable mb='5' borderWidth={error === true ? 1 : 0} borderColor='red.600' onPress={() => {navigation.navigate('From')}}>
                    <Text ml='1' p='3' color='#FFFFFF' opacity='0.7' fontSize='12'>{destFrom ? destFrom : 'Destination (From)'}</Text>
                  </Pressable>
                 
                  {/* <Input h='60' mt='2' onChange={() => {setError(false) }} color='white' mb='2' variant='unstyled' borderColor='red.600' borderWidth={error === true ? 1 : 0} placeholder='Destination (From)' w='100%' value={destinationFrom} onChangeText={text => setDestinationFrom(text)}/> */}
                  <Divider/>
                  <Text mt='5' fontSize='14' color='white'>Going to</Text>
                  <Pressable mb='5' borderWidth={error === true ? 1 : 0} borderColor='red.600' onPress={() => {navigation.navigate('To')}}>
                    <Text ml='1' p='3' color='#FFFFFF' opacity='0.7' fontSize='12'>{destTo ? destTo : 'Destination (To)'}</Text>
                  </Pressable>

                  {/* <Input h='60' mt='2' onChange={() => {setError(false) }} color='white' mb='2' variant='unstyled' borderColor='red.600' borderWidth={error === true ? 1 : 0} placeholder='Destination (To)' w='100%' value={destinationTo} onChangeText={text => setDestinationTo(text)}/> */}
                </View>
                </Center>
                <Text color='white' mt='5' textAlign='center' mb='5'>Ride Type</Text>
                <HStack mb='5' justifyContent='space-around'>
                  <TouchableOpacity py='10' onPress={handleMotorcycle}>
                    {rideType === 'Motorcycle' ? (
                      <Motorcycle/>
                    ) : (
                      <Image resizeMode='contain' w={windowWidth >= 500 ? '300' : '160' }  h={windowWidth >= 500 ? '260' : '150' }  source={require('../images/bike-1.png')} alt='Motorcycle'/>
                    )}
                      <Text mt='3' color='white' fontSize='12' fontWeight='600' textAlign='center'>Two Wheeler Ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity py='10' onPress={handleCar}>
                    {rideType === 'Car' ? (
                      <Image resizeMode='contain' w={windowWidth >= 500 ? '300' : '160' }  h={windowWidth >= 500 ? '260' : '150' }  source={require('../images/cars-1.png')} alt='Car'/>
                    ) : (
                      <Car/>
                    )}
                    <Text mt='3' color='white' fontSize='12' fontWeight='600' textAlign='center'>Four Wheeler Ride</Text>
                  </TouchableOpacity>
                </HStack>
                
                <Center>
                <HStack w={windowWidth >= 500 ? '80%': '90%'} mt={windowWidth >= 500 ? '50' : '5'}>
                  <TextArea color='white' mb='5' borderColor='#00AFCD' h={windowWidth >= 500 ? 150 : 20} placeholder="Description" w="60%" value={description} onChangeText={text => setDescription(text)} />
                  {rideType === 'Motorcycle' ? (<View ml='3' borderRadius='7' justifyContent='center' alignItems='center' w='37%' h={windowWidth >= 500 ? 150 : 20} bgColor='transparent' borderWidth='1' borderColor='#00AFCD'>
                  <Text fontSize={windowWidth >= 500 ? 24 : 14} color='white'>No. of Seats</Text>
                    <Text mt='1' fontSize={windowWidth >= 500 ? 24 : 14} color='white'>{seats}</Text>
                  </View>): rideType === 'Car' ? (
                  <Pressable onPress={() => setShowModal(true)} ml='3' borderRadius='7' justifyContent='center' alignItems='center' w='37%' h={windowWidth >= 500 ? 150 : 20} bgColor='transparent' borderWidth='1' borderColor='#00AFCD'>
                    <Text fontSize={windowWidth >= 500 ? 24 : 14} color='white'>No. of Seats</Text>
                    <HStack mt='1'>
                      <View w={windowWidth >= 500 ? 8 : 6} h={windowWidth >= 500 ? 8 : 6} mr='2' borderRadius='100' borderColor='white' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text color='white' fontSize={windowWidth >= 500 ? 20 : 14}>-</Text>
                        </View>
                      <Text color='white' fontSize={windowWidth >= 500 ? 20 : 14}>{seats}</Text>
                        <View w={windowWidth >= 500 ? 8 : 6} h={windowWidth >= 500 ? 8 : 6} ml='2' borderRadius='100' borderColor='white' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text color='white' fontSize={windowWidth >= 500 ? 20 : 14}>+</Text>
                        </View>
                    </HStack>
                  </Pressable>) : ''}
                  <Modal backdropVisible _backdropFade={{opacity:0.3}} _backdrop={{
        bg: "#00AFCD", opacity: 0.8, blurRadius: 1,
                  }}  isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Body>
                <View mt='8' borderRadius='7' justifyContent='center' alignItems='center' w='100%' h={windowWidth >= 500 ? 150 : 260} bgColor='transparent' borderWidth='1' borderColor='#00AFCD'>
                    <Text fontSize={windowWidth >= 500 ? 24 : 34} >No. of Seats</Text>
                    <HStack mt='5'>
                      <TouchableOpacity onPress={() => {
                        if (seats > 1) {
                          setSeats(seats - 1);
                        }
                        console.log(seats)
                      }}>
                      <View w={windowWidth >= 500 ? 8 : 16} h={windowWidth >= 500 ? 8 : 16} mr='5' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize={windowWidth >= 500 ? 20 : 28}>-</Text>
                        </View>
                      </TouchableOpacity>
                      <Text  fontSize={windowWidth >= 500 ? 20 : 40}>{seats}</Text>
                      <TouchableOpacity onPress={() => {
                        if(seats < 4){
                          setSeats(seats + 1);
                        }
                        console.log(seats)

                      }}>
                        <View w={windowWidth >= 500 ? 8 : 16} h={windowWidth >= 500 ? 8 : 16} ml='5' borderRadius='100' borderWidth='1' justifyContent="center" alignItems="center">
                        <Text fontSize={windowWidth >= 500 ? 20 : 28}>+</Text>
                        </View>
                      </TouchableOpacity>
                    </HStack>
                  </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
                </HStack>
                </Center>
                
                <Center mt='5'>
                {/* <Pressable borderRadius='8' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' bgColor='#07b3d1' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={RiderSubmit}>
                  <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Post</Text>  
                    </View>
                  </LinearGradient>
                </Pressable> */}

                <Button borderRadius='8' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' bgColor='transparent' borderWidth='1' borderColor='#00AFCD' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={RiderSubmit}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' >Post</Text>  
                    </View>
                </Button>
                </Center>
      </View>
    )
  }
  return (
    <SafeAreaView>
        <ScrollView h='100%' bgColor="#252525" keyboardShouldPersistTaps='handled' p='5'>
            <Text onPress={() => {navigation.navigate('First')}} color='white'>Back</Text>
        <View justifyContent='center'>
          <Center mt='3' mb='10'>
            {riderForm()}
          </Center>
        </View>
        <Modal isOpen={alertBox}>
        <Alert w="80%" status='error' bgColor='white' p='5'>
          <VStack space={1} flexShrink={1} w="100%">
            <Center>
             <Alert.Icon size='xl'/>
            </Center>
              <Text textAlign='center' fontSize="24" fontWeight="medium" _dark={{
                color: "coolGray.800"
              }}>Error
                </Text>
            <Box p="3" _dark={{
            _text: {
              color: "coolGray.600"
            }
          }}>
            <Text textAlign='center'>
            {errormsg}
            </Text>
            </Box>
            <Center>
            <Button bgColor='#00AFCD' w='200' onPress={()=> setAlert(false)}>Ok</Button>

            </Center>
          </VStack>
        </Alert>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({});