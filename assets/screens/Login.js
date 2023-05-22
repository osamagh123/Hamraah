import { ActivityIndicator, BackHandler, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Center, Heading, Image, Input, Text, View, Pressable,Icon, HStack, Box, Button, ScrollView, Divider, Collapse, Alert, VStack, IconButton, CloseIcon, Modal } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import SocialLogin from '../components/SocialLogin'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import auth, { firebase } from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';



export default function Login() {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const [show, setShow] = React.useState(false);
    const [groupValues, setGroupValues] = React.useState([]);
    const navigation = useNavigation();
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const user = firebase.auth().currentUser;
    const [isLoading, setLoading] = useState(false);
    const [isButtonDisabled,setIsButtonDisabled] = useState(false)
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

    useEffect(() => {
      setLoading(true)
      if(user){
        console.log(user);
        navigation.navigate('Home');
  
      }
      else{
        console.log('no user')
        setLoading(false)

      }
    })

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const Login = () => {
      setLoading(true);
      if(!email.trim()){
        setAlert(true)
        setErrormsg('Please enter your email address')
        setLoading(false);

      }
      else if (!password.trim()){
        setAlert(true)
        setErrormsg('Please enter your password')
        setLoading(false);

      }
      else{

        auth()
        .signInWithEmailAndPassword(email,password)
        .then(() => {
          setIsButtonDisabled(true);          
          navigation.navigate('Home');
        })
        .catch(error => {
          setAlert(true)
          setErrormsg(error.message)
        })
      }
    }

   

  return (
    <SafeAreaView>
      <ScrollView  bgColor="#252525" h='100%' keyboardShouldPersistTaps={'handled'} p='5'>
      <View pt="5" alignItems="center" h={windowHeight} justifyContent='center'>
          <Image resizeMode='contain' h={windowWidth >= 500 ? '500' : '220' }  w='700'  source={require('../images/login.png')} alt="img"/>
          <Text fontSize="32" color="white" mt="2">Welcome!</Text>
          <Text mb="3" color="#939AA8" fontSize="14" fontWeight="400">Please login to your account</Text>
          <Input h='50' mb="3" w={windowWidth >= 500 ? '70%' : '100%'} InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faEnvelope } />} placeholder="Email" color='white' onChangeText={text => setEmail(text)} />
     <Input h='50' w={windowWidth >= 500 ? '70%' : '100%'} InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faLock } />} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <FontAwesomeIcon style={{color:"#FCFCFD", marginRight:15}}  icon={ show ? faEyeSlash : faEye } />
          </Pressable>} placeholder="Password" color='white' onChangeText={(text) => setPassword(text)} />
          <HStack w={windowWidth >= 500 ? '70%' : '100%'}  justifyContent="flex-end" mt="2">
          <TouchableOpacity onPress={() => {navigation.navigate('ForgotPassword')}}><Text color="#68727D" mt="2" fontSize="12">Forgot Password?</Text></TouchableOpacity>
        </HStack>
           {/* <Pressable mt='5' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' bgColor='#07b3d1' mb='2' _pressed={{backgroundColor: '#07b3d1'}} onPress={Login}>
                    <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Login</Text>  
                      </View>
                    </LinearGradient>
            </Pressable> */}
             <Button mt='5' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' borderWidth='1' borderColor='#00AFCD' bgColor='transparent' mb='2' _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}} onPress={Login}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16'>Login</Text>  
                      </View>
            </Button>
        <HStack mt="3">
        <Text color="#939AA8">Not a member yet?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Signup')}}><Text ml="1" color="#FFFFFF" >Sign Up</Text></TouchableOpacity>
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