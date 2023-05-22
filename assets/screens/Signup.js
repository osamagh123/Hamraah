import { BackHandler, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Alert, Box, Button, Center, Divider, HStack, Image, Input, Modal, Pressable, ScrollView, Text, View, VStack } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import auth, { firebase } from '@react-native-firebase/auth'
import SocialLogin from '../components/SocialLogin'
import LinearGradient from 'react-native-linear-gradient';



export default function Signup() {
    const [show, setShow] = React.useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const navigation = useNavigation();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [isLoading, setLoading] = useState(false);
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const [alertBox,setAlert] = useState(false)
    const [errormsg, setErrormsg] = useState('');



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
    const onAuth = () => {
      setLoading(true)

      if (!email.trim()){
        setAlert(true)
        setErrormsg('Please enter your email address')
        setLoading(false)

      }
      // else if (!name.trim()){
      //   alert('Please enter Name')
      // }
      else if (!password.trim()){
        setAlert(true)
        setErrormsg('Please enter your password')
        setLoading(false)

      }
      else{
        auth()
    .createUserWithEmailAndPassword(email,password)
    .then((res) => {
      // res.user.updateProfile({
      //   displayName: name,
      // })
      setLoading(false)
      setIsButtonDisabled(true)

      navigation.navigate('NewProfile');
    })
    .catch(error =>{
      if(error.code === 'auth/email-already-in-use'){
        setAlert(true)
        setErrormsg('That email address is already in use!');
        setLoading(false)

      }
      if(error.code === 'auth/invalid-email'){
        setAlert(true)
        setErrormsg('That email address is invalid!');
        setLoading(false)

      }
      setAlert(true)
      setErrormsg(error.message);
      setLoading(false)

    })
      }
    }

  return (
   <SafeAreaView>
      <ScrollView  bgColor="#252525" h='100%' p='5'>
        <View justifyContent='center'  pt="5" alignItems="center" h={windowHeight}>
          <Image resizeMode='contain' h={windowWidth >= 500 ? '500' : '220' }  w='700' source={require('../images/signup.png')} alt="img"/>
          <Text fontSize="32" color="white" mt="5">Create Profile</Text>
          <Text mb="3" color="#939AA8" fontSize="14" fontWeight="400">Please create your profile</Text>
          {/* <Input mb="3" w={{
      base: "75%",
      md: "25%"
    }} InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faUser } />} placeholder="Name" color='white' onChangeText={text => setName(text)} value={name} /> */}
          <Input h='50' mb="3" w={windowWidth >= 500 ? '70%' : '100%'} InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faEnvelope } />} placeholder="Email" color='white' onChangeText={text => setEmail(text)} value={email} />
     <Input h='50' w={windowWidth >= 500 ? '70%' : '100%'} InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faLock } />} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <FontAwesomeIcon style={{color:"#FCFCFD", marginRight:15}}  icon={ show ? faEyeSlash : faEye } />
          </Pressable>} placeholder="Password" onChangeText={text => setPassword(text)} value={password} color='white'/>
          {/* <Pressable isDisabled={isButtonDisabled} mt='10' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' bgColor='#07b3d1' mb='2' _pressed={{backgroundColor: '#07b3d1'}} onPress={onAuth}>
                    <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Sign Up</Text>  
                      </View>
                    </LinearGradient>
        </Pressable> */}
        <Button bgColor='transparent' borderWidth='1' borderColor='#00AFCD' isDisabled={isButtonDisabled} mt='10' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' mb='2' _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}} onPress={onAuth}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16'>Sign Up</Text>  
                      </View>
        </Button>
        <HStack mt="3">
        <Text  color="#939AA8">Already a member?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Login')}}><Text ml="1" color="#FFFFFF">Sign In</Text></TouchableOpacity>
        </HStack>
        <HStack mt="4">
          <Divider bg="#48525B" mt="2.5" mx="3" w="120"/>
          <Text color="white">or</Text>
          <Divider bg="#48525B" mt="2.5" mx="3" w="120"/>
        </HStack>
        <SocialLogin/>
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