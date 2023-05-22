import { Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import { Alert, Box, Button, Center, Divider, HStack, Image, Input, Modal, ScrollView, Text, View, VStack } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useNavigation } from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
export default function Phone() {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [phoneNo, setPno] = useState('');
  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');
  const [confirm, setConfirm] = useState(null);
  async function signInWithPhoneNumber(phoneNumber) {
    if(!phoneNo.trim()){
      setAlert(true)
      setErrormsg('Enter a valid phone number')
    }
    else{
      try{
        const confirmation = await auth().signInWithPhoneNumber('+92'+phoneNo);
      setConfirm(confirmation);
      navigation.navigate('OTP',{confirmation: confirmation, phoneNo: phoneNo})
      }
      catch(error){
        setAlert(true)
        setErrormsg(error.message)
      }
    }
  }

  return (
    <SafeAreaView>
        <ScrollView p='5' bgColor='#252525' h='100%'>
          <Text onPress={() => {navigation.goBack()}} color='white'>Back</Text>
            <View pt="5" alignItems="center" h={windowHeight} justifyContent='center'>
          <Image resizeMode='contain' h={windowWidth >= 500 ? '500' : '220' }  w='700'  source={require('../images/login.png')} alt="img"/>
          <Text fontSize="32" color="white" mt="2">Welcome!</Text>
          <Text mb="3" color="#939AA8" fontSize="14" fontWeight="400">Enter your Mobile Number</Text>
          <Input value={phoneNo} onChangeText={text => setPno(text)} h='50' placeholder='3XXXXXXXXX' color='white' InputLeftElement={<View><HStack><Text ml='2' color='#939AA8'>+92</Text><Divider ml='2' h='6' bgColor='#939AA8' orientation='vertical'/></HStack></View>} keyboardType='numeric'/>
             <Button mt='5' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' borderWidth='1' borderColor='#00AFCD' bgColor='transparent' mb='2' _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}} onPress={signInWithPhoneNumber}>
                      <View h='50' justifyContent='center'>
                        <Text justifyContent='center' textAlign='center' color='white' fontSize='16'>Continue</Text>  
                      </View>
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
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})