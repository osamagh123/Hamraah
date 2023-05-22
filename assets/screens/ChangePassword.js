import { Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import { Alert, Box, Button, Center, Image, Input, Modal, Pressable, ScrollView, Text, View, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import {firebase} from '@react-native-firebase/auth'

export default function ChangePassword() {
    const windowWidth = Dimensions.get('window').width;
    const [show, setShow] = React.useState(false);
    const [show2, setShow2] = React.useState(false);

  const [currentPassword,setCurrentPassword] = useState('');
  const [pass,setPass] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');
  

  const ForgotPass = async () => {
    if(!currentPassword.trim()){
      setAlert(true)
      setErrormsg('Enter your current password')
    }
    else if(!pass.trim()){
      setAlert(true)
      setErrormsg('Enter your new password')
    }
    else{
      try {
        const user = firebase.auth().currentUser;
        console.log('user', user); // Check if user is defined
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        console.log('credential', credential); // Check if credential is created correctly
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(pass);
        console.log('Password updated successfully');
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
        alert('Invalid Password')
      }
    }
  };
  return (
    <SafeAreaView>
        <View p='5' bgColor='#252525' h='100%' justifyContent='center'>
            <Text onPress={() => {navigation.goBack()}} position='absolute' top='2' color='white' p='5'>Back</Text>
      <View alignItems="center">
        <Image resizeMode='contain' h='220' source={require('../images/forgot.png')} alt="img"/>
        <Text fontSize="32" color="white" mt="5">Change Password</Text>
        {/* <Text px="10" textAlign="center" mb="3" color="#939AA8" fontSize="14" fontWeight="400">Enter your email and we will send you a link to reset your password</Text> */}
        <Input type={show ? "text" : "password"} mt="4"  w={windowWidth >= 500 ? '70%' : '100%'} h='50' InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faLock } />} color='white' placeholder="Current Password" value={currentPassword} onChangeText={text => setCurrentPassword(text)} InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <FontAwesomeIcon style={{color:"#FCFCFD", marginRight:15}}  icon={ show ? faEyeSlash : faEye } />
          </Pressable>} />
        <Input type={show2 ? "text" : "password"} mt="4"  w={windowWidth >= 500 ? '70%' : '100%'} h='50' InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faLock } />} color='white' placeholder="New Password" value={pass} onChangeText={text => setPass(text)} InputRightElement={<Pressable onPress={() => setShow2(!show2)}>
            <FontAwesomeIcon style={{color:"#FCFCFD", marginRight:15}}  icon={ show2 ? faEyeSlash : faEye } />
          </Pressable>} />
        <Button mt='5' borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='transparent' mb='2' borderWidth='1' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}} onPress={ForgotPass}>
                    {/* <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}> */}
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Submit</Text>  
                      </View>
                    {/* </LinearGradient> */}
        </Button>
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
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})