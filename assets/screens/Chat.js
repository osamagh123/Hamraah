import { BackHandler, SafeAreaView, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { Button, Center, FlatList, HStack, Input, ScrollView, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton'
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import { Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'



export default function Chat() {
    const windowWidth = Dimensions.get('window').width - 20 ;
    const navigation = useNavigation();

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

    const Data = [
        {
            id: 1,
            name: 'Polly Pipe',
            message: 'There are many variations of passages',
            time: '3:00 PM',
            statu: 'online',
        },
        {
            id: 2,
            name: 'Manuel Labor',
            message: 'Handful of model sentence',
            time: '3:00 PM',
            status: 'offline',
        },
        {
            id: 3,
            name: "Lynn O'Leeum",
            message: 'Lorem ipsum dolor sit amet',
            time: '3:00 PM',
            status: 'offline',
        },
        {
            id: 4,
            name: 'Barry Kade',
            message: 'But I must explain to you how all this',
            time: '3:00 PM',
            status: 'offline',
        },
        {
            id: 5,
            name: 'Polly Pipe',
            message: 'Men who are so beguiled',
            time: '3:00 PM',
            status: 'offline',
        },
    ]

    const chatList = Data.map((item) =>{
        return(
                <TouchableOpacity key={item.id} style={{marginBottom: 15}} onPress={()=> {navigation.navigate('SingleChat')} }>
                    <View  p="3"  bgColor="white">
                        <HStack justifyContent='space-between'>
                            <HStack>
                                <View  bgColor="#141517" h="10" w="10" borderRadius="50" mr="4"></View>
                                <View>
                                    <Text>{item.name}</Text>
                                    <Text maxWidth={windowWidth -120} fontSize="12">{item.message}</Text>
                                </View>
                            </HStack>
                                <View>
                                    <Text fontSize="10">{item.time}</Text>
                                </View>
                        </HStack>
                    </View>
                </TouchableOpacity>
        )
    })

    


  return (
    <SafeAreaView>
         <Center>
        <ScrollView mt="5"  w={windowWidth}>
        <HStack justifyContent="space-between">
            <Text fontSize="22">Chat</Text>
            <View>
                <HStack>
                    <View><Button ml="3" bgColor="white" borderWidth="1" borderColor="#E7EAEF"><FontAwesomeIcon size={14} style={{color:"#13CF97"}}  icon={ faMobileScreenButton } /></Button></View>
                    <View><Button ml="3" bgColor="white" borderWidth="1" borderColor="#E7EAEF"><FontAwesomeIcon size={14} style={{color:"#13CF97"}}  icon={ faVideo } /></Button></View>
                </HStack>
            </View>
        </HStack>
        <HStack mt="5">
            <Input w="80%" bgColor="#E7EAEF" placeholder="Search"/>
            <Button ml="3" w="17%" bgColor="#141517"><Text textAlign="center"><FontAwesomeIcon size={14} style={{color:"white"}}  icon={ faMagnifyingGlass } /></Text></Button>
        </HStack>
        <View mt="5">
            {chatList}
        </View>
    </ScrollView>
    </Center>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})