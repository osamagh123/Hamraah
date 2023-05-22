import { ActivityIndicator, BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Center, HStack, Image, Pressable, ScrollView, Text, View } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';


export default function RateRide(props) {
    const windowWidth = Dimensions.get('window').width - 40 ;
    const user = firebase.auth().currentUser;
    const [rideData,setRideData] = useState([])
    const [consumerData,setConsumerData] = useState([]);
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const RiderKey = props.RiderKey;
    const [submitted,setSubmitted] = useState(false)

    const [rating, setRating] = useState(0)





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

        const ConsumerData = async() => {
            try{
                var cons = [];
                const getPost = await firestore()
                .collection('Consumer')
                .doc(RiderKey.ConsumerKey)
                .get()
                .then(documentSnapshot => {
                    cons.push({...documentSnapshot.data(),key: documentSnapshot.id});
                })
                setConsumerData(cons)
                PushNotification.localNotification({
                  channelId: 'test',
                  title: 'Ride Finished !',
                  message: 'Thanks for choosing Hamraah.pk',
                  priority: "high",
                  smallIcon: 'ic_stat_name',
                  largeIcon: '',
                })
            }
            catch(error){
                console.log(error);
            }
        }
        // const ReadData= async() =>{
        //     try{
        //         var consumer= [];
        //         const getPost = await firestore()
        //         .collection('Ride')
        //         .doc(RiderKey.RiderKey)
        //         .get()
        //         .then(documentSnapshot =>{
        //             let ids = documentSnapshot.data().consumerId;
        //             ids.forEach((id) => {
        //               firestore()
        //               .collection("Users")
        //               .where('uid','==',id)
        //               .get()
        //               .then((querySnapshot)=>{
        //                 querySnapshot.docs.forEach((doc) => {
        //                   setConsumerData(prevData => [...prevData,{...doc.data(),key: doc.id}])
        //                 })
                        
        //               })
        //               .catch((error) => {
        //                 alert(error);
        //               })
        //             })
                    
        //             setLoading(false);
        //         })
        //     }
        //     catch(error){
        //         console.log(error);
        //         setLoading(false)

        //     }
        // }
        const ReadRider= async() =>{
            try{

                var ride= [];
                const getPost = await firestore()
                .collection('Ride')
                .doc(RiderKey.RiderKey)
                .get()
                .then(documentSnapshot => {
                    setRideData(documentSnapshot.data());
                })
            }
            catch(error){
                console.log(error);
            }
        }
        // ReadData();
        ReadRider();
        ConsumerData();
        createChannels();
    },[]);

    const onEnd = () => {
      console.log(RiderKey.RiderKey);
    }

    
    const ConsumerList = consumerData.map((item,index) => {
            const onEnd = () => {
                setSubmitted(true);
                firestore()
                .collection("Consumer")
                .doc(item.key)
                .update({
                  rating: rating,
                })
                .catch((error) => {
                  alert(error);
                })
              }
        return(
            <View mt='3' mb='3'  key={index}>
              <LinearGradient style={{opacity: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8}} start={{x: 0, y: 0}} end={{x: 1.5, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View p='3'>
                  <Text color='white' fontSize='18' textAlign="center">Customer Name: {item.name}</Text>
                </View>

              </LinearGradient>
                <View bgColor='#07b3d1' borderBottomLeftRadius='8' borderBottomRightRadius='8' borderTopWidth='2' p='3'>
                    <Text textAlign='center' color='white' fontSize='24' mb='4'>Rate your Co-Rider</Text>
                    <Rating key={`${item.key}-${index}`}
                        type='custom'
                        startingValue={rating}
                        ratingColor={rating === 1 ? '#FF0D0D' : rating === 2 ? '#FF4E11' : rating === 3 ? '#FF8E15' : rating === 4 ? '#ACB334' : rating === 5 ? 'green' : ''}
                        ratingBackgroundColor='#c8c7c8'
                        onFinishRating={(rating) => setRating(rating)}
                        tintColor='#07b3d1'
                        imageSize={24}
                        readonly={submitted}/>
                    <Text color='white' mt='1' textAlign='center'>{rating}/5</Text>
                    <Center mt='5'>
                        {submitted ? (<Button w='200' isDisabled onPress={onEnd}>Submit Rating</Button>) :
                            (<Button w='200' onPress={onEnd}>Submit Rating</Button>)
                        }
                    </Center>
                </View>
            </View>
        )
    })

    // const ConsumerList = consumerData.map((item,index) => {

    //   const onEnd = () => {
    //     setSubmitted(true);
    //     firestore()
    //     .collection("Consumer")
    //     .doc(item.key)
    //     .update({
    //       rating: rating,
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     })
    //   }
    //   return(
    //     <View  bgColor='white' mt='3' mb='3' p='3' key={index}>
    //       <Text textAlign="center">Customer Name: {item.name}</Text>
    //       <View>
    //         <Text textAlign='center' fontSize='24'>Rate your Consumer</Text>
    //        <Rating key={`${item.key}-${index}`}
    //       type='custom'
    //       startingValue={rating}
    //       ratingBackgroundColor='#c8c7c8'
    //       onFinishRating={(rating) => setRating(rating)}
    //       tintColor='#FFFFFF'
    //       imageSize={16}
    //       readonly={submitted}
    //       />
    //       <Text mt='1' textAlign='center'>{rating}/5</Text>
    //       <Center mt='5'>
    //         {submitted ? (<Button w='200' isDisabled onPress={onEnd}>Submit Rating</Button>) :
    //         (<Button w='200' onPress={onEnd}>Submit Rating</Button>)
    //     }
    //       </Center>
    //       </View>
    //     </View>
    //   )
    // })

    if(isLoading){
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#252525'}}>
          <ActivityIndicator/>
        </View>
      )
    }

    else{
      return (
        <SafeAreaView>
          <ScrollView h='100%' bgColor='#252525'>
        <View p='5'>
          <Text mt='5' mb='3' textAlign='center' fontSize='24' color='white'>Summary</Text>
          <LinearGradient style={{opacity: 1, borderRadius: 8}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
            <View p='3' w='100%'>
                    <View>
                            <View>
                              <Text color='white'>Rider Name: {rideData.name}</Text>
                              <Text color='white'>Ride Type: {rideData.rideType}</Text>
                              <Text color='white'>From: {rideData.from}</Text>
                              <Text color='white'>To: {rideData.to}</Text>
                            </View>
                    </View>
            </View>
          </LinearGradient>
          <Text mt='5' textAlign='center' fontSize='24' color='white'>Partner Details</Text>
          <View  mt='5' w='100%'>
            {ConsumerList}
          </View>
          
        </View>
        <Center px='5' mb='20'>
        <Button borderRadius='8' borderWidth='1' borderColor='#00AFCD' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='transparent' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={() => {navigation.navigate('Home')}}>
            <View h='50' justifyContent='center'>
              <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Return To Home</Text>  
            </View>
        </Button>

          </Center>
      </ScrollView>
        </SafeAreaView>
      )
    }
  

    
}

const styles = StyleSheet.create({})