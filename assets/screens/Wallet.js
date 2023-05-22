import { BackHandler, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import { Center, FlatList, HStack, Image, ScrollView, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useFocusEffect } from '@react-navigation/core'

export default function Wallet() {

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


    const data = [
        {
            id: 1,
            purpose: 'Ride Payment',
            date: '12 Jun, 2020',
            status: 'Amount Deducted',
            money: '200',
            name: 'Barry Kade',
        },
        {
            id: 2,
            purpose: 'Ride Payment',
            date: '12 Jun, 2020',
            status: 'Amount Deducted',
            money: '120',
            name: 'Barry Kade',
        }
    ]

    const WalletList = data.map((item) => {
        return(
            <View key={item.id} borderRadius="6" mb="5" bgColor="white" p="3" >
                <HStack justifyContent='space-between'>
                    <View>
                        <HStack>
                            <View h="10" w="10" bgColor="#322F2F" borderRadius="50"></View>
                            <View ml="3">
                                <Text color="#31373E">{item.purpose}</Text>
                                <Text color="#798293" fontSize="12">{item.date}</Text>
                                <Text mt="2" color="#798293" fontSize="10">{item.status}</Text>
                            </View>
                        </HStack>
                    </View>
                    <View>
                        <Text textAlign="right" mt="3" color="#00AFCD" fontSize='16' fontWeight='600'>${item.money}</Text>
                        <Text mt="3" textAlign="right" color="#798293" fontSize="10">{item.name}</Text>
                    </View>
                </HStack>
            </View>
        )
    })

  return (
    <SafeAreaView>
        <ScrollView p="3">
      <Text fontSize="20" color="#31373E">Wallet</Text>
      <Center>
          <Image mt="3" borderRadius="8" source={require('../images/Card.png')} alt="card"/>
          <Text mt="3" color="#939AA8" textTransform="uppercase">Balance</Text>
          <Text color="#FF9A2B" fontSize="35" fontWeight="600">$ 10,000</Text>
          <HStack mt="3">
            <View justifyContent='center' w="75" h="75" bgColor="#798293">
                <Center>
                    <FontAwesomeIcon size={18} style={{color: '#FFFFFF'}} icon={faPlus}/>
                    <Text mt="2" fontSize="12" textTransform='uppercase' color="white">Add</Text>
                </Center>
            </View>
            <View justifyContent='center' w="75" h="75" bgColor="#798293" ml="3">
                <Center>
                    <FontAwesomeIcon size={18} style={{color: '#FFFFFF'}} icon={faPaperPlane}/>
                    <Text mt="2" fontSize="12" textTransform='uppercase' color="white">Send </Text>
                </Center>
            </View>
          </HStack>
      </Center>
      <View mt='5' mb='5'>
        {WalletList}
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})