import { AppState, BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Badge, Button, Center, HStack, Image, ScrollView, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { faPerson } from '@fortawesome/free-solid-svg-icons/faPerson'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import { faCreditCard } from '@fortawesome/free-regular-svg-icons/faCreditCard'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import auth, { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { faCheck, faCross, faStar, faXmark } from '@fortawesome/free-solid-svg-icons'
import PushNotification from 'react-native-push-notification'
import LinearGradient from 'react-native-linear-gradient';

export default function Find() {
  const windowWidth = Dimensions.get('window').width - 40 ;
  const user = firebase.auth().currentUser;
  const [allPosts, setAllPosts] = useState([]);
  const [allConsumer, setAllConsumer] = useState([]);
  const [repeater,setRepeater]=useState(0);
  const navigation= useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [count,setCount] = useState(1);
  const [avgRateData, setAvgRateData] = useState([]);
  const [averageRating,setAverageRating] =useState(0);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  BackgroundTask.define(() => {
    // Do something here
    console.log('Background task is running');
    BackgroundTask.finish();
  });

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

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test',
      channelName: 'Test Channel',
    })
  }


  function onAccept(name){
    setLoading(true)

    firestore()
    .collection('Consumer')
    .doc(name.key)
    .update({
      status: 'In Progress',
    })
    .then(() => {
      console.log('Accepted')
      setLoading(false)

      navigation.navigate('RiderOngoing')
    })
    .catch((error) => {
      alert(error);
      setLoading(false)

    })

    firestore()
    .collection('Ride')
    .doc(allPosts[0].key)
    .update({
      status: 'In Progress',
      consumerId: firebase.firestore.FieldValue.arrayUnion(name.userId),
    })
    .then(() => {
      console.log('Accepted');
      setLoading(false)

    })
    .catch((error) => {
      alert(error);
      setLoading(false)

    })
  }

  function onReject(name){
    setLoading(true)

    firestore()
    .collection('Consumer')
    .doc(name.key)
    .update({
      status: 'Pending',
      riderId: '',
    })
    .then(() => {
      console.log('Rejected')
      setLoading(false)
    })
    .catch((error) => {
      alert(error)
      setLoading(false)

    })

    firestore()
    .collection('Ride')
    .doc(allPosts[0].key)
    .update({
      status: 'Pending',
      consumerId: '',
    })
    .then(() => {
      console.log('Rejected');
      setLoading(false)

    })
    .catch((error) => {
      alert(error)
      setLoading(false)
    })
  }

  useEffect(() => {
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
    const ReadConsumer = async() => {
      try{
        setLoading(true)

        var all =[];


        const getPost = await firestore()
        .collection('Consumer')
        .where('status', '==', 'Requested')
        .where('info','==','Consumer')
        .where('riderId','==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) =>{
            let rateCount = 0;
            let Rate = 0;
            const getRatings = firestore()
            .collection('Consumer')
            .where('userId','==',doc.data().userId)
            .where('rating','in',[1,2,3,4,5])
            .get()
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                Rate += doc.data().rating;
                rateCount++;
              const avgRate=(Rate/rateCount);
              setAvgRateData({...avgRateData, [doc.data().userId]: avgRate});
              })
            })
            

            all.push({...doc.data(), key: doc.id, avgRating: avgRateData[doc.data().userId]});

            if(count == 1){
              PushNotification.localNotification({
                channelId: 'test',
                title: 'Rider Alert !',
                message: 'There is a rider around you. Check it now!',
                priority: "high",
                smallIcon: 'ic_stat_name',
                largeIcon: '',
              })
              setCount(2);
            }
          });

          setAllConsumer(all);
          
          setTimeout(() => {
            setLoading(false);
          }, 1000);

        });
      }
      catch(error){
        setLoading(false)

        console.log(error)
      }
    }
    function handleAppStateChange(nextAppState){
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        ReadData()
        ReadConsumer()
        createChannels()
      }
      else{
        ReadData()
        ReadConsumer()
        createChannels()
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      }

      
    };
    handleAppStateChange()
    setTimeout(() => setRepeater(prevState=>prevState+1), 5000);

  }, [repeater])

  const [rateItem,setRateItem] = useState(0);

    
    const listRiders = allPosts.map((item,index) => {

      const getRating = async () => {
        let rateCons = 0;
        let countRides = 0;
        const getPost = await firestore()
        .collection('Ride')
        .where("userId", '==', item.userId)
        .where('rating','in', [1,2,3,4,5])
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            rateCons += doc.data().rating;
            countRides++;

          })

          if(rateCons == 0 && countRides == 0){
            setRateItem (0);
          }
          else{
            setRateItem(rateCons/countRides)
          }
          
        })
      }
      getRating();
        return(
            <View key={index} >
              <LinearGradient style={{opacity: 1, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
              <View mt="2"p="4" w={windowWidth}>
                <HStack justifyContent="space-between">
                    <HStack>
                      <View mr="2" w="8" h="8" borderRadius="50">
                        <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                      </View>
                      <View>
                      <Text fontSize="18" fontWeight='500' color='white'>{item.name} {rateItem === 0 ? (<View bgColor='#31373E' p='1'><Text fontSize='8' color='white'>Not Rated Yet</Text></View>): rateItem == undefined ? '' : rateItem == NaN ? '': (<View bgColor='#31373E' p='1' maxWidth='38'><Text fontSize='12' color='white'><FontAwesomeIcon icon={faStar} size={10} style={{color: '#FFBC00'}}/>{rateItem.toFixed(1)}</Text></View>)}</Text>
                      </View>
                    </HStack>
                    <View>

                      <Badge size='xs' colorScheme={item.status == 'Pending' ? 'info' : item.status == 'Requested' ? 'warning' : ''} variant='subtle'><Text fontSize='8'>{item.status}</Text></Badge>
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

     const listConsumers = allConsumer.map((item,index) => {
      return(
            <View key={index} mb='3'>
             <LinearGradient style={{opacity: 1, borderTopLeftRadius: 8,borderTopRightRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
             <View mt="4"p="4" w={windowWidth}>
                <HStack justifyContent="space-between">
                    <HStack>
                      <View mr="2" w="8" h="8" borderRadius="50">
                        <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                      </View>
                      <View>
                        <Text color="#31373E" color='white' fontWeight='500' fontSize="18">{item.name}  {item.avgRating === undefined ? (<View bgColor='#31373E' p='1'><Text fontSize='8'color='white'>Not Rated Yet</Text></View>): item.avgRating === '0' ? (<View bgColor='#31373E' p='1'><Text fontSize='8'color='white'>Not Rated Yet</Text></View>)  : (<View bgColor='#31373E' p='1' maxWidth='38'><Text fontSize='12' color='white'><FontAwesomeIcon icon={faStar} size={10} style={{color: '#FFBC00'}}/>{item.avgRating.toFixed(1)}</Text></View>)}</Text>
                      </View>
                    </HStack>
                    <View>
                    <Badge size='xs' colorScheme={item.status == 'Pending' ? 'info' : item.status == 'Requested' ? 'warning' : ''} variant='subtle'><Text fontSize='8'>{item.status}</Text></Badge>
                    </View>
                </HStack>
                <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                  <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                  <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                </View>
                {item.description.length >= 1 ? (<View>
                  <Text mt='3' fontSize='12' color='white'>Description:</Text>
                <Text fontSize='12' color='white'>{item.description}</Text>
                </View>) : ''}
                
              </View>
              <HStack>
                <Button borderTopWidth='1' borderRightWidth='1' borderColor='#252525' h='10' w='50%' bgColor='white' borderRadius='0' onPress={() => {onReject(item)}}>
                  <Text mt='1' color='white' textAlign='center'><FontAwesomeIcon size={20} style={{color: '#dc2626'}} icon={faXmark} /></Text>
                </Button>
                <Button borderTopWidth='1' borderColor='#252525' h='10' w='50%' bgColor='white' borderRadius='0' onPress={() => {onAccept(item)}}>
                  <Text mt='1' color='white' textAlign='center'><FontAwesomeIcon size={20} style={{color: '#16a34a'}} icon={faCheck} /></Text>
                </Button>
              </HStack>
             </LinearGradient>
              
            
            </View>
      )
     })

     const [cancelDisable,setCancelDisable] =useState(false);

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
        <ScrollView h='100%' p='5' bgColor='#252525' keyboardShouldPersistTaps={'handled'}>
        <Text color='white' onPress={() => setIsOpen(!isOpen)}>
        Cancel Ride
        </Text>
        <Center>      
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
              <Button w='100%' borderWidth='1' bgColor='danger.600' mb='2' onPress={onClose} ref={cancelRef}>
                No
              </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
        <Center >
            <Text mt='10' color='white' fontSize='32'>Your Offer</Text>
            <View mt='5'>
                {listRiders}
            </View>
        </Center>
        <Text mt='5' fontSize='24' color='white'>Requests</Text>
        <Text color='#939AA8' mb='2'>People Around You</Text>

        <View mt='5' mb='10'>
                {listConsumers}
        </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'linear-gradient(to bottom, #00AFCD, #35D2ED)', // set the linear gradient as the background
  }
})