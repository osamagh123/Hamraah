import { StyleSheet, ActivityIndicator, BackHandler, SafeAreaView} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Button, Center, ScrollView, Text, View } from 'native-base'
import { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';



export default function RideStarted() {
    const user = firebase.auth().currentUser;
    const [repeater,setRepeater]=useState(0);
    const navigation = useNavigation();
    const [ConsumerData,setConsumerData] =useState([]);
    const [timeLeft, setTimeLeft] = useState(15);
    const [counter, setCounter] = useState(0);

        useEffect(()=>{
          const RequestData = async() =>{
            var consumer = [];
            try{
              const getPost = await firestore()
              .collection('Consumer')
              .where('userId','==', user.uid)
              .where('status','==','Requested')
              .get()
              .then((querySnapshot) =>{
                querySnapshot.docs.forEach((doc) =>{
                  consumer.push({...doc.data(), key: doc.id})
                })
                setConsumerData(consumer);
              })
            }
            catch(error){
              alert(error);
            }
          }

          const ReadWaiting = async() =>{
            try{
             const getPost = await firestore()
             .collection('Consumer')
             .where('userId','==',user.uid)
             .where('status','==','Waiting')
             .get()
             .then((querySnapshot) => {
               querySnapshot.docs.forEach((doc) => {
                setCounter(1); 
                navigation.navigate('Waiting');
               })
             })
            }
            catch(error){
              alert(error);
            }
          }
          

            const ReadData= async() =>{
                try{
                    const getPost = await firestore()
                    .collection('Consumer')
                    .where('userId', '==', user.uid)
                    .where('status', '==','In Progress')
                    .get()
                    .then((querySnapshot) =>{
                        querySnapshot.docs.forEach((doc) =>{
                          setCounter(1);  
                          navigation.navigate('Ongoing')
        

                        })
                    })
                }
                catch(error){
                    console.log(error);
                }
            }
            const RideData= async() =>{
              try{
                  const getPost = await firestore()
                  .collection('Consumer')
                  .where('userId', '==', user.uid)
                  .where('status', '==','Pending')
                  .get()
                  .then((querySnapshot) =>{
                      querySnapshot.docs.forEach((doc) =>{
                        setCounter(1);  
                        navigation.navigate('ConsumerRide')
      
                      })
                  })
              }
              catch(error){
                  console.log(error);
              }
          }

          
          let intervalId;
          if (timeLeft > 0) {
            intervalId = setInterval(() => {
              setTimeLeft(timeLeft - 1);
            }, 1000);
          } else {
            clearInterval(intervalId);
          }

          ReadData();
          RequestData();
          RideData();
          ReadWaiting();

          if(counter === 0) {
            setTimeout(() => setRepeater(prevState=>prevState+1), 3000);
          }

          return () => clearInterval(intervalId);


        },[repeater]);

        useFocusEffect(

          useCallback(() =>{
            
            const onBackPress = () =>{
              return true;
            };
            BackHandler.addEventListener('hardwareBackPress',onBackPress);
      
            return () =>
            
            BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          },[navigation])
        );

        useEffect(() => {
          const unsubscribe = navigation.addListener('focus', () => {
            setCounter(0);
            setRepeater(0)
          });
      
          return unsubscribe;
        }, [navigation]);
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
        const [count, setCount] = useState(1);
        const onReject = () => {
          if(count == 1){
            if(ConsumerData[0]){
              firestore()
          .collection('Consumer')
          .doc(ConsumerData[0].key)
          .update({
            status: 'Pending',
            riderId: '',
          })
          .then(() => {
            navigation.navigate('ConsumerRide');
            setCount(2)
          })
          }
          
            }
        }

        const [isOpen, setIsOpen] = useState(false);

        const onClose = () => setIsOpen(false);

        const cancelRef = useRef(null);
  return (
   <SafeAreaView>
      <ScrollView bgColor='#252525' p='5' h='100%'>
      <Text color='white' onPress={() => setIsOpen(!isOpen)}>
        Cancel
      </Text>
      <Center>      
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Header><Text fontSize='18' textAlign='center'>Cancel Ride</Text></AlertDialog.Header>
          <AlertDialog.Body>
              <Text textAlign='center'>
                Are you sure you want to cancel your Current Ride ?
              </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
          <Button w='100%' mb='2' borderWidth='1'  isDisabled={cancelDisable} variant="unstyled" colorScheme="coolGray"  onPress={onCancel}>
                Yes
              </Button>
              <Button w='100%' borderWidth='1' bgColor='danger.600' onPress={onClose} ref={cancelRef}>
                No
              </Button>
              
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
      <Text  mt='20' fontSize='32' color='white' textAlign='center'>Awaiting Co-Rider's Approval</Text>
      <Text  mt='5' fontSize='20' color='white' textAlign='center'>Hang Tight!</Text>
      <View mt='20'>
          <ActivityIndicator size="large" />
          {timeLeft === 0 ? onReject() : ''}
      </View>

    </ScrollView>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({})