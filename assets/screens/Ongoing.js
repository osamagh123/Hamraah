import { BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, HStack, Image, ScrollView, Text, View } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMessage, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import LinearGradient from 'react-native-linear-gradient';



export default function Ongoing() {
    const windowWidth = Dimensions.get('window').width - 40 ;
    const user = firebase.auth().currentUser;
    const [rideData,setRideData] = useState([])
    const [consumerData,setConsumerData] = useState([])
    const [repeater,setRepeater]=useState(0);
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [idkey,setIdkey] = useState([]);
    const [idkey2,setIdkey2] = useState([]);
    const [count, setCount] = useState(1);
    const [rideKey, setRideKey] = useState('');
    const [counter, setCounter] = useState(0);
    const [message,setMessage] =useState([]) ;
    const [messagecounter,setMessageCounter] =useState(0) ;


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
        const ReadRider= async() =>{
            try{
                setLoading(true)
                var ride= [];
                const getPost = await firestore()
                .collection('Ride')
                .where('consumerId', 'array-contains', user.uid)
                .where('status', '==','In Progress')
                .get()
                .then((querySnapshot) =>{
                    querySnapshot.docs.forEach((doc) =>{
                        ride.push({...doc.data(),key: doc.id});
                        setRideKey(doc.id);
                        if(count == 1){
                            PushNotification.localNotification({
                                channelId: 'test',
                                title: 'Starting Soon!',
                                message: 'Wait for your rider to start your ride.',
                                priority: "high",
                                smallIcon: 'ic_stat_name',
                                largeIcon: '',
                              })
                              setCount(2);
                        }
                    });
                    setRideData(ride);
                    setLoading(false);
                    
                    
                })
            }
            catch(error){
                console.log(error);
                setLoading(false)

            }
        }
        const ReadData= async() =>{
            setLoading(true)

            try{
                var consumer= [];
                const getPost = await firestore()
                .collection('Consumer')
                .where('userId', '==', user.uid)
                .where('status', 'in',['In Progress','Pending','Started'])
                .get()
                .then((querySnapshot) =>{
                    querySnapshot.docs.forEach((doc) =>{
                        consumer.push({...doc.data(),key: doc.id});
                    });
                    if(consumer[0].status === 'In Progress'){
                        setConsumerData(consumer);
                        setIdkey(consumer[0].key);
                        setLoading(false);

                    }
                    else if(consumer[0].status === 'Started'){
                        setCounter(2);
                        navigation.navigate('MyRide',{RiderKey: rideKey});
                    }
                    else if (consumer[0].status === 'Pending'){
                        PushNotification.localNotification({
                            channelId: 'test',
                            title: 'Rider Alert !',
                            message: 'There is a rider around you. Check it now!',
                            priority: "high",
                            smallIcon: 'ic_stat_name',
                            largeIcon: '',
                          })
                        setCounter(2);
                        navigation.navigate('ConsumerRide')
                    }
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
        if(counter === 0) {
            setTimeout(() => setRepeater(prevState=>prevState+1), 3000);
          }

    },[repeater]);

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
              console.log(user,"uiddd")
  
            for( var i in messageArray){
              if(messageArray[i].Ririderstatus=="unread" && messageArray[i].userId==user.uid){
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

    const ConsumerList = consumerData.map((item,index) => {
        return(
            <View key={index}>
                <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                    <View mt='2' p='4' w={windowWidth}>
                        <HStack>
                            <View mr="2" w="8" h="8" borderRadius="50">
                                <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                            </View>
                            <View w='90%'>
                            <Text mt='1' fontWeight='500' color="white" fontSize="18">{item.name}</Text>
                            </View>
                        </HStack>
                        <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                            <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                            <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        )
    })
    

    const RiderList = rideData.map((item,index) =>{
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


        return(
            <View key={index}>
                    <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                        <View p='5'>
                            <HStack>
                                <View mr="2" w="8" h="8" borderRadius="50">
                                    <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                                </View>
                                <View  w='90%'>
                                <Text color="white" fontWeight='500' fontSize="18">{item.name}</Text>
                                </View>
                            </HStack>
                            <Text ml='10' color="white" fontWeight='600' fontSize="12">{item.rideType}</Text>

                            <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                            <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                            <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                            </View>
                            <Text color='white' fontWeight='500' mt='5'>Chat Now</Text>
                            <View mt='3'>
                                <HStack>
                                <View mr='3'>
                                    <View bgColor='red.600' h='3' w='3' borderRadius='50' position='absolute' left='5' top='1' zIndex='99'><Text fontSize='8' textAlign='center' color='white' fontWeight='600'>{messagecounter}</Text></View>
                                    <Button onPress={() => {navigation.navigate('SingleChat')}} bgColor='white' borderWidth='1' borderColor='black'>
                                        <FontAwesomeIcon size={12} style={{color: '#000000'}} icon={faMessage}/>
                                    </Button>
                                </View>
                                </HStack>
                            </View>
                        </View>
                    </LinearGradient>
            </View>
        )
    })

  return (
    <SafeAreaView>
        <ScrollView h='100%' bgColor='#252525'>
      <View p='5'>
        <Text mt='5' textAlign='center' fontSize='24' color='white'>Starting Soon</Text>
        <View mt='10'>
            {ConsumerList}
        </View>
        <Text mt='10' fontSize='18' textAlign='center' color='white'>Partner Details</Text>
        <View mt='5'  w='100%'>
            {RiderList}
        </View>
      </View>
      
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})