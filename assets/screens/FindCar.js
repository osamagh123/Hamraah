import { Alert, BackHandler, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Button, Center, HStack, Image, Pressable, Progress, ScrollView, Text, View } from 'native-base'
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import auth, { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faMapLocation, faMessage, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { set } from 'lodash';
import ProgressBar from 'progress';
import LinearGradient from 'react-native-linear-gradient';
import LaunchNavigator from 'react-native-launch-navigator';


export default function FindCar() {
  const windowWidth = Dimensions.get('window').width - 40 ;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);  
  const [isLoading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const user = firebase.auth().currentUser;
  const [count,setCount] =useState(0);
  const navigation = useNavigation();
  const [disable,setDisable] = useState(true);
  const [repeater,setRepeater]=useState(0);
  const [allConsumer,setAllConsumer] = useState([]);
  const onClose2 = () => setAlertStatus(false);
  const [message,setMessage] =useState([]) ;
  const [messagecounter,setMessageCounter] =useState(0) ;

      const cancelRef2 = React.useRef(null);
 
      console.log(user.uid)

    useEffect(() => {

      const ReadConsumer = async() =>{ 
        var cons = [];
        try{
          await firestore()
          .collection('Consumer')
          .where('riderId','==',user.uid)
          .where('status','==', 'Waiting')
          .get()
          .then((querySnapshot) =>{
            querySnapshot.docs.forEach((doc)=>{
              cons.push({...doc.data(), key: doc.id});
            })
            setAllConsumer(cons);
          })
        }
        catch(error){
          alert(error);
        }
      }
        const ReadData = async() =>{
            try{

              setLoading(true)
              var all =[];
              
              const getPost = await firestore()
              .collection('Ride')
              .where('userId','==', user.uid)
              .where('status', 'in', ['Pending','Requested'] )
              .where('info','==','Rider')
              .get()
              .then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) =>{
                  all.push({...doc.data(), key: doc.id});
                  setCount(all[0].persons)
                all[0].consumerId ? (setDisable(false)) : (setDisable(true));

                 
                });

                setAllPosts(all);
              setLoading(false)
      
              });
            }
            catch(error){
              alert(error)
            setLoading(false)
      
            }
            }
            ReadConsumer();
            ReadData()
            

          setTimeout(() => setRepeater(prevState=>prevState+1), 1000);

    },[repeater])

    useFocusEffect(
      useCallback(() => {
      if (allPosts.length > 0) {
        const messagesRef = firebase
          .database()
          .ref('chat')
          .orderByChild('rideKey')
          .equalTo(allPosts[0].key);
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
    }, [allPosts])
    )

    const [alertStatus,setAlertStatus] = useState(false);

    // console.log(allConsumer)

    const ConsumerList = allConsumer.map((item,index) => {
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
      const onAlert = () =>{
        setAlertStatus(true)
      }
      const onCancelled = () => {
        firestore()
        .collection('Ride')
        .doc(allPosts[0].key)
        .update({
          consumerId: firebase.firestore.FieldValue.arrayRemove(item.userId),
          persons: allPosts[0].persons + 1,
        })

        firestore()
        .collection('Consumer')
        .doc(item.key)
        .update({
          status: 'Pending',
          riderId: '',
        })
        setAlertStatus(false)
        console.log(allConsumer.length)
        if(allConsumer.length <= 1){
          setDisable(true)
        }
      }

     const onChat = () => {
       navigation.navigate('RiderSingleChat',{consumerId: item.userId})
     }
      
      return(
        <View  mt="3" mb="3" key={index}>
                          <AlertDialog leastDestructiveRef={cancelRef2} isOpen={alertStatus} onClose={onClose2}>
                            <AlertDialog.Content>
                              <AlertDialog.CloseButton />
                              <AlertDialog.Header>Remove from ride ?</AlertDialog.Header>
                              <AlertDialog.Body>
                                <Text>Are you sure you want to remove {item.name} from current ride ?
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
                    <View p='3'>
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

    const onPressHandle = () => {
      setLoading(true);
      setDisable(true)
      firestore()
      .collection('Ride')
      .doc(allPosts[0].key)
      .update({
        status: 'Started',
      })
      .then(() => {
      })
      .catch((error) => {
        alert(error);
      })
  
      firebase.firestore()
      .collection('Consumer')
      .where('status','==', 'Waiting')
      .where('riderId','==', allPosts[0].userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          firestore()
          .collection('Consumer')
          .doc(documentSnapshot.id)
          .update({status: 'Started'})
          .then(() =>{
            console.log('Updated')
            navigation.navigate('CarMyRide');
          })
        })
      })
      .catch((error) => {
        alert(error);
      })
    }
  
    const [cancelDisable,setCancelDisable] = useState(false);
    const onCancel = () => {
      setCancelDisable(true);
      firestore()
      .collection('Ride')
      .doc(allPosts[0].key)
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
        <ScrollView h='100%' p='5' bgColor='#252525'>
                <Text color='white' onPress={() => setIsOpen(!isOpen)}>
                Cancel
                </Text>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <Text fontSize='18' textAlign='center'>Cancel Ride</Text>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                        <Text textAlign='center'>
                          Are you sure you want to cancel your Current Ride ?
                        </Text>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button w='100%' mb='2' borderWidth='1' isDisabled={cancelDisable} variant="unstyled" colorScheme="coolGray"  onPress={onCancel}>
                          Yes
                        </Button>
                        <Button w='100%' borderWidth='1'  onPress={onClose} bgColor='danger.600' ref={cancelRef}>
                          No
                        </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog>

                
                <Text textAlign="center" mt='10' color='white' fontSize='32'>Add Co-Riders</Text>
                {ConsumerList}
                
                <View>
                  { Array.from({length:count}, (_,i) => 
                  <Pressable p='5' alignItems='center' borderColor='#00AFCD' borderRadius='8' borderWidth='2' mt='5' key={i} onPress={() => {navigation.navigate('CarRequests')}}>
                          <FontAwesomeIcon size={24} style={{color: 'white'}} icon={faPlusCircle} />
                  </Pressable> ) }
                </View>
                <Center mt='5'>
                <Button isDisabled={disable} _disabled={{opacity: 0.5}} borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' borderWidth='1' borderColor='#00AFCD' bgColor='transparent' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={onPressHandle}>
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