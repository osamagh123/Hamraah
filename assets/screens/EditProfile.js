import { BackHandler, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Center, Image, Input, Modal, Text, View, Button, ScrollView, Alert, VStack, Box, Pressable } from 'native-base'
import DatePicker from 'react-native-date-picker'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faEdit, faUpload } from '@fortawesome/free-solid-svg-icons'
import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import storage from '@react-native-firebase/storage';


export default function EditProfile() {
  const windowWidth = Dimensions.get('window').width;
  const currentDate= new Date();
  const user = firebase.auth().currentUser;


    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [val, setVal] = useState('DD/MM/YYYY');
    const [profileURL,setProfileURL] = useState(null);
    const [error, setError] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [alertBox,setAlert] = useState(false)
    const [errormsg, setErrormsg] = useState('');
    const storageRef = storage().ref();
    
    const onConfirm = (date) => {
        setOpen(false);
        setDate(date);
        setVal(date.toLocaleDateString('en-GB', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          }))
        
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
        

    const [name,setName] = useState(user.displayName);
    const [phone,setPhone] = useState('');
    const [email,setEmail] = useState('');
    const [userInfo,setUserInfo] = useState('');
    
    const [response, setResponse] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const [imgLink, setImageLink] = useState(null)

    useEffect(() => {
      const user = firebase.auth().currentUser;
      console.log(user,'User')
      const ReadData = async() => {

        await firestore()
        .collection('Users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              setPhone(documentSnapshot.data().phone)
              setVal(documentSnapshot.data().dob)
              setProfileURL(documentSnapshot.data().photoURL)
              setEmail(documentSnapshot.data().email)
              }
        })
    }
    ReadData();
      
    // setPhone(info.phone)
    },[])

    const updateProfile = () => {
      if(!name.trim()){
        setAlert(true)
        setErrormsg('Enter name')
        setErrorName(true)
      }
      else if (val === 'DD/MM/YYYY'){
        setAlert(true)
        setErrormsg('Enter date of birth')
        setError(true)

      }
      else if(!phone.trim()){
        setAlert(true)
        setErrormsg('Enter phone number')
        setErrorPhone(true)
      }
      else if(!profileURL.trim()){
        setAlert(true)
        setErrormsg('Upload a photo')
      }
      else{
        if (userInfo){
          firestore()
          .collection('Users')
          .doc(user.uid)
          .update({
              name: name,
              dob: val,
              phone: phone,
              email: user.email,
              photoURL: profileURL,
          })
          .then(()=>{
              console.log('User updated')
          })
          .catch((error)=>{
              console.error(error + 'update');
          });
      }
      else{
          firestore()
          .collection('Users')
          .doc(user.uid)
          .update({
              uid: user.uid,
              name: name,
              dob: val,
              phone: phone,
              email: user.email,
              photoURL: profileURL,
          })
          .then(()=>{
              console.log('User added')
          })
          .catch((error)=>{
              console.error(error + 'add');
          });
      }
      user.updateProfile({
          displayName: name,
          photoURL: profileURL,
          phoneNumber: phone,
      })
      .then(()=>{
      })
      .catch((error) => {
          console.error(error);
      });
      navigation.navigate('Home')
      }

        
    }

    const handleChoosePhoto = () => {
        const options = {
          storageOptions: {
            mediaType: 'photo',
            path: 'images',
          },
          includeBase64: true
        };
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.assets[0].error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
              let img = response.assets[0].uri
              if(img != null) {
                ImgToBase64.getBase64String(img)
                .then((base64String) => {
                  setImageURI(base64String)
                   const imageRef = storageRef.child(`profile/${firebase.auth().currentUser.uid}.jpg`);
                   const task = imageRef.putFile(img);
                   task.on('state_changed', (snapshot) => {
                    console.log(`Upload is ${snapshot.bytesTransferred / snapshot.totalBytes * 100}% complete`);
                  }, (error) => {
                    console.log('Error uploading image: ', error);
                  }, async () => {
                    // Upload complete, set the photoURL for the user
                    const downloadURL = await imageRef.getDownloadURL();
                    setProfileURL(downloadURL)
                    
                    console.log('Photo URL updated successfully');
                  });
                })
                .catch(err => console.log(err));
              }
            
            // const source = { uri: 'data: image/jpeg;base64,' + response.assets[0].base64};
            // console.log(response)
            // setImageURI(source);
          }
        });
      };
  return (
    <SafeAreaView>
        <ScrollView bgColor='#252525' p='5' h='100%'>
    <TouchableOpacity onPress={() => {navigation.goBack()}}><Text color='white'>Back</Text></TouchableOpacity>
     <Text mt='5' fontSize="20" color="white">Update Profile</Text>
        <Center>
        {profileURL ? (
            <View>
              <Image source={{uri: profileURL }} style={{ width: 200, height: 200, marginTop: 5, borderRadius: 100 }} alt='img' />
              <Pressable onPress={handleChoosePhoto}  position='absolute' right='0'>
                <View bgColor='#00AFCD' p='2' borderRadius='50'><FontAwesomeIcon icon={faEdit} style={{color: '#FFFFFF'}} size={14}/></View>
              </Pressable>
            </View>
            ) : (
                <TouchableOpacity onPress={handleChoosePhoto}>
                    <View justifyContent='center' alignItems='center' bgColor='black' marginTop="5" w='200' h='200' borderRadius='100'>
                        <Text><FontAwesomeIcon style={{color: '#FFFFFF'}} size={42} icon={faUpload}/></Text>
                    </View>
                </TouchableOpacity>
            )}
        </Center>
        <View mt='5' p='3'>
            <Text color='white' fontSize='10'>Name</Text>
            <Input h='50' color='white' borderColor={errorName ? 'red.600' : '#E7EAEF'} mt='1' value={name} isDisabled onChangeText={text => setName(text)}/>
            <Text mt='5' mb='1' color='white' fontSize='10'>Date of Birth</Text>
            <TouchableOpacity  onPress={() => setOpen(true)}>
                <View p='3' borderWidth='1' borderColor={error ? 'red.600' : '#E7EAEF'} borderRadius='4'>
                    <Text color='white'>{val}</Text>
                </View>
                
            </TouchableOpacity>            
            <DatePicker maximumDate={currentDate} modal  mode='date' open={open}  date={date} onConfirm={onConfirm} onCancel={() => {setOpen(false)}}/>
            <Text mt='5' mb='1' color='white' fontSize='10' >Phone</Text>
            <Input h='50' color='white' borderColor={errorPhone ? 'red.600' : '#E7EAEF'} mt='1' keyboardType='numeric' value={phone} onChangeText={text => setPhone(text)}/>
            <Text mt='5' mb='1' color='white' fontSize='10' >Email</Text>
            <Input h='50' color='white' borderColor='#E7EAEF' mt='1' isDisabled value={email}/>
            <Center>
                <Button h='50' mt='10' mb='10' w={windowWidth >= 500 ? '70%' : '90%'} bgColor='transparent' borderWidth='1' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}} onPress={updateProfile}><Text color='white' >Update</Text></Button>
            </Center>
        </View>
        <Modal isOpen={alertBox}>
        <Alert w="80%" status='error' bgColor='white' p='5'>
          <VStack space={1} flexShrink={1} w="100%">
            <Center>
             <Alert.Icon size='xl'/>
            </Center>
              <Text textAlign='center' fontSize="24" fontWeight="medium" _dark={{
                color: "coolGray.800"
              }}>Error
                </Text>
            <Box p="3" _dark={{
            _text: {
              color: "coolGray.600"
            }
          }}>
            <Text textAlign='center'>
            {errormsg}
            </Text>
            </Box>
            <Center>
            <Button bgColor='#00AFCD' w='200' onPress={()=> setAlert(false)}>Ok</Button>

            </Center>
          </VStack>
        </Alert>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})