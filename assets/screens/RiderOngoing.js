import { BackHandler, Dimensions, Linking, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Center, HStack, Image, ScrollView, Text, View, Pressable, AlertDialog } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faCross, faMapLocation, faMessage, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import PushNotification from 'react-native-push-notification';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LaunchNavigator from 'react-native-launch-navigator';



export default function RiderOngoing() {
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

  const [alertStatus,setAlertStatus] = useState(false);
  const onClose2 = () => setAlertStatus(false);
  const cancelRef2 = React.useRef(null);
  const windowWidth = Dimensions.get('window').width - 40 ;
  const user = firebase.auth().currentUser;
  const [rideData,setRideData] = useState([])
  const [consumerData,setConsumerData] = useState([])
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [idkey,setIdkey] = useState('');
  const [count,setCount] = useState(1);
  const [message,setMessage] =useState([]) ;
  const [messagecounter,setMessageCounter] =useState(0) ;
  const isFocused = useIsFocused();

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test',
      channelName: 'Test Channel',
    })
  }

  useEffect(()=>{
      const ReadData= async() =>{
          try{
            setLoading(true)

              var consumer= [];
              const getPost = await firestore()
              .collection('Consumer')
              .where('riderId', '==', user.uid)
              .where('status', '==','In Progress')
              .get()
              .then((querySnapshot) =>{
                  querySnapshot.docs.forEach((doc) =>{
                      consumer.push({...doc.data(),key: doc.id});
                      if(count == 1){
                        PushNotification.localNotification({
                          channelId: 'test',
                          title: 'Get Started !',
                          message: 'Get ready and start your ride.',
                          priority: "high",
                          smallIcon: 'ic_stat_name',
                          largeIcon: '',
                        })
                        setCount(2);
                      }
                  });
                  setConsumerData(consumer);
                  setLoading(false);

              })
          }
          catch(error){
              console.log(error);
                setLoading(false)

          }
      }
      const ReadRider= async() =>{
          try{
            setLoading(true)

              var ride= [];
              const getPost = await firestore()
              .collection('Ride')
              .where('userId', '==', user.uid)
              .where('status', '==','In Progress')
              .get()
              .then((querySnapshot) =>{
                  querySnapshot.docs.forEach((doc) =>{
                      ride.push({...doc.data(),key: doc.id});
                  });
                  setRideData(ride);
                  setIdkey(ride[0].key);

                    setLoading(false)

              })
          }
          catch(error){
            console.log(error);
            setLoading(false)

          }
      }
      ReadData();
      ReadRider();
      createChannels();
  },[]);

  useFocusEffect(
    useCallback(() => {
    if (rideData.length > 0) {
      const messagesRef = firebase
        .database()
        .ref('chat')
        .orderByChild('rideKey')
        .equalTo(rideData[0].key);
      messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
     
          const messageArray = Object.entries(data).map(([key, value]) => ({
            ...value,
            key,
          })).sort((a,b) => a.time - b.time);
          setMessage(messageArray);
          // console.log(messageArray[0]['status'])
          console.log(messageArray)
          let msgcount=[];
        for( var i in messageArray){
          if(messageArray[i].Customerstatus=="unread"){
            msgcount.push(1)
          }
        }

        setMessageCounter(msgcount.length)

        } else {
          setMessage([]);
        }
      });
      return () => messagesRef.off();
    }
  }, [rideData])
  )

  const ConsumerList = rideData.map((item,index) => {
    
      return(
          <View key={index}>
              <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View mt='2' p='4' w={windowWidth}>
                    <HStack>
                        <View mr="2" w="8" h="8" borderRadius="50">
                        <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>

                        </View>
                        <View w='90%'>
                          <Text fontWeight='500' color="white" fontSize="18">{item.name}</Text>
                        </View>
                    </HStack>
                    <Text ml='10' color="white" fontWeight='600' fontSize="12">{item.rideType}</Text>

                    <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                    <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                  <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                    </View>
                </View>
              </LinearGradient>
          </View>
      )
  })

  const RiderList = consumerData.map((item,index) =>{
    function launchnav(){
      let app = null;

      if(Platform.OS === "android") LaunchNavigator.setGoogleApiKey('AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8');

        LaunchNavigator.isAppAvailable(LaunchNavigator.APP.GOOGLE_MAPS).then((isGoogleMapsAvailable) => {
            if (isGoogleMapsAvailable) {
                app = LaunchNavigator.APP.GOOGLE_MAPS;

                LaunchNavigator.navigate(item.from, {
                  app: app
              })
                  .then(() => console.log("Launched navigator"))
                  .catch((err) => console.error("Error launching navigator: " + err));
            } else {
                alert("Google Maps not available - Download Google Maps for navigation");
            }

            
        });
    }
    let whatsapp = item.phoneNumber;
    let msg = "Hey there ! Ride Partner."
    let mobile = Platform.OS == "ios" ? whatsapp : "+" + whatsapp;
    const whatsappHandle = () => {
        if(mobile){
            if(msg){
                let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
                Linking.openURL(url)
                .then(data => {
                    console.log('WhatsApp Opened');
                })
                .catch(() => {
                    alert('Make sure Whatsapp is installed on your device');
                })
            }
            else{
                alert('Please insert message');
            }
        }
        else{
            alert('Please insert mobile no.')
        }
    }
    const onAlert = () =>{
      setAlertStatus(true)
    }
    const onCancelled = () => {
      console.log(rideData[0])
      firestore()
      .collection('Consumer')
      .doc(item.key)
      .update({
        status: 'Pending',
      })

      firestore()
      .collection('Ride')
      .doc(rideData[0].key)
      .update({
        status: 'Pending',
      })
      setAlertStatus(false)
      navigation.navigate('Find')
    }

    const onChat = () =>{
      navigation.navigate('RiderSingleChat',{consumerId: item.userId})
    }
      return(
          <View key={index}>
                          <AlertDialog leastDestructiveRef={cancelRef2} isOpen={alertStatus} onClose={onClose2}>
                            <AlertDialog.Content>
                              <AlertDialog.CloseButton />
                              <AlertDialog.Header>Remove from ride ?</AlertDialog.Header>
                              <AlertDialog.Body>
                                <Text>
                                Are you sure you want to remove {item.name} from current ride ?
                                </Text>
                              </AlertDialog.Body>
                              <AlertDialog.Footer>
                                <Button.Group space={2}>
                                  <Button variant="unstyled" colorScheme="coolGray" onPress={onClose2} ref={cancelRef2}>
                                    Cancel
                                  </Button>
                                  <Button colorScheme="danger" onPress={onCancelled}>
                                    Remove
                                  </Button>
                                </Button.Group>
                              </AlertDialog.Footer>
                            </AlertDialog.Content>
                          </AlertDialog>
             <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}> 
                   <View p='5'>
                   <HStack>
                      <View mr="2" w="8" h="8" borderRadius="50">
                        <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                      </View>
                      <View w='83%'>
                        <Text mt='1' fontWeight='500' color="white" fontSize="18">{item.name}</Text>
                      </View>
                      <View>
                        <Pressable onPress={onAlert} bgColor='gray.100' borderRadius='50' p='1' borderWidth='1'>
                          <FontAwesomeIcon size={12} icon={faClose} style={{color: 'black'}}/>
                        </Pressable>
                      </View>
                  </HStack>
                  <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                  <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                  <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                  </View>
                  <Text color='white' fontWeight='500' mt='5'>Chat Now</Text>
                  <View mt='3'>
                      <HStack>
                          <View mr='3'>
                            <View bgColor='red.600' h='3' w='3' borderRadius='50' position='absolute' left='5' top='1' zIndex='99'><Text fontSize='8' textAlign='center' color='white' fontWeight='600'>{messagecounter}</Text></View>
                              <Button onPress={onChat} bgColor='white' borderWidth='1' borderColor='black'>
                                  <FontAwesomeIcon size={12} style={{color: '#000000'}} icon={faMessage}/>
                              </Button>
                          </View>

                          <View>
                              <Button onPress={launchnav} bgColor='white' borderWidth='1' borderColor='black'>
                                  <FontAwesomeIcon size={12} style={{color: '#000000'}} icon={faMapLocation}/>
                              </Button>
                          </View>
                      </HStack>
                  </View>
                   </View>
             </LinearGradient>
          </View>
      )
  })
  const EndRideHandler = () => {
    setLoading(true)

    firestore()
    .collection('Ride')
    .doc(rideData[0].key)
    .update({
      status: 'Started',
    })
    .then(() => {
      console.log('Requested')
      navigation.navigate('RiderMyRide',{RiderKey: rideData[0].key, ConsumerKey: consumerData[0].key});
      setLoading(false)

    })
    .catch((error) => {
      alert(error);
      setLoading(false)

    })

    firestore()
    .collection('Consumer')
    .doc(consumerData[0].key)
    .update({
      status: 'Started',
    })
    .then(() => {
      console.log('Requested')
      setLoading(false)

    })
    .catch((error) => {
      alert(error);
      setLoading(false)

    })
  }
  return (
    <SafeAreaView>
          <ScrollView h='100%' bgColor='#252525'>
        <View p='5'>
          <Text mt='5' textAlign='center' fontSize='24' color='white'>Get Started</Text>
          <View mt='10'>
              {ConsumerList}
          </View>
          <Text mt='10' fontSize='18' textAlign='center' color='white'>Partner Details</Text>
          <View mt='5' w='100%'>
              {RiderList}
          </View>
        </View>
        <Center p='5'>
            {/* <Pressable borderRadius='8' w='100%' h='50' bgColor='#07b3d1' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={EndRideHandler}>
              <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View h='50' justifyContent='center'>
                  <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>End Ride</Text>  
                </View>
              </LinearGradient>
            </Pressable> */}
            <Button borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='transparent' borderWidth='1' borderColor='#00AFCD' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={EndRideHandler}>
                <View h='50' justifyContent='center'>
                  <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Start Ride</Text>  
                </View>
            </Button>
          </Center>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})