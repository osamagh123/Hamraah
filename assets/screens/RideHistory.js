import { BackHandler, Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Badge, Button, Divider, FlatList, HStack, Image, ScrollView, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { useFocusEffect, useIsFocused } from '@react-navigation/core'
import { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'


export default function RideHistory({navigation}) {
  const isFocused = useIsFocused();
    const windowWidth = Dimensions.get('window').width - 40 ;
    const [riderData, setRiderData] = useState([]);
    const [ConsumerData, setConsumerData] = useState([]);
    const user = firebase.auth().currentUser;
    const [history, setHistory] = useState('Offer');

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

      useEffect(() => {
          const ReadRider = async() =>{
              try{
                  var rider = [];
                  const getPost = await firestore()
                  .collection('Ride')
                  .where('userId','==',user.uid)
                  .orderBy('timestamp','desc')
                  .get()
                  .then((querySnapshot) => {
                      querySnapshot.docs.forEach((doc) => {
                        var time = doc.data().timestamp.toDate()
                        var date = new Date(time);
                        var day = date.getDate().toString().padStart(2,'0');
                        var month = (date.getMonth() + 1).toString().padStart(2, '0');
                        var year = date.getFullYear();
                        var formattedDate = `${day}-${month}-${year}`;
                        var hours = date.getUTCHours().toString().padStart(2, '0');
                        var minutes = date.getUTCMinutes().toString().padStart(2, '0');
                        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
                        const formattedTime = date.toLocaleTimeString([], options);
                          rider.push({...doc.data(), key: doc.id, date: formattedDate, time: formattedTime})
                      });
                      setRiderData(rider);
                      console.log(riderData)
                  })
              }
              catch(error){
                  alert(error);
                  
              }
          }
          const ReadConsumer = async() =>{
            try{
                var cons = [];
                const getPost = await firestore()
                .collection('Consumer')
                .where('userId','==',user.uid)
                .orderBy('timestamp','desc')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                      var time = doc.data().timestamp.toDate()
                      var date = new Date(time);
                      var day = date.getDate().toString().padStart(2,'0');
                      var month = (date.getMonth() + 1).toString().padStart(2, '0');
                      var year = date.getFullYear();
                      var formattedDate = `${day}-${month}-${year}`;
                      var hours = date.getUTCHours().toString().padStart(2, '0');
                      var minutes = date.getUTCMinutes().toString().padStart(2, '0');
                      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
                      const formattedTime = date.toLocaleTimeString([], options);
                        cons.push({...doc.data(), key: doc.id, time: formattedTime, date: formattedDate})
                    });
                    setConsumerData(cons);
                })
            }
            catch(error){
                alert(error);
            }
        }



          if(isFocused){
            ReadRider();
            ReadConsumer();
          }
      },[isFocused, navigation])

    const riderList = riderData.map((item,index) => {
        return(
            <View key={index} mb='5'>
              <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                <View mt='2' p='4' w={windowWidth}>
                    <HStack>
                        <View mr="2" w="8" h="8" borderRadius="50">
                            <Image  w="8" h="8" borderRadius="50" source={{uri: user.photoURL}} alt='profile'/>
                        </View>
                        <View w={windowWidth - 80}>
                            <HStack justifyContent='space-between'>
                                <Text fontWeight='500' color="white" fontSize="18">{item.name}</Text>
                                <Badge borderRadius='3' borderWidth='1' p='2' variant='subtle' colorScheme={item.status === 'Finished' ? 'success' : item.status === 'Cancelled' ? 'error' : 'info'}><Text fontSize='10' color={item.status === 'Finished' ? 'success.600' : item.status === 'Cancelled' ? 'error.600' : 'info.600'} fontWeight='600'>{item.status}</Text></Badge>                            
                            </HStack>
                        </View>
                    </HStack>
                    <Text ml='10' color="white" fontWeight='600' fontSize="12">{item.rideType}</Text>

                    <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                    <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                  <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                    </View>
                    <Text mt='3' color="white" fontWeight='600' fontSize="12"><FontAwesomeIcon icon={faCalendar} size={12} style={{color: 'white', marginRight: 10}} /> {item.date}</Text>
                    <Text mt='3' color="white" fontWeight='600' fontSize="12"><FontAwesomeIcon icon={faClock} size={12} style={{color: 'white', marginRight: 10}}/> {item.time}</Text>
                </View>

              </LinearGradient>
          </View>
        )
    })

    const consumerList = ConsumerData.map((item,index) => {
      return(
          <View key={index} mb='5'>
            <LinearGradient style={{opacity: 1, borderRadius: 8,}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
              <View mt='2' p='4' w={windowWidth}>
                  <HStack>
                      <View mr="2" w="8" h="8" borderRadius="50">
                          <Image  w="8" h="8" borderRadius="50" source={{uri: user.photoURL}} alt='profile'/>
                      </View>
                      <View w={windowWidth - 80}>
                          <HStack justifyContent='space-between'>
                              <Text fontWeight='500' color="white" fontSize="18">{item.name}</Text>
                              <Badge borderRadius='3' borderWidth='1' p='2' variant='subtle' colorScheme={item.status === 'Finished' ? 'success' : item.status === 'Cancelled' ? 'error' : 'info'}><Text fontSize='10' color={item.status === 'Finished' ? 'success.600' : item.status === 'Cancelled' ? 'error.600' : 'info.600'} fontWeight='600'>{item.status}</Text></Badge>                            
                          </HStack>
                      </View>
                  </HStack>
                  <Text ml='10' color="white" fontWeight='600' fontSize="12">{item.rideType}</Text>

                  <View pl="2" borderLeftWidth="2" borderLeftStyle="dashed" borderLeftColor="white" mt="5" ml="2">
                  <Text fontWeight='600' color='white' fontSize="12">{item.from}</Text>
                <Text fontWeight='600' color='white' fontSize="12" mt="3">{item.to}</Text>
                  </View>
                  <Text mt='3' color="white" fontWeight='600' fontSize="12"><FontAwesomeIcon icon={faCalendar} size={12} style={{color: 'white'}} /> {item.date}</Text>
                  <Text mt='3' color="white" fontWeight='600' fontSize="12"><FontAwesomeIcon icon={faClock} size={12} style={{color: 'white'}}/> {item.time}</Text>
              </View>
            </LinearGradient>
        </View>
      )
  })

    
  return (
    <SafeAreaView>
        <ScrollView bgColor='#252525' p='5' h='100%'>
      <View mb='20'>
          <Text mb='5' textAlign='center' color='white' fontSize='32'>History</Text>
          <HStack mb='5'justifyContent='center'>
            <View mr='3'>
              <Button onPress={() => {setHistory('Offer')}} _pressed={{bgColor: '#00AFCD'}} bgColor={history === 'Offer' ? '#00AFCD' : 'transparent'} borderWidth='1' borderColor='#00AFCD' w='140'>Offer History</Button>
            </View>
            <View>
              <Button onPress={() => {setHistory('Request')}} _pressed={{bgColor: '#00AFCD'}} bgColor={history === 'Request' ? '#00AFCD' : 'transparent'} borderWidth='1' borderColor='#00AFCD' w='140'>Request History</Button>
            </View>
          </HStack>
          {history === 'Offer' ? riderList : history === 'Request' ? consumerList : ''}
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})