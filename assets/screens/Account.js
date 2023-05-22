import { BackHandler, Platform, SafeAreaView, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, FlatList, HStack, Image, ScrollView, Text, View } from 'native-base'
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import auth, { firebase } from '@react-native-firebase/auth'
import firestore, {doc, setDoc, getDoc} from '@react-native-firebase/firestore';



export default function Account() {
    const {height, width} = useWindowDimensions();
    const [repeater,setRepeater] = useState(0);


    const windowWidth = Dimensions.get('window').width;
    const thirdWidth = width/3 - 40;
    const twoWidth = width/2 + 20;

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');

    const user = firebase.auth().currentUser;
    useEffect(() => {
        const ReadData = async() => {
            // const docRef = doc(firestore,'Users', user.uid)
            // const docSnap = await getDoc(docRef);

            // if (docSnap.exists()) {
            //     setName(docSnap.data().name);
            // }

            await firestore()
            .collection('Users')
            .doc(user.uid)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setName(documentSnapshot.data().name)
                    setEmail(documentSnapshot.data().email)
                    setPhone(documentSnapshot.data().phone)
                  }
            })
        }
        ReadData();
        setTimeout(() => setRepeater(prevState=>prevState+1), 1000);

    }, [repeater])


//    async function loadProfile(){
//         await firestore().collection('Users').doc(user.uid).get().then((querySnapshot) => {
//             querySnapshot.forEach(snapshot => {
//                 let data = snapshot.data();
//                 console.log(data);
//             })
//         });
//     }

//     loadProfile();
    


    const navigation = useNavigation();

    const data = [
        // {
        //     id: 1,
        //     title: 'Apply Promo Code',
        //     image: require('../images/promo-code.png'),
        //     route: 'Promo',
        // },
        // {
        //     id: 2,
        //     title: 'Refer & Earn',
        //     image: require('../images/refer.png'),
        //     route: 'Refer',
        // },
        {
            id: 3,
            title: 'Personal Information',
            image: require('../images/payment.png'),
            route: 'EditProfile',
        },
        {
            id: 4,
            title: 'Change Password',
            image: require('../images/terms.png'),
            route: 'ChangePassword',
        },
    ]

    const profileList = data.map((item) => {
        const route = item.route;
        return(
            <Button bgColor='transparent' _pressed={{backgroundColor: '#00AFCD'}} mb="3" p="4" borderWidth='1' borderRadius='8' borderColor="white" key={item.id} onPress={() => {navigation.navigate(route)}}>
                <View w={windowWidth - 80}>
                    <HStack justifyContent='space-between'>
                        <View>
                            <HStack>
                                <Image mt="1" source={item.image} alt="img"/>
                                <Text color='white' ml="4">{item.title}</Text>
                            </HStack>
                        </View>
                        <Text mt={Platform.OS === 'ios' ? '2' : '0'}><FontAwesomeIcon size={14} style={{color: "#ACB4BC"}} icon={faChevronRight} /></Text>
                    </HStack>
                </View>
        </Button>
        )
    })

    async function logout(){
        await firebase.auth().signOut();
        navigation.navigate('Login')
    }
  return (
   <SafeAreaView>
        <ScrollView p="5" bgColor='#252525' h='100%'>
        <Text onPress={() => {navigation.goBack()}} color='white'>Back</Text>
      <Text mt='5' fontSize="20" color="white">Settings</Text>
      <HStack mt="15">
            <View w='100' h='100' borderRadius="100" bgColor="#322F2F">
                <Image source={{uri: user.photoURL}} w='100' h='100' borderRadius='100' alt=' '/>
                <View position='relative' bottom='100' alignItems="flex-end" textAlign='right'>
                {/* <TouchableOpacity onPress={() => {navigation.navigate('EditProfile')}}>
                    <View  bgColor='#13CF97' w='5' h='5' borderRadius='50' justifyContent='center'>
                        <View justifyContent="center" alignItems="center" textAlign='center'>
                            <FontAwesomeIcon size={8} style={{color: 'white'}} icon={faPen}/>
                        </View>
                    </View>
                </TouchableOpacity> */}
                </View>
            </View>
            <View ml="4">
                <Text fontSize="32" w={twoWidth} style={{width: twoWidth}} color='white'>{user && user.displayName ? user.displayName : 'N/A'}</Text>
                <HStack mt="2">
                    <View>
                            <View mb="2">
                                <HStack>
                                    <View bgColor="#00AFCD" h="25" w="25" borderRadius="50" justifyContent="center">
                                        <View textAlign="center" justifyContent="center" alignItems="center"><FontAwesomeIcon size={8} style={{color: "white"}} icon={faEnvelope}/></View>
                                    </View>
                                <View justifyContent='center'  ml="1">
                                    <Text fontSize="12" color="white" w={twoWidth}>{user && email ? email : 'N/A'}</Text>
                                </View>
                                </HStack>
                            </View>
                            <View>
                                <HStack>
                                    <View bgColor="#00AFCD" h="25" w="25" borderRadius="50" justifyContent="center">
                                    <View justifyContent="center"alignItems="center" textAlign="center"><FontAwesomeIcon size={8} style={{color: "white"}} icon={faMobileScreenButton}/></View>
                                </View>
                                <View justifyContent='center' ml="1">
                                    <Text fontSize="12" color="white">{user && phone ? phone : 'N/A'}</Text>
                                </View>
                                </HStack>
                            </View>
                    </View>
                </HStack>
            </View>
        </HStack>

        <View mt="5" mb="5">
            {profileList}
            <Button bgColor='transparent' _pressed={{backgroundColor: '#00AFCD'}} mb="3" p="4" borderWidth='1' borderRadius='8' borderColor="white" onPress={logout}>
            <View w={windowWidth - 80}>
                    <HStack justifyContent='space-between'>
                        <View>
                            <HStack>
                                <Image mt="1" source={require ('../images/logout.png')} alt="img"/>
                                <Text color='white' ml="4">Log Out</Text>
                            </HStack>
                        </View>
                        <Text mt={Platform.OS === 'ios' ? '2' : '0'}><FontAwesomeIcon size={14} style={{color: "#ACB4BC"}} icon={faChevronRight} /></Text>
                    </HStack>
                </View>
        </Button>
        </View>

    </ScrollView>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({})