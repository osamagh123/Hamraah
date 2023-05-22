import { BackHandler, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Center, HStack, Image, Pressable, ScrollView, Text, View } from 'native-base'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { AirbnbRating, Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';


export default function Report(props) {
  const windowWidth = Dimensions.get('window').width - 40 ;
  const navigation = useNavigation();
  const [rate,setRate] = useState(0);
  const [rideData, setRideData] = useState([]);
  const [submitted,setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)

  const RiderKey = props.RiderKey;



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

  useEffect(()=>{

    const ReadRider = async() => {
      try{
        var ride = [];
        const getPost = await firestore()
        .collection('Ride')
        .doc(RiderKey.RiderKey)
        .get()
        .then(documentSnapshot => {
          ride.push({...documentSnapshot.data(),key: documentSnapshot.id})
        })
        setRideData(ride);
      }
      catch(error){
        alert(error);
      }
    }

    ReadRider();
    createChannels();

    PushNotification.localNotification({
      channelId: 'test',
      title: 'Ride Finished !',
      message: 'Thanks for choosing Hamraah.pk',
      priority: "high",
      smallIcon: 'ic_stat_name',
      largeIcon: '',
    })
  },[]);

  const RideList = rideData.map((item,index) =>{

    const onEnd = () => {
      if(item.rating){
        const rate = (item.rating + rating)/2;
        setSubmitted(true);
        firestore()
        .collection('Ride')
        .doc(item.key)
        .update({
          rating: rate,
        })
        .catch((error) => {
          alert(error);
        })
      }
      else{
        setSubmitted(true);
        firestore()
        .collection('Ride')
        .doc(item.key)
        .update({
          rating: rating,
        })
        .catch((error) => {
          alert(error);
        })
      }
    }
    return(
      <View key={index}>
          <LinearGradient style={{opacity: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8}} start={{x: 0, y: 0}} end={{x: 1.5, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
          <View p='3'>
          <Text fontSize="18" color='white' textAlign="center">Partner Name: {item.name}</Text>
            <View>
              
              
                
                
            </View>
          </View>
          </LinearGradient>
          <View bgColor='#07b3d1' p='5' borderBottomLeftRadius='8' borderBottomRightRadius='8' borderTopWidth='1'>
              <Text color='white' mb='2' textAlign="center" fontSize="24">
                Rate your Co-Rider
              </Text>
              <Rating key={`${item.key}-${index}`}
                type='custom'
                startingValue={rating}
                ratingBackgroundColor='#c8c7c8'
                ratingColor={rating === 1 ? '#FF0D0D' : rating === 2 ? '#FF4E11' : rating === 3 ? '#FF8E15' : rating === 4 ? '#ACB334' : rating === 5 ? 'green' : ''}
                onFinishRating={(rating) => setRating(rating)}
                tintColor='#07b3d1'
                imageSize={24}
                readonly={submitted}
                />

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


  return (
    <SafeAreaView>
      <ScrollView h='100%' bgColor='#252525'>
            <Center mt='20' p='5'>
                <Text color='white' mb='5' fontSize='20'>Thanks for choosing Hamraah!</Text>
                <Text color='white' mb='5'>Your ride has ended</Text>
                <View mt='5' w='100%'>
                  {RideList}
                </View>
                {/* <Pressable mt='5' borderRadius='8' w='100%' h='50' bgColor='#07b3d1' mb='20' _pressed={{backgroundColor: '#07b3d1'}} onPress={() => {navigation.navigate('Home')}}>
                  <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Return To Home</Text>  
                    </View>
                  </LinearGradient>
                </Pressable> */}
                <Button mt='5' borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='transparent' borderWidth='1' borderColor='#00AFCD' mb='20' _pressed={{backgroundColor: '#00AFCD'}} onPress={() => {navigation.navigate('Home')}}>
                    <View h='50' justifyContent='center'>
                      <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Return To Home</Text>  
                    </View>
                </Button>
            </Center>        
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})