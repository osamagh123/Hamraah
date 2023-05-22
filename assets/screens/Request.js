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



export default function Request(props) {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

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
  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');
  const destFrom = props.From;
  const destTo = props.To;

  const [error, setError] = useState(false);


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
  },[])


  if(isLoading){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#252525'}}>
         <ActivityIndicator/>
     </View>
    )
  }



  function consumerForm(){
    const user = firebase.auth().currentUser;

    const ConsumerSubmit = () =>{
      setLoading(true)

      if(!destFrom.trim()){
        setLoading(false)
        setAlert(true)
        setErrormsg('Enter destination (from)');
        setError(true)
      }
      else if (!destTo.trim()){
        setLoading(false)
        setAlert(true)
        setErrormsg('Enter destination (to)');
        setError(true)
      }
      else{
        firestore()
        .collection('Consumer')
        .add({
          userId: user.uid,
          name: user.displayName,
          to: destTo,
          from: destFrom,
          gender: userData[0].gender,
          description: descriptionConsumer,
          info: 'Consumer',
          status: 'Pending',
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
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
      <View mt='2' w='100%'>
                <Center>
                <View w={windowWidth >= 500 ? '80%' : '100%'} bgColor='transparent' borderWidth='1' borderColor='#00AFCD' mx='5' p='3' pb='0' borderRadius='8'>
                  <Text fontSize='14' color='white'>Leaving from</Text>
                  <Pressable mb='2' borderWidth={error === true ? 1 : 0} borderColor='red.600' onPress={() => {navigation.navigate('RequestFrom')}}>
                    <Text ml='1' p='3' color='#FFFFFF' opacity='0.7' fontSize='12'>{destFrom ? destFrom : 'Destination (From)'}</Text>
                  </Pressable>
                  {/* <Input h='60' color='white' variant='unstyled' borderColor='red.600' mt='2' onChange={() => {setError(false) }} borderWidth={error === true ? 1 : 0} mb='2' placeholder='Destination (From)' w='100%' value={destinationFromConsumer} onChangeText={text => setDestinationFromConsumer(text)}/> */}
                  <Divider/>
                  <Text mt='2' fontSize='14' color='white'>Going to</Text>
                  <Pressable mb='2' borderWidth={error === true ? 1 : 0} borderColor='red.600' onPress={() => {navigation.navigate('RequestTo')}}>
                    <Text ml='1' p='3' color='#FFFFFF' opacity='0.7' fontSize='12'>{destTo ? destTo : 'Destination (To)'}</Text>
                  </Pressable>
                  {/* <Input h='60' color='white' variant='unstyled' borderColor='red.600' mt='2' onChange={() => {setError(false) }} borderWidth={error === true ? 1 : 0}  mb='2' placeholder='Destination (To)' w='100%' value={destinationToConsumer} onChangeText={text => setDestinationToConsumer(text)}/> */}
                </View>
                </Center>
                <View w='100%'>
                  <Center>
                    <TextArea w={windowWidth >= 500 ? '80%' : '100%'} color='white' mt='5' mb='5' borderRadius='8' borderColor='#00AFCD' h={40} placeholder="Description" value={descriptionConsumer} onChangeText={text => setDescriptionConsumer(text)} />
                  </Center>
                </View>
                <Center mt='5'>
                    {/* <Pressable borderRadius='8' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' bgColor='#07b3d1' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={ConsumerSubmit}>
                      <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                        <View h='50' justifyContent='center'>
                          <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Post</Text>  
                        </View>
                      </LinearGradient>
                    </Pressable> */}
                    <Button borderRadius='8' w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' bgColor='transparent' borderWidth='1'borderColor='#00AFCD' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={ConsumerSubmit}>
                        <View h='50' justifyContent='center'>
                          <Text justifyContent='center' textAlign='center' color='white' fontSize='16'>Post</Text>  
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
        <View justifyContent='center' h={windowHeight - 100}>
            <Center mb='10'>
                {consumerForm()}
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

const styles = StyleSheet.create({})