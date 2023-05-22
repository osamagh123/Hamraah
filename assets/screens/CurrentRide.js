import { BackHandler, Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useCallback } from 'react'
import { Badge, Divider, FlatList, HStack, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
import { useFocusEffect } from '@react-navigation/core'


export default function CurrentRide() {
    const windowWidth = Dimensions.get('window').width - 40 ;

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

    const data= [
        {
            from: '9 Grand Road Zionsville, IN 46077',
            to: '56 Madison Dr. Romulus, MI 48174',
            passenger: ['Rhoda', 'Lynn', 'Manuel'],
            date: '22 June',
            time: '10:30pm',
            car: 'Hatchback Tata Altroz',
            status: 'Ongoing',
        },
    ]

    const renderItem = ({item}) => {

        return(
            <View bgColor="white" p="2" m="2">
                <HStack mb="3" justifyContent="space-between">
                    <View borderLeftWidth="1" pl="3" ml="3" borderLeftColor="#BDC4D0">
                        <Text fontSize="12" color="#4C565F">{item.from}</Text>
                        <Text fontSize="12" mt="5" color="#4C565F">{item.to}</Text>
                    </View>
                    <View>
                        <Text textAlign="right">...</Text>
                    </View>
                </HStack>
                <Divider/>
                <HStack mt="5" mb="5" w={windowWidth} justifyContent="space-between">
                    <HStack>
                        <View>
                            <HStack>
                            {
                                        item.passenger.map((passengers, index)=>(
                                            <View mr="2" alignItems="center" key={index}>
                                                <View bgColor="#322F2F" w="6" h="6" borderRadius="50"></View>
                                                <Text fontSize="12" mt="1" textTransform="capitalize" color="#939AA8">{passengers}</Text>
                                            </View>
                                        ))
                                    }
                            </HStack>
                        </View>
                        <View bgColor="#13CF97" w="6" h="6" borderRadius="50" justifyContent="center" mr="2">
                            <View justifyContent="center" alignItems="center" textAlign="center">
                                <FontAwesomeIcon size={12} style={{color:"white"}}  icon={ faComments } />
                            </View>
                        </View>
                    </HStack>
                    <View>
                        <Text color="#939AA8" textAlign="right" fontSize="10" fontWeight="600">{item.date} {item.time}</Text>
                        <Text color="#939AA8" fontSize="10" textAlign="right" fontWeight="600">{item.car}</Text>
                        <View justifyContent='flex-end' alignItems='flex-end' textAlign="right" fontSize="10" mt="1">
                            <Badge colorScheme="info"><Text fontSize="10">{item.status}</Text></Badge>
                        </View>
                    </View>
                </HStack>
            </View>
        )
    }
  return (
    <SafeAreaView>
        <View mt="5">
      <View>
          <FlatList data={data} renderItem={renderItem}/>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})