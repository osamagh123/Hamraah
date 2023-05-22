import { Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import { Alert, Box, Button, Center, Image, Input, Modal, Pressable, ScrollView, Text, View, VStack } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { useNavigation } from '@react-navigation/native'
import auth, { firebase } from '@react-native-firebase/auth'
import LinearGradient from 'react-native-linear-gradient';


export default function ForgotPassword() {
  const windowWidth = Dimensions.get('window').width;
  const [email,setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');

  const ForgotPass = () => {
    setLoading(true)
    auth().sendPasswordResetEmail(email)
    .then(() => {
      setLoading(false)
      navigation.navigate('VerifyEmail', {email: email});
    }).catch((error) => {
      setAlert(true)
      setErrormsg(error.message);
    })
  }
    const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View bgColor="#252525" h='100%' justifyContent='center' p='5'>
      <Text onPress={() => {navigation.navigate('Login')}} position='absolute' top='2' color='white' p='5'>Back</Text>
      <View alignItems="center">
        <Image resizeMode='contain' h='220' source={require('../images/forgot.png')} alt="img"/>
        <Text fontSize="32" color="white" mt="5">Forgot Password</Text>
        <Text px="10" textAlign="center" mb="3" color="#939AA8" fontSize="14" fontWeight="400">Enter your email and we will send you a link to reset your password</Text>
        <Input mt="4"  w={windowWidth >= 500 ? '70%' : '100%'} h='50' InputLeftElement={<FontAwesomeIcon style={{color:"#FCFCFD", marginLeft:10}}  icon={ faEnvelope } />} color='white' placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
        {/* <Pressable mt='5' borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='#07b3d1' mb='2' _pressed={{backgroundColor: '#07b3d1'}} onPress={ForgotPass}>
                    <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Send</Text>  
                      </View>
                    </LinearGradient>
        </Pressable> */}
        <Button mt='5' borderRadius='8' w={windowWidth >= 500 ? '70%' : '90%'} h='50' bgColor='transparent' mb='2' borderWidth='1' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}} onPress={ForgotPass}>
                    {/* <LinearGradient style={{opacity: 1, borderRadius: 8, height: 50}} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#07b3d1', '#0ec3b0']}> */}
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16' fontWeight='600'>Send</Text>  
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