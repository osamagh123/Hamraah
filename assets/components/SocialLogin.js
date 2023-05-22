import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF'
import {faGooglePlusG} from '@fortawesome/free-brands-svg-icons/faGooglePlusG'
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter'
import { Alert, Box, Button, Center, HStack, Image, Input, Modal, Text, View, VStack } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useNavigation } from '@react-navigation/core'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'

export default function SocialLogin() {
  
  const navigation = useNavigation();
  GoogleSignin.configure({
    webClientId: '344736268986-3kq0o1l6jqp955jmefkcm3autbctke0i.apps.googleusercontent.com',
  });
  signIn = async () => {
      // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  // const authResult =  auth().signInWithCredential(googleCredential);
  const userCredential = await auth().signInWithCredential(googleCredential);
  if (userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime) {
    // User is a new user, navigate to NewProfile
    navigation.navigate('NewProfile')
  } else {
    // User already exists, navigate to Home
    navigation.navigate('Home')
  }
  };

  const [alertBox,setAlert] = useState(false)
  const [errormsg, setErrormsg] = useState('');
async function onFacebookButtonPress() {
  
  try {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the user's AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    await auth().signInWithCredential(facebookCredential)
    .then(async (userCredential) => {
      const isNewUser = userCredential.additionalUserInfo.isNewUser; // Check if user is a new user

      if (isNewUser) {
        // Navigate to NewProfile if user is a new user
        navigation.navigate('NewProfile');
      } else {
        // Navigate to Home if user is not a new user
        navigation.navigate('Home');
      }
    });
  } catch (error) {
      setAlert(true)
      setErrormsg(error.message);
      console.log(error)    
  }
}

  return (
    <View mb="20">
      <HStack mt="4">
         {/* <TouchableOpacity onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}>
         <View bgColor="#4A6BD5" mr="3" borderRadius="50" w="10" h="10" justifyContent="center" alignItems="center">
            <FontAwesomeIcon style={{color:"#FCFCFD"}}  icon={ faFacebookF} />
          </View>
         </TouchableOpacity> */}
         <TouchableOpacity onPress={signIn}>
          <View bgColor="#ffffff" mr="3" borderRadius="50" w="10" h="10" justifyContent="center" alignItems="center">
              {/* <FontAwesomeIcon style={{color:"#FCFCFD"}}  icon={ faGooglePlusG} /> */}
              <Image resizeMode='contain' h='5'  w='5' source={require('../images/google.png')} alt="img"/>
            </View>
         </TouchableOpacity>

          <TouchableOpacity onPress={() => {navigation.navigate('Phone')}}>
            <View bgColor="green.600" mr="3" borderRadius="50" w="10" h="10" justifyContent="center" alignItems="center">
              <FontAwesomeIcon style={{color:"#FCFCFD"}}  icon={ faPhoneAlt} />
            </View>
          </TouchableOpacity>
        </HStack>
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
  )
}

const styles = StyleSheet.create({})