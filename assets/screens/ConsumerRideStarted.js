import { StyleSheet, ActivityIndicator, BackHandler, SafeAreaView} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, Button, Center, ScrollView, Text, View } from 'native-base'
import { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';



export default function ConsumerRideStarted(props) {
    const user = firebase.auth().currentUser;
    const [repeater,setRepeater]=useState(0);
    const navigation = useNavigation();
    const [ConsumerData,setConsumerData] =useState([]);
    const [counter, setCounter] = useState(0);
    const rideKey = props.rideKey
        useEffect(()=>{
            const RiderData = async() =>{
                var rider = [];
                try{
                    const getPost = await firestore()
                    .collection('Ride')
                    .doc(rideKey.rideKey)
                    .get()
                    .then((documentSnapshot) =>{
                        rider.push({...documentSnapshot.data(),key: documentSnapshot.id})
                        if(rider[0].status === 'In Progress' || rider[0].status === 'Started'){
                          if(rider[0].consumerId.includes(user.uid)){
                            setCounter(1)

                            console.log('Hello')
                          }
                          else{
                            setCounter(1)
                          firestore()
                          .collection('Consumer')
                          .doc(ConsumerData[0].key)
                          .update({
                            riderId: '',
                            status: 'Pending',
                          })
                          navigation.navigate('ConsumerRide')

                          }
                        }
                    })
                }
                catch(error){
                    alert(error)
                }
            }
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

          RiderData();
          ReadData();
          RequestData();
          RideData();
          ReadWaiting();

          if(counter === 0) {
            setTimeout(() => setRepeater(prevState=>prevState+1), 3000);
          }


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
      <Text  mt='5' fontSize='20' color='white' textAlign='center'>Hang Tight! This might take a while</Text>
      <View mt='20'>
          <ActivityIndicator size="large" />
      </View>

    </ScrollView>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({})