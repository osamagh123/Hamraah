import { ActivityIndicator, BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Badge, Button, Center, HStack, Image, ScrollView, Text, View } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import Geocoder from 'react-native-geocoding';
import {getDistance, getPreciseDistance} from 'geolib';

export default function ScheduledConsumer() {
  const windowWidth = Dimensions.get('window').width - 40 ;
  const user = firebase.auth().currentUser;
  const [allPosts, setAllPosts] = useState([]);
  const [allConsumer, setAllConsumer] = useState('');
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [repeater,setRepeater]=useState(0);
  const [Notcount, setNotCount] = useState(1);
  const [avgRateData, setAvgRateData] = useState([]);
  const [Loader,setLoader] = useState(true);
  const [Consumerlatlng,setConsumerlatlng] = useState('');
  const [Riderlatlng,setriderlatlng] = useState('');


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

  function onPressHander(name){
    setLoading(true)

    firestore()
    .collection('Ride')
    .doc(name.key)
    .update({
      status: 'Requested',
    })
    .then(() => {
      console.log('Requested')
      setLoading(false)

    })
    .catch((error) => {
      alert(error);
      setLoading(false)
      
    })

    firestore()
    .collection('Consumer')
    .doc(allConsumer[0].key)
    .update({
      riderId: name.userId,
      status: 'Requested',
    })
    .then(() => {
      console.log('Requested')
      navigation.navigate('ConsumerRideStarted',{rideKey: name.key})
    })
    .catch((error) => {
      alert(error);
    })

  }

  useEffect(() => {
    

   
    const ReadData = async() =>{
      try{
        setLoading(true)
        var averageRates = [];

        var all =[];
        let count= 0;

        const getPost = await firestore()
        .collection('Ride')
        .where('status', 'in', ['Pending','Requested'])
        .where('info','==','Rider')
        .where('date','!=',0)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) =>{
            let rateCount = 0;
            let Rate = 0;
            const getRatings =  firestore()
            .collection('Ride')
            .where('userId','==',doc.data().userId)
            .where('rating','in',[1,2,3,4,5])
            .get()
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                Rate += doc.data().rating;
                rateCount++;
              })

              if(rateCount > 0){
                var avgRate = (Rate/rateCount)
              averageRates.push({avgRate})
            setAvgRateData(averageRates);
              }
              

            })
            if(avgRateData[count]){
              all.push({...doc.data(), key: doc.id, avgRating: avgRateData[count].avgRate});
              count++;
            }
            else{
              all.push({...doc.data(), key: doc.id, avgRating: 0});

            }
            

            
          });

          if(all[0] === undefined){
            setLoader(true)
          }
          else {
            // setLoader(false)
          }

          setAllPosts(all);
          
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
      const ReadConsumer = async() => {
        try{
          setLoading(true)

          var cust = [];
  
          const getCust = await firestore()
          .collection('Consumer')
          .where('userId', '==', user.uid)
          .where('status', '==', 'Pending')
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
              cust.push({...doc.data(), key: doc.id});
            });
            setAllConsumer(cust);
            setLoading(false)

          })
        }
        catch(error){
          console.log(error)
          setLoading(false)
        }
      }
    ReadData()
    ReadConsumer()
    createChannels()
    setTimeout(() => setRepeater(prevState=>prevState+1), 5000);

  }, [repeater])

  

 

  const calculateDistance = (lat1,lng1,lat2,lng2) => {
    var dis = getDistance(
      {latitude: parseFloat(lat1), longitude: parseFloat(lng1)},
      {latitude: parseFloat(lat2), longitude: parseFloat(lng2)},
    );

    return dis / 1000
   
  //  let distance=dis / 1000;

    // alert(
    //   `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
    // );
  };


  function  getlatlongfromaddress(address,type){
    Geocoder.init("AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8");
    var latlong
    Geocoder.from(address)
    .then(json => {
    //  console.log(json.results[0].geometry.location,"location here")
 

             latlong={lat:json.results[0].geometry.location.lat,lng:json.results[0].geometry.location.lng}
    //  setAddress(json.results[0].formatted_address);
    //  ref.current?.setAddressText(json.results[0].formatted_address);
    if(type=="consumer"){
     
   console.log("inprocesss")
        setConsumerlatlng(latlong);
      
     
    }
    if(type=="rider"){
   
      setriderlatlng(latlong)
      
    }
   
   
  
    })
  
  
 
  }

  const [rateItem,setRateItem] = useState(0);
  
  


  if(allConsumer[0] && !Consumerlatlng.lat){
    getlatlongfromaddress(allConsumer[0].from,"consumer")
  }
    
    const listRiders = allPosts.map((item,index) => {
      
     
      if(allConsumer[0] && item){
        // console.log(allConsumer[0].from,"consumer data")
        // console.log(item.from);
       
        
        // getlatlongfromaddress(item.from,"rider")
        // console.log(Consumerlatlng.lat,"consumer latlng")
        // console.log(Riderlatlng.lat,"rider latlng")
   let distance= calculateDistance(Consumerlatlng.lat,Consumerlatlng.lng,item.lat,item.lng)
  //  console.log(distance + " distance")
      
    //  console.log(item)
 if(distance<=2){
        if(Notcount == 1){
          setLoader(false)
          PushNotification.localNotification({
            channelId: 'test',
            title: 'Rider Alert !',
            message: 'There is a rider around you. Check it now!',
            priority: "high",
            smallIcon: 'ic_stat_name',
            largeIcon: '',
          })
          setNotCount(2);
        }

        return(
            <View mb='5' key={index}>
              <LinearGradient style={{opacity: 1, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View mt="2"p="4" px='2' bgColor="transparent" w={windowWidth}>
                  <HStack justifyContent="space-between">
                      <HStack>
                        <View mr="2" w="8" h="8" borderRadius="50">
                          <Image  w="8" h="8" borderRadius="50" source={{uri: item.photoURL}} alt='profile'/>
                        </View>
                        <View>
                            <Text fontSize="18" fontWeight='500' color='white'>{item.name}  {item.avgRating === undefined ? (<View bgColor='#31373E' p='1'><Text fontSize='8'color='white'>Not Rated Yet</Text></View>): item.avgRating === 0 ? (<View bgColor='#31373E' p='1'><Text fontSize='8'color='white'>Not Rated Yet</Text></View>)  : (<View bgColor='#31373E' p='1' maxWidth='38'><Text fontSize='12' color='white'><FontAwesomeIcon icon={faStar} size={10} style={{color: '#FFBC00'}}/>{item.avgRating.toFixed(1)}</Text></View>)}</Text>
                        </View>
                      </HStack>
                      <View>
                      <Button  h='10' mr='1' bgColor='white' borderColor='#000000' borderWidth='1' onPress={()=>{onPressHander(item)}}><Text color='#00AFCD' fontSize='12'>Request</Text></Button>

                      </View>
                  </HStack>
                  <Text ml='10' color="white" fontWeight='600' fontSize="12">{item.rideType}</Text>

                  <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                    <Text  fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                    <Text  fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                  </View>
                  {item.description.length >= 1 ? (<View>
                  <Text mt='3' fontSize='12' color='white'>Description:</Text>
                <Text fontSize='12' color='white'>{item.description}</Text>
                </View>) : ''}
                
                {item.date != 0 ? (<View>
                  <Text ml='3' mt='3' color='white'>
                  Scheduled at: 
                </Text><HStack ml='3'> 
                <View justifyContent='center'>
                  <FontAwesomeIcon  size={12} style={{color: 'white'}} icon={faClock}/>
                </View>
                  <Text ml='2' color='white'>
                  {item.date} {item.time}
                  </Text>
                </HStack>
                </View>) : ''}
                </View>
              </LinearGradient>
              
            
            </View>
        )
      }
      
     
    

      }
    
     })
     const onCancel = () => {
      setCancelDisable(true);
      firestore()
      .collection('Consumer')
      .doc(allConsumer[0].key)
      .update({
        status: 'Cancelled',
      })
      .then(()=>{
        navigation.navigate('Home')
      })
    }
    const [cancelDisable, setCancelDisable] =useState(false)


    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);

    const cancelRef = useRef(null);
  return (
    <SafeAreaView>
        <ScrollView p='5' h='100%' bgColor='#252525'>
        <Text color='white' onPress={()=>{navigation.goBack()}}>
          Back
        </Text>
        <Center>
            <Text mt='10' color='white' fontSize='32'>Find Scheduled Rides</Text>
            <Text color='#939AA8'>People Around You</Text>
            
            <View mt='5' mb='10'>
            {listRiders}
            {Loader === true ? <View mt='20'><ActivityIndicator/></View>: ''}
            </View>
        </Center>
    </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})