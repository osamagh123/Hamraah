import { Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState, useEffect , useRef} from 'react'
import { Alert, Button, Center, HStack, Pressable, Slide, Text, View } from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useNavigation } from '@react-navigation/core';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { width } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faLocationDot, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function RequestFrom() {
  const [destinationFrom, setDestinationFrom] =useState('');
  const [status, setStatus] = useState('Search');
  const ref = useRef();
  const [address, setAddress] = useState('');
  const [locate,setLocate] = useState('');
  const [disable,setDisable] = useState(false)
  const windowWidth = Dimensions.get('window').width;

  const [position, setPosition] = useState({
      latitude: 10,
      longitude: 10,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
    useEffect(() => {
      Geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;
        getcurrentlocation(crd.latitude,crd.longitude)
        const lat1 = 25.1575
        const lat2 = 24.6692
        const long1 = 66.8753
        const long2 = 67.3644

        const Lhrlat1 = 31.3
        const Lhrlat2 = 31.6
        const Lhrlong1 = 74.0
        const Lhrlong2 = 74.4

        const Isllat1 = 33.6053
        const Isllat2 =33.8097
        const Isllong1 = 72.9569
        const Isllong2 = 73.2177


        if(crd.latitude > lat2 && crd.latitude < lat1 && crd.longitude > long1 && crd.longitude < long2){
          setDisable(false);
          setLocate('Khi')
          
        }
        else if(crd.latitude > Lhrlat1 && crd.latitude < Lhrlat2 && crd.longitude > Lhrlong1 && crd.longitude < Lhrlong2){
          setDisable(false)
          setLocate('Lhr')
        }
        else if(crd.latitude > Isllat1 && crd.latitude < Isllat2 && crd.longitude > Isllong1 && crd.longitude < Isllong2){
          setDisable(false)
          setLocate('Isl')
        }
        else{
          setDisable(true)
        }

        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
      })
    }, []);
  const GOOGLE_PLACES_API_KEY = 'AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8';
  navigator.geolocation = require('@react-native-community/geolocation')
  const navigation = useNavigation();
  function getcurrentlocation(lat,long){
      Geocoder.init("AIzaSyBMQnyghjPE_FCiEqLRn_eK8VG_1XE8GY8");
      Geocoder.from(lat, long)
      .then(json => {
              var addressComponent = json.results[0].address_components[0];
       setAddress(json.results[0].formatted_address);
       ref.current?.setAddressText(json.results[0].formatted_address);
        setDestinationFrom(json.results[0].formatted_address);
      })
      .catch(error => console.warn(error));
    }
    function getaddress(e){

      const lat1 = 25.1575
      const lat2 = 24.6692
      const long1 = 66.8753
      const long2 = 67.3644

      const Lhrlat1 = 31.3
      const Lhrlat2 = 31.6
      const Lhrlong1 = 74.0
      const Lhrlong2 = 74.4

      const Isllat1 = 33.6053
      const Isllat2 =33.8097
      const Isllong1 = 72.9569
      const Isllong2 = 73.2177

      if(e.latitude > lat2 && e.latitude < lat1 && e.longitude > long1 && e.longitude < long2){
        setDisable(false);
      }
      else if(e.latitude > Lhrlat1 && e.latitude < Lhrlat2 && e.longitude > Lhrlong1 && e.longitude < Lhrlong2){
        setDisable(false)
      }
      else if(e.latitude > Isllat1 && e.latitude < Isllat2 && e.longitude > Isllong1 && e.longitude < Isllong2){
        setDisable(false)
      }
      else{
        setDisable(true)
      }
      getcurrentlocation(e.latitude,e.longitude)
    }


    function Search(){
      console.log(locate,'position')

      let location = ""
      let radius = ""

      if(locate == 'Khi'){
        location='24.9443216,66.9784251'
        radius = '80000'
      }
      if(locate == 'Lhr'){
        location='31.582045,74.329376'
        radius = '80000'
      }

      if(locate == 'Isl'){

        location='33.6938,73.0658'
        radius = '80000'        
      }

      return(
        <View h='100%'>
          <Text mt='5' color='white' textAlign='center' fontSize='24'>Select Destination (From)</Text>
                <View p='5' h='80' overflow='visible'>
                  <HStack>
                  <GooglePlacesAutocomplete
                      ref={ref}
                      placeholder="Search"
                      textInputProps={{
                      placeholderTextColor: 'white',
                      returnKeyType: "search"
                      }}
                      styles={{
                      textInputContainer: {
                          backgroundColor: 'transparent',
                          height:40,
                          color: 'white',
                          fontSize: 12
                      },
                      textInput: {
                          color: 'white',
                          fontSize: 12,
                          backgroundColor: 'transparent',
                          borderWidth: 1,
                          borderColor: '#00AFCD'
                      },
                      listView: {
                          color: 'white',
                          fontSize: 12,
                      },
                      description: {
                          color: 'black',
                          fontSize: 12,
                      }
                      }}
                      query={{
                      key: GOOGLE_PLACES_API_KEY,
                      language: 'en',
                      location: location,
                      radius: radius,
                      components: 'country:pk',
                      strictbounds: true,
                      }}
                      onPress={(data, details = null) => navigation.navigate('Request',{from: data.description})}
                      onFail={(error) => console.error(error)}
                      requestUrl={{
                      url:
                          'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                      useOnPlatform: 'web',
                      }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                      enablePoweredByContainer={false}
                      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                  />
                  <Pressable onPress={()=>{ref.current?.setAddressText(''),setAddress('')}}>
                    <View textAlign='center'><Text mt={Platform.OS === 'ios' ? '5' : '3'} right='5' position='relative' textAlign='center' color='white'><FontAwesomeIcon size={12} style={{color: 'white'}} icon={faClose}/></Text></View>
                  </Pressable>
                  </HStack>
              </View>
              <View style={{position: 'absolute', bottom: 120, alignItems: 'center', width: '100%'}}>
              <Button  w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50' bgColor='transparent' borderWidth='1' borderRadius='8' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}}  onPress={()=>{navigation.navigate('Request',{from: address})}}>
                <Text color='#FFFFFF' fontSize='16'>Continue</Text>
              </Button>
            </View>
        </View>
      )
    }

    function ChooseMap(){
      return(
        <View>
          <Slide in={disable} placement="top">
            <Alert py='6' bgColor='danger.600' justifyContent="center" status="error" safeAreaTop={ Platform.OS === 'ios' ? 8 : 0}>
              <Alert.Icon color='white' />
              <Text color="white" fontWeight="medium">
                Out of Area
              </Text>
            </Alert>
      </Slide>
          {/* {disable ? (<View p='3' bgColor='danger.600'>
            <Text color='white' textAlign='center'>Out of Area</Text>
          </View>) : ''} */}
          <MapView
            style={styles.map}
            initialRegion={position}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            onRegionChangeComplete={(region) => {getaddress(region)}}>
            </MapView>
            <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', zIndex: 999}}>
                <View borderColor='#00AFCD' borderWidth='2' p='2' bgColor='white' h='65' w='70%'>
                  <Text textAlign='center' fontWeight='600' fontSize='10'>{address}</Text>
                </View>
                <Text mt='3' pointerEvents='none'><FontAwesomeIcon size={32} style={{color: 'red'}} icon={faLocationDot}/></Text>
            </View>
            <View style={{position: 'absolute', bottom: 120, alignItems: 'center', width: '100%'}}>
              <Button isDisabled={disable} w={windowWidth >= 500 ? windowWidth/2 : '85%'} h='50'  bgColor='transparent' borderWidth='2' borderRadius='8' borderColor='#00AFCD' _pressed={{backgroundColor: '#00AFCD'}} onPress={()=>{navigation.navigate('Request',{from: address})}}>
                <Text color='#000000' fontSize='16'>Continue</Text>
              </Button>
            </View>
        </View>
      )
    }
return (
    <SafeAreaView>
          <View bgColor='#252525' h='100%'>
            <HStack>
              <Pressable w='50%' borderRightWidth='1' p='3' bgColor='white' onPress={() => {setStatus('Search')}}>
              <View>
                <Center>
                  <Text mt='2'><FontAwesomeIcon icon={faSearch} size={16}  /></Text>
                  <Text>Search</Text>
                </Center>
              </View>
              </Pressable>
              <Pressable w='50%' borderLeftWidth='1' p='3' bgColor='white' onPress={() => {setStatus('Map')}}>
              <View>
                <Center>
                <Text mt='2'><FontAwesomeIcon icon={faLocationDot} size={16}  /></Text>
                  <Text>Choose on Map</Text>
                </Center>
              </View>
              </Pressable>
              
            </HStack>
            { status === 'Search' ? Search() : ChooseMap()}
</View>
    </SafeAreaView>
)
}
const styles = StyleSheet.create({
  map: {
      // ...StyleSheet.absoluteFillObject,
      height:'100%',
      width:'100%'
    },
})