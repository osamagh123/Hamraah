import { Platform, SafeAreaView, StyleSheet, UIManager} from 'react-native'
import React, { useEffect } from 'react'
import { ScrollView, Text, View } from 'native-base'
import { AccordionList } from 'react-native-accordion-list-view';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Faqs() {
    const data = [
        {
            id: 0,
            title: 'What is Hamraah?',
            body: "Hamraah is a mobile application that connects drivers and passengers for carpooling purposes.",
        },
        {
            id: 1,
            title: 'How does Hamraah work?',
            body: "Drivers can post their route and schedule on the app, and passengers can search for available rides that match their needs. Once a ride is confirmed, the driver and passenger can communicate via the app to coordinate pick-up and drop-off details.",
        },
        {
            id: 2,
            title: 'Is Hamraah safe?',
            body: 'Hamraah takes safety seriously and provides various safety features such as rating system, and in-app communication. However, it’s important for users to exercise caution and common sense when using the app.',
        },
        {
            id: 3,
            title: 'How much does it cost to use Hamraah?',
            body: 'Hamraah is free to use, but drivers and passengers can agree on a fee to split the cost of the ride. Hamraah does not take a commission from these fees.',
        },
        {
            id: 4,
            title: 'What if I need to cancel a ride?',
            body: 'Both drivers and passengers can cancel a ride, but it’s important to do so as soon as possible to avoid inconvenience for the other party. The app also provides guidelines for canceling a ride.',
        },
        {
            id: 5,
            title: 'What if I have a problem with a driver or passenger?',
            body: 'Hamraah has a support team that can help resolve issues between users. Users can also rate each other after a ride, which helps maintain accountability and improve the community.',
        },
        {
            id: 6,
            title: 'How can I trust the driver or passenger?',
            body: 'Hamraah provides user verification and encourages users to provide information such as their name, profile photo, and contact information. Users can also rate each other after a ride, which helps maintain accountability and improve the community.',
        },
        {
            id: 7,
            title: 'Can I use Hamraah for long-distance rides?',
            body: 'Yes, Hamraah can be used for both short and long-distance rides. However, it’s important for users to communicate their needs and expectations with each other before agreeing to a ride.',
        }
    ];
    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);
  return (
    <SafeAreaView>
      <ScrollView h='100%' bgColor='#252525' p='5'>
      <Text textAlign='center' fontSize='32' mb='5' color='white'>Frequently Asked Questions (FAQs)</Text>
      <AccordionList 
                    containerItemStyle={{backgroundColor: '#00AFCD'}}
                    data={data}
                    customTitle={item => <Text color='white' p='2'>{item.title}</Text>}
                    customBody={item => <Text color='white' px='2' mt='2'>{item.body}</Text>}
                    customIcon={item => <Text> <FontAwesomeIcon style={{color: 'black'}} size={12} icon={faChevronRight}/> </Text>}
                    animationDuration={400}
                    expandMultiple={false}
                />
                <View mt='10'></View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingVertical: '2%',
      paddingHorizontal: '3%',
      height: '100%',
      backgroundColor: '#e7e7e7',
    },
  });