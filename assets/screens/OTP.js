import { Dimensions, SafeAreaView, StyleSheet} from 'react-native'
import React, { useRef, useState } from 'react';
import { Alert, Box, Button, Center, Image, Input, Modal, ScrollView, Text, View, VStack } from 'native-base'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

  


export default function OTP(props) {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const CELL_COUNT = 6;
    const [value, setValue] = useState('');
    const [alertBox,setAlert] = useState(false)
    const [errormsg, setErrormsg] = useState('');
    const [isDisabled,setDisabled] = useState(false)
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props2, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
    const confirm = props.confirmation
    // const [pno,setPno] = useState('(+1) -202-555-0155')
    const pno = '+92' + confirm.phoneNo;
    const [code, setCode] = useState('');
    const navigation = useNavigation();
    async function confirmCode() {
      setDisabled(true);
      try {
        const confirmation = await confirm.confirmation.confirm(code);
        console.log('success');

            navigation.navigate('Home');
      } catch (error) {
        setAlert(true)
        setErrormsg('OTP is invalid or not found')
        setDisabled(false);
      }
    }

      
  return (
    <SafeAreaView>
      <View p='5' bgColor="#252525" h="100%" >
      <Text onPress={() => {navigation.goBack()}} color='white'>Back</Text>

      <View mt='60' alignItems="center" justifyContent='center'>
        <Image h='220' resizeMode='contain' source={require('../images/login.png')} alt="img"/>
        <Text fontSize="32" color="white" mt="5">Verify Phone Number</Text>
        <Text px="10" textAlign="center" mb="3" color="#939AA8" fontSize="14" fontWeight="400">Check your SMS. We have sent you a PIN at <Text color="#00DAFF">{pno}</Text></Text>
        <View mb='20' style={styles.root}>

            <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                    )}
                />
        </View>
        <Button isDisabled={isDisabled} mt='5' borderRadius='8' w={windowWidth >= 500 ? '50%' : '90%'} h='50' borderWidth='1' borderColor='#00AFCD' bgColor='transparent' mb='2' _pressed={{backgroundColor: '#00AFCD', borderColor: '#00AFCD'}} onPress={() => confirmCode()}>
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
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  cell: {
    width:50,
    height:50,
    lineHeight:55,
    fontSize: 25,
    borderWidth: 1,
    borderColor: '#4C565F',
    textAlign: 'center',
    marginRight: 10,
    color:"white",
    borderRadius:24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusCell: {
    borderColor: '#00AFCD',
  },
})