import { BackHandler, Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Button, Center, HStack, Image, ScrollView, Text, View } from 'native-base'
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';



export default function Waiting() {
    const navigation = useNavigation();
    const user = firebase.auth().currentUser;
    const [riderData, setRiderData] = useState([]);
    const [ConsumerData, setConsumerData] = useState([]);
    const windowWidth = Dimensions.get('window').width - 40;
    const [counter, setCounter] = useState(0);
    const [repeater,setRepeater]=useState(0);

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

        const ReadRequest = async() => {
            var consumer = []
            try{
                const getPosts = await firestore()
                .collection('Consumer')
                .where('userId','==',user.uid)
                .where('status','==','Waiting')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                        consumer.push({...doc.data(), key: doc.id})
                    })
                    setConsumerData(consumer);
                })
            }
            catch(error){
                alert(error);
            }
        }
        
        const ReadConsumer = async() =>{
            try{
                const getPosts = await firestore()
                .collection('Consumer')
                .where('userId','==',user.uid)
                .where('status','in',['Started','Pending'])
                .get()
                .then((querySnapshot) =>{
                    querySnapshot.docs.forEach((doc) => {
                      setCounter(1);  
                      if(doc.data().status === 'Started'){
                        navigation.navigate('MyRide');
                      }
                      else if(doc.data().status === 'Pending'){
                        PushNotification.localNotification({
                          channelId: 'test',
                          title: 'Starting Soon!',
                          message: 'Wait for your rider to start your ride.',
                          priority: "high",
                          smallIcon: 'ic_stat_name',
                          largeIcon: '',
                        })
                        navigation.navigate('ConsumerRide');
                      }
                      else{
                        
                      }
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
                .where('consumerId','array-contains',user.uid)
                .where('status','in',['Requested','Pending'])
                .get()
                .then((querySnapshot)=>{
                    querySnapshot.docs.forEach((doc) => {
                        rider.push({...doc.data(), key: doc.id})
                    })
                    setRiderData(rider);
                })
            }
            catch(error){
                alert(error);
            }
        }

        if(counter === 0) {
          setTimeout(() => setRepeater(prevState=>prevState+1), 3000);
        }

        ReadRequest();
        ReadConsumer();
        ReadRider();
        createChannels();
    },[repeater])

    useFocusEffect(
      useCallback(() => {
      if (riderData.length > 0) {
        const messagesRef = firebase
          .database()
          .ref('chat')
          .orderByChild('rideKey')
          .equalTo(riderData[0].key);
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
    }, [riderData])
    )

  

    const RiderList = riderData.map((item,index) =>{
        return(
          <View  mt="3" mb="3" key={index}>
          <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
               <View p='3'>
                 <HStack>
                     <View mr="2" w="8" h="8" borderRadius="50">
                       <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                     </View>
                     <View w='90%'>
                      <Text color='white' fontWeight='500' fontSize="18">{item.name}</Text>
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

    const [cancelDisable, setCancelDisable] =useState(false)

    const onCancel = () => {
        setCancelDisable(true);
        firestore()
        .collection('Consumer')
        .doc(ConsumerData[0].key)
        .update({
          status: 'Cancelled',
        })
        .then(()=>{
          navigation.navigate('Home')
        })
      }

    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);

    const cancelRef = useRef(null);
  return (
    <SafeAreaView>
        <ScrollView p='5' h='100%' bgColor='#252525'>
        <Text color='white' onPress={() => setIsOpen(!isOpen)}>
        Cancel
      </Text>
      <Center>      
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header><Text fontSize='18' textAlign='center'>Cancel Ride</Text></AlertDialog.Header>
          <AlertDialog.Body>
              <Text textAlign='center'>
                Are you sure you want to cancel your Current Ride ?
              </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
              <Button w='100%' mb='2' borderWidth='1' isDisabled={cancelDisable} variant="unstyled" colorScheme="coolGray"  onPress={onCancel}>
                Yes
              </Button>
              <Button w='100%' borderWidth='1' bgColor='danger.600' onPress={onClose} ref={cancelRef}>
                No
              </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
          <Text textAlign='center' color='white' mt='10' fontSize='32'>Your Ride is Starting Soon!</Text>
          <View mt='10' w={windowWidth}>
              <Text  fontSize='18' textAlign='center' color='white'>Partner Details</Text>
              {RiderList}
          </View>

        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})