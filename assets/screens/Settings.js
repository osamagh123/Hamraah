import { Linking, SafeAreaView, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import { Button, Center, Divider, HStack, Image, Text, View } from 'native-base'
import { TouchableOpacity, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Settings() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(false);
    const [isEnabled4, setIsEnabled4] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
    const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);
    const navigation = useNavigation();
  return (
   <SafeAreaView>
        <View p='5' bgColor='#252525' h='100%'>
        <TouchableOpacity onPress={() => {navigation.goBack()}}><Text color='white'>Back</Text></TouchableOpacity>
        <Text mt='5' fontSize="20" color="white">Settings</Text>
        <Center>
            <Image w='140' h='140' mt="10" source={require('../images/conditions.png')} alt='image'/>
        </Center>
        <View mt='10' borderRadius='8' bgColor='white' p='2'>
                {/* <HStack p='2' justifyContent='space-between'>
                    <Text py='1'>Traffic on the map</Text>
                    <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"} onValueChange={toggleSwitch} value={isEnabled} />
                </HStack>
                <Divider px='3'/>
                <HStack p='3' justifyContent='space-between'>
                    <Text py='1'>Clear Cache</Text>
                    <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"} onValueChange={toggleSwitch2} value={isEnabled2} />
                </HStack>
                <Divider px='3'/>
                <HStack p='2' justifyContent='space-between'>
                    <Text py='1'>Notification</Text>
                    <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isEnabled3 ? "#f5dd4b" : "#f4f3f4"} onValueChange={toggleSwitch3} value={isEnabled3} />
                </HStack>
                <Divider px='3'/>
                <HStack p='2' justifyContent='space-between'>
                    <Text py='1'>Show driver where I am</Text>
                    <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isEnabled4 ? "#f5dd4b" : "#f4f3f4"} onValueChange={toggleSwitch4} value={isEnabled4} />
                </HStack> */}
                <TouchableOpacity onPress={() => {Linking.openSettings()}}>
                    <Center px='3' py='3'>
                    <HStack w='100%'justifyContent='space-between'>
                        <Text>Turn on/off Notifications</Text>
                        <Text><FontAwesomeIcon size={12} icon={faChevronRight} /></Text>
                    </HStack>
                    </Center>
                </TouchableOpacity>
                <Divider px='3'/>
                <TouchableOpacity onPress={() => {Linking.openSettings()}}>
                    <Center px='3' py='3'>
                    <HStack w='100%'justifyContent='space-between'>
                        <Text>Turn on/off Location</Text>
                        <Text><FontAwesomeIcon size={12} icon={faChevronRight} /></Text>
                    </HStack>
                    </Center>
                </TouchableOpacity>
                {/* <Divider px='3'/> */}
        </View>
    </View>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({})