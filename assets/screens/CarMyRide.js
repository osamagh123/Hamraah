import { BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Center, HStack, Image, Pressable, ScrollView, Text, View } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapLocation, faMessage, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import LinearGradient from 'react-native-linear-gradient';
import LaunchNavigator from 'react-native-launch-navigator';


export default function CarMyRide() {
    const [isButtonDisabled,setIsButtonDisabled] = useState(false);
    const [rideData, setRideData] = useState([]);
    const [consumerData, setConsumerData] = useState([]);
    const windowWidth = Dimensions.get('window').width - 40 ;
    const navigation =useNavigation();
    const [consumerIds, setConsumerIds] = useState([]);
    const [submitted, setSubmitted] = useState([])
    const [count,setCount] = useState(1);
    const [message,setMessage] =useState([]) ;
    const [messagecounter,setMessageCounter] =useState(0) ;

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

    const user = firebase.auth().currentUser;

    useEffect(() => {

        const ReadRatings = async() =>{
            let sum = 0;
            let count = 0;
            try{
                const getPosts = await firestore()
            .collection('Ride')
            .where('userId','==', user.uid)
            .where('rating','in',[1,2,3,4,5])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    sum += doc.data().rating;
                    count++;
                })
            })
            }
            catch(error){
                alert(error);
            }
        }
        const ReadRider = async() => {
            var rider = [];

            try{
                const getPosts = await firestore()
            .collection('Ride')
            .where('userId','==', user.uid)
            .where('status','==','Started')
            .get()
            .then((querySnapshot) =>{
                querySnapshot.docs.forEach((doc) =>{
                    rider.push({...doc.data(),key: doc.id});
                });
                setRideData(rider);
            })
            .catch((error)=>{
                console.log(error);
            })
            }
            catch(error){
                alert(error);
            }
        }

        const ReadConsumer = async() => {
            var cust = [];
            
            try{
                const posts = await firestore()
            .collection('Consumer')
            .where('riderId','==', user.uid)
            .where('status','==','Started')
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    setConsumerData(prevData => [...prevData,{...doc.data(),key: doc.id}])
                    setConsumerIds(prevData => [...prevData,{key: doc.id}])
                })
            })
            .catch((error) => {
                console.log(error);
            })
            }
            catch(error){
                alert(error);
            }
        }

        ReadRider();
        ReadConsumer();
        ReadRatings();
    },[])

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
    

    const RiderList = rideData.map((item,index) => {
        return(
            <View key={index}>
            <LinearGradient style={{opacity: 1, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View p='4' w={windowWidth}>
                    <HStack>
                        <View mr="2" w="8" h="8" borderRadius="50">
                            <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                        </View>
                        <View w='90%'>
                            <Text color='white' fontWeight='500' fontSize="18">{item.name}</Text>  
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


    const ConsumerList = consumerData.map((item,index) => {
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

        const onEndSingle = () =>{
            console.log(item.key);
            firestore()
            .collection('Consumer')
            .doc(item.key)
            .update({
                status: 'Finished',
            })
            setSubmitted({...submitted, [index]: true})
        }

        const onChat = () => {
            navigation.navigate('RiderSingleChat',{consumerId: item.userId})
          }
        return (
            <View mt='5' key={index}>
                <LinearGradient style={{opacity: 1, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                    <View p='4' w={windowWidth}>
                        <HStack>
                            <View mr="2" w="8" h="8" borderRadius="50">
                                <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                            </View>
                            <View w='90%'>
                            <Text textTransform='capitalize' color='white' fontWeight='500' fontSize="18">{item.name}</Text>  
                            </View>
                        </HStack>
                        <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                        <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                  <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                        </View>

                        {submitted[index] === true ? (<View>
                            <Text color='white' textAlign='center'>Ride has ended</Text>
                        </View>) : 
                        (<View>
                            <Text color='white' mt='5'>Chat Now</Text>
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
                            <Center mt='5'>
                                <Button onPress={onEndSingle} width='200'>End Ride</Button>
                            </Center>
                        </View>) }
                        
                    </View>
                </LinearGradient>
            </View>
        )
    })

    const EndRideHandler = () => {
        setIsButtonDisabled(true);
        firestore()
        .collection("Consumer")
        .where('riderId','==',user.uid)
        .where('status','==','Started')
        .get()
        .then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) =>{
                firestore()
                .collection("Consumer")
                .doc(doc.id)
                .update({
                    status: 'Finished',
                })
                .then(()=>{
                })
                .catch((error) =>{
                    alert(error);
                })
            });
        })

        firestore()
        .collection("Ride")
        .where('userId','==',user.uid)
        .where('status','==','Started')
        .get()
        .then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                firestore()
                .collection('Ride')
                .doc(doc.id)
                .update({
                    status: 'Finished',
                })
                .then(()=>{
                    navigation.navigate('RiderReport', {RiderKey: doc.id, ConsumerKey: consumerIds});
                })
                .catch((error) => {
                    alert(error);
                })
            })
        })
    }


    
  return (
    <SafeAreaView>
        <ScrollView bgColor='#252525' h='100%' p='5'>
        <Text mt='5' textAlign='center' fontSize='24' color='white'>Ride In Progress</Text>
        <View mt='10'>
            {RiderList}
        </View>
        <Text mt='10' fontSize='18' textAlign='center' color='white'>Partner Details</Text>
        <View mb='20'>
        {ConsumerList}
        <Center mt='5'>
                {/* <Pressable isDisabled={isButtonDisabled} borderRadius='8' w='100%' h='50' bgColor='#07b3d1' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={EndRideHandler}>
                  <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>End Ride</Text>  
                    </View>
                  </LinearGradient>
                </Pressable> */}

                <Button isDisabled={isButtonDisabled} borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='#transparent' borderWidth='1' borderColor='#00AFCD' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={EndRideHandler}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>End Ride</Text>  
                    </View>
                </Button>
        </Center>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})