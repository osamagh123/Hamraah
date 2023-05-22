import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Center, Image, ScrollView, Text, View } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

export default function Terms() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
        <ScrollView p='5' bgColor='#252525'>
      <TouchableOpacity onPress={() => {navigation.goBack()}}><Text color='white'>Back</Text></TouchableOpacity>

      <Text mt='5' fontSize="20" color="white">Terms of Service</Text>
      <Center>
          <Image w='140' h='140' mt="10" source={require('../images/settings.png')} alt='image'/>
      </Center>
      <View mt="10" mb="10">
        <Text color='#939AAB' fontSize='12'>Welcome to Hamraah.pk Carpooling App! Please read these terms and conditions carefully before using our services. By using our services, you agree to be bound by these terms and conditions.</Text>
        <Text color='white' fontSize='16' mt='5'>1. Use of Services</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Hamraah.pk provides a carpooling platform that connects drivers and passengers. By using our services, you agree to comply with all applicable laws and regulations.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. Drivers using the Hamraah.pk platform must have a valid driver’s license, insurance, and registration for their vehicle. Passengers must be at least 18 years old and have a valid ID.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>iii. Hamraah.pk is not responsible for any accidents, incidents, or damages that occur during a carpooling ride. All users of the platform assume full responsibility for their actions and any consequences that may result.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>iv. Users must provide accurate and truthful information when using the Hamraah.pk platform. Hamraah.pk reserves the right to suspend or terminate a user’s account if they provide false or misleading information.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>v. Hamraah.pk may, at its discretion, refuse service to anyone for any reason.</Text>
        <Text color='white' fontSize='16' mt='5'>2. Fees and Payment</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Hamraah.pk does not charge any fee for using the carpooling platform. The fees for the ride (e.g. fuel cost, tolls, parking fees) will be agreed upon by the driver and passengers and settled directly between them.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. Users must provide accurate payment information when using the Hamraah.pk platform. Hamraah.pk is not responsible for any charges or fees incurred by a user’s bank or credit card company.</Text>
        <Text color='white' fontSize='16' mt='5'>3. Ratings and Reviews</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Hamraah.pk allows users to rate and review other users after a ride is completed. Ratings and reviews must be truthful and based on the user’s actual experience.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. Hamraah.pk reserves the right to remove ratings and reviews that are deemed to be false, defamatory, or inappropriate.</Text>
        <Text color='white' fontSize='16' mt='5'>4. Dispute Resolution</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Any disputes between users must be resolved between the parties involved. Hamraah.pk is not responsible for resolving disputes between users.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. In the event of a dispute between a user and Hamraah.pk, the dispute shall be resolved through arbitration in accordance with the laws of Pakistan.</Text>
        <Text color='white' fontSize='16' mt='5'>5. Privacy Policy</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Hamraah.pk collects and uses personal information in accordance with its privacy policy, which can be found on the Hamraah.pk website.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. By using the Hamraah.pk platform, users agree to the collection and use of their personal information as described in the privacy policy.</Text>
        <Text color='white' fontSize='16' mt='5'>6. Modifications to Terms and Conditions</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. Hamraah.pk may modify these terms and conditions at any time. Users will be notified of any changes to the terms and conditions via email or through the Hamraah.pk platform.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. Users are responsible for reviewing the updated terms and conditions before using the Hamraah.pk platform.</Text>
        <Text color='white' fontSize='16' mt='5'>7. Governing Law</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>i. These terms and conditions shall be governed by and construed in accordance with the laws of Pakistan.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>ii. Any disputes arising under these terms and conditions shall be subject to the jurisdiction of the courts of Pakistan.</Text>
        <Text color='#939AAB' fontSize='12' mt='5'>By using the Hamraah.pk platform, you agree to be bound by these terms and conditions. If you do not agree with these terms and conditions, please do not use the Hamraah.pk platform.</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})