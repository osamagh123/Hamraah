import { SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Center, FlatList, HStack, Input, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton'
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo'
import { Dimensions } from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

export default function SingleChat(props) {
  const navigation = useNavigation();
const windowWidth = Dimensions.get('window').width - 20 ;
const windowHeight = Dimensions.get('window').height - 150 ;
const user = firebase.auth().currentUser;
const [rideData,setRideData] = useState([])
const rideKey = props.RideKey;

console.log(rideKey)
const [message,setMessage] =useState([]) ;

useEffect(() => {
  const ReadRider= async() =>{
    try{
        var ride= [];
        const getPost = await firestore()
        .collection('Ride')
        .where('consumerId', 'array-contains', user.uid)
        .where('status', 'in', ['In Progress','Started','Pending','Waiting'])
        .get()
        .then((querySnapshot) =>{
            querySnapshot.docs.forEach((doc) =>{
                ride.push({...doc.data(),key: doc.id});
            });
            setRideData(ride);
            console.log(rideData)
            
            
        })
    }
    catch(error){
        console.log(error);

    }
}

ReadRider();

},[])

useEffect(() => {
  if (rideData.length > 0) {
    const messagesRef = firebase
      .database()
      .ref('chat')
      .orderByChild('rideKey')
      .equalTo(rideData[0].key);
    messagesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageArray = Object.entries(data).map(([key, value], index) => ({
          ...value,
          key,
          index
        })).sort((a,b) => a.key.localeCompare(b.key));
        setMessage(messageArray);
        console.log(messageArray)
        const getData = async () => {
          try {
             const value = await AsyncStorage.getItem('@storage_Key')
             let msgnew=[];
              if(value !== null) {
                for(let i in value){
                  value[i].Ririderstatus="seen";
                }
                await AsyncStorage.setItem('@storage_Key', value)

                }
              }catch(e){
                console.log(e)
              }
            }
            

        for(let i=0;i<messageArray.length;i++){
          if(messageArray[i].userId==user.uid){
            const userRefread = firebase.database().ref('chat/'+messageArray[i].key).update({

              Ririderstatus:'seen'
            })
              .then(() => {
                console.log('data updatedd')
              });
          }
          
        }

      } else {
        setMessage([]);
      }
    });
    return () => messagesRef.off();
  }
}, [rideData]);


const createUser = () => {
  const userRef = firebase.database().ref('chat').push();
  userRef.set({
    rideKey: rideData[0].key,
    riderId: rideData[0].userId,
    message: newMessage,
    name: user.displayName,
    userId: user.uid,
    senderId: user.uid,
    time: Date.now(),
    Customerstatus: 'unread'
  })
  .then(() => {
    setNewMessage('');
  });
};

  const renderItem = (item) => {
    const status = item.item.senderId === user.uid ? 'flex-end' : 'flex-start';
    const color = item.item.senderId === user.uid  ? '#00AFCD' : '#FFFFFF';
    const text = item.item.senderId === user.uid  ? '#FFFFFF' : '#000000';
    return(
      <View alignItems={status}>
        <Text color='white' fontSize='10' mb='2'>{item.item.name}</Text>
        <View  bgColor={color} p="2" borderRadius="8" mb="3">
          <Text color={text}>{item.item.message}</Text>
        </View>
      </View>
    )
  }
  const [newMessage, setNewMessage] = useState('');
  const addToArray = {
    senderId: 1,
    text: newMessage,
  }
  const onPressHandle= () =>{
    setMessage(prevMessage => [...prevMessage, addToArray]);
    setNewMessage('');
  }
  
  return (
    <SafeAreaView>
      <Center bgColor="#252525">
        <View  p="3" w={windowWidth} h="100%">
        <TouchableOpacity onPress={() => {navigation.goBack()}}><FontAwesomeIcon size={18} style={{color: '#FFFFFF'}} icon={faArrowLeft}/></TouchableOpacity>

        <HStack mt='5' justifyContent="space-between">
            <Text color='white' fontSize="22">Chat</Text>
        </HStack>
        <View  mt="10" h={windowHeight - 120 }  justifyContent="flex-end">
        <FlatList data={message} renderItem={renderItem}/>
      </View>
      <HStack bgColor='#252525'  position="absolute" bottom="0" pb="5" pr='2' w={windowWidth}>
          <Input w="70%" my="5" mr="3" placeholder="Type your Message" color='white' value={newMessage} onChangeText={setNewMessage}  />
           <Button isDisabled={newMessage.length < 1} my="5" w="29
           %" onPress={createUser} >Send</Button>
        </HStack>
    </View>
    </Center>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})