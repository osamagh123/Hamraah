import * as React from 'react';
import { View , Platform, Dimensions} from 'react-native';
import {ScrollView, Center,Text, Button, Image} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoarding from '../screens/OnBoarding'
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import ForgotPassword from '../screens/ForgotPassword';
import VerifyEmail from '../screens/VerifyEmail';
import EditProfile from '../screens/EditProfile';
import Gender from '../screens/Gender';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OnBoard from '../screens/OnBoard';
import Chat from '../screens/Chat';
import Wallet from '../screens/Wallet';
import Profile from '../screens/Profile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CurrentRide from '../screens/CurrentRide';
import RideHistory from '../screens/RideHistory';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCar, faCircleQuestion, faClockRotateLeft, faComments, faHouse, faSearch, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import ConsumerRide from '../screens/ConsumerRide';
import Find from '../screens/Find';
import RiderMyRide from '../screens/RiderMyRide';
import MyRide from '../screens/MyRide';
import RiderReport from '../screens/RiderReport';
import Terms from '../screens/Terms';
import Settings from '../screens/Settings';
import RideStarted from '../screens/RideStarted';
import ConsumerRideStarted from '../screens/ConsumerRideStarted';
import Report from '../screens/Report';
import FindCar from '../screens/FindCar';
import CarRequests from '../screens/CarRequests';
import CarMyRide from '../screens/CarMyRide';
import RatingScreen from '../screens/RatingScreen';
import RateRide from '../screens/RateRide';
import Rate from '../screens/Rate';
import Waiting from '../screens/Waiting';
import Test from '../screens/Test';
import First from '../screens/First';
import Offer from '../screens/Offer';
import Request from '../screens/Request';
import SingleChat from '../screens/SingleChat';
import From from '../screens/From';
import To from '../screens/To';
import RequestFrom from '../screens/RequestFrom';
import RequestTo from '../screens/RequestTo';
import RiderSingleChat from '../screens/RiderSingleChat';
import Ongoing from '../screens/Ongoing';
import RiderOngoing from '../screens/RiderOngoing';
import CarOngoing from '../screens/CarOngoing';
import NewProfile from '../screens/NewProfile';
import Scheduled from '../screens/Scheduled';
import Account from '../screens/Account';
import Faqs from '../screens/Faqs';
import ChangePassword from '../screens/ChangePassword';
import ScheduledFrom from '../screens/ScheduledFrom';
import ScheduledTo from '../screens/ScheduledTo';
import ScheduledConsumer from '../screens/ScheduledConsumer';
import Phone from '../screens/Phone';
import OTP from '../screens/OTP';
import NewProfilePhone from '../screens/NewProfilePhone';

function OnboardingScreen() {
  return (
    <OnBoarding/>
  );
}

function LoginScreen() {
    return (
      <Login/>
    );
  }

  function SignupScreen() {
    return (
      <Signup/>
    );
  }

  function ForgotPasswordScreen(){
      return(
          <ForgotPassword/>
      )
  }

  function OnBoardScreen(){
    return(
      <OnBoard/>
    )
  }

  function ChatScreen(){
    return(
      <Chat/>
    )
  }

  function WalletScreen(){
    return(
      <Wallet/>
    )
  }

  function FaqsScreen(){
    return(
      <Faqs/>
    )
  }

  function ProfileScreen(){
    return(
      <Profile/>
    )
  }
 
  function CurrentRideScreen(){
    return(
      <CurrentRide/>
    )
  }

  function RideHistoryScreen(){
    return(
      <RideHistory/>
    )
  }

  function FirstScreen(){
    return(
      <First/>
    )
  }


  const Tab = createBottomTabNavigator();
  const TopTab = createMaterialTopTabNavigator();

  function TopTabs(){
    return(
            <TopTab.Navigator screenOptions={{  
            tabBarLabelStyle: { fontSize: 12, textTransform:'capitalize', backgroundColor: '#798293', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 22, color: 'white', fontWeight: '600' },
            tabBarStyle: {marginHorizontal:40, marginTop:20,  backgroundColor:'transparent', shadow: '0'}}}> 
                <TopTab.Screen name="CurrentRide" component={CurrentRideScreen} options={{ tabBarLabel: 'Current Ride' }} />
                <TopTab.Screen name="RideHistory" component={RideHistoryScreen} options={{ tabBarLabel: 'Ride History' }} />
            </TopTab.Navigator>
    )
}

  function HomeScreen(){

    const isIphoneX = Platform.OS === 'ios' && (Dimensions.get('window').height > 800 || Dimensions.get('window').width > 800) ? true : Platform.OS === 'android' ? true : false;
      return(
        <Tab.Navigator initialRouteName='First' screenOptions={{tabBarStyle: { backgroundColor: '#31373E',  height: Platform.OS === 'ios' ? 90 : 70 }, tabBarShowLabel:false, tabBarActiveTintColor: '#00AFCD', tabBarInactiveTintColor: '#FFFFFF'}}
        >
        <Tab.Screen name="First" component={FirstScreen}  options={{headerShown: false, tabBarIcon: ({color,size}) => (
            <View style={{backgroundColor: '#31373E'}}>
                {/* <Image h='36' resizeMode='contain' source={require('../images/bottom-1.png')} alt='first' /> */}
                <FontAwesomeIcon style={{color: color}} size={24} icon={faHouse}/>
            </View>
        )}} />
        <Tab.Screen name="RideHistory" component={RideHistoryScreen} options={{headerShown:false ,  tabBarIcon: ({color,size}) => (
            <View style={{backgroundColor: '#31373E'}}>
                {/* <Image h='36' resizeMode='contain' source={require('../images/bottom-2.png')} alt='first' /> */}
                <FontAwesomeIcon style={{color: color}} size={24} icon={faClockRotateLeft}/>
            </View>
        )}}/>

        {/* <Tab.Screen name="First" component={FirstScreen} options={{headerShown:false ,  tabBarIcon: ({color,size}) => (
            <View style={{ position:'absolute', bottom:isIphoneX ? 35 : 65, height:50,width: 50, borderRadius:68, justifyContent:'center', alignItems: 'center', zIndex: 3, backgroundColor: '#798293'}}>
                <FontAwesomeIcon size={14} style={{color:"#D8DEE5"}}  icon={ faSearch } />
            </View>
        )}}/> */}
        <Tab.Screen name="Faqs" component={FaqsScreen} options={{headerShown:false,  tabBarIcon: ({color,size}) => (
            <View style={{backgroundColor: '#31373E'}}>
                {/* <Image h='36' resizeMode='contain' source={require('../images/bottom-3.png')} alt='first' /> */}
                <FontAwesomeIcon style={{color: color}} size={24} icon={faCircleQuestion}/>
            </View>
        ) }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown:false,  tabBarIcon: ({color,size}) => (
            <View style={{backgroundColor: '#31373E'}}>
                {/* <Image h='36' resizeMode='contain' source={require('../images/bottom-4.png')} alt='first' /> */}
                <FontAwesomeIcon style={{color: color}} size={24} icon={faUser}/>

            </View>
        ) }}/>
    </Tab.Navigator>
      );
  }

  function VerifyEmailScreen({route,navigation}){
      const mail= route.params;
      return(
          <VerifyEmail mail={mail.email}/>
      );
  }

  function EditProfileScreen(){
    return(
      <EditProfile/>
    )
  }

  function NewProfileScreen(){
    return(
      <NewProfile/>
    )
  }

  function NewProfilePhoneScreen(){
    return(
      <NewProfilePhone/>
    )
  }

  function GenderScreen(){
    return(
      <Gender/>
    )
  }

  function ConsumerRideScreen(){
    return(
      <ConsumerRide/>
    )
  }

  function ScheduledConsumerScreen(){
    return(
      <ScheduledConsumer/>
    )
  }

  function FindScreen() {
    return(
      <Find/>
    )
  }
  
  function FindCarScreen() {
    return(
      <FindCar/>
    )
  }

  function RiderMyRideScreen(){
    return(
      <RiderMyRide/>
    )
  }

  function MyRideScreen(){
    return(
      <MyRide/>
    )
  }

  function ReportScreen({route,navigation}){
    const idkey = route.params;
    return(
       <Report RiderKey={idkey}/>
    )
}

function RiderReportScreen({route,navigation}){
    const idkey = route.params;
    return(
        <RiderReport RiderKey={idkey}/>
    )
}

function RateRideScreen({route,navigation}){
  const idkey = route.params;
  console.log(idkey);
  return(
      <RateRide RiderKey={idkey}/>
  )
}

function TermsScreen(){
  return(
    <Terms/>
  )
}

function SettingsScreen(){
  return(
    <Settings/>
  )
}

function RideStartedScreen(){
  return(
    <RideStarted/>
  )
}

function ConsumerRideStartedScreen({route, navigation}){
  const rideKey = route.params
  return(
    <ConsumerRideStarted rideKey={rideKey}/>
  )
}

function CarRequestsScreen(){
  return(
    <CarRequests/>
  )
}

function CarMyRideScreen(){
  return(
    <CarMyRide/>
  )
}

function RatingsScreen(){
  return(
    <RatingScreen/>
  )
}

function RateScreen(){
  return(
    <Rate/>
  )
}

function WaitingScreen(){
  return(
    <Waiting/>
  )
}

function ChangePasswordScreen(){
  return(
    <ChangePassword/>
  )
}

function OfferScreen({route,navigation}){
  const destination = route.params;
  const [destinationFrom, setDestinationFrom] = React.useState('');
  const [destinationTo, setDestinationTo] = React.useState('');


  React.useEffect(() => {
    if(destination){
      if(destination.from){
        setDestinationFrom(destination.from);
      }
      else if (destination.to){
        setDestinationTo(destination.to);
      }
    }
  }, [destination]);
  return(
    <Offer From={destinationFrom} To={destinationTo}/>
  )
}

function RequestScreen({route,navigation}){
  const destination = route.params;
  const [destinationFrom, setDestinationFrom] = React.useState('');
  const [destinationTo, setDestinationTo] = React.useState('');
  
  React.useEffect(() => {
    if(destination){
      if(destination.from){
        setDestinationFrom(destination.from);
      }
      else if (destination.to){
        setDestinationTo(destination.to);
      }
    }
  }, [destination]);
  
  return(
    <Request From={destinationFrom} To={destinationTo}/>
  )
}

function SingleChatScreen({route,navigation}){
  const rideKey = route.params;
  return(
    <SingleChat rideKey={rideKey}/>
  )
}

function RiderSingleChatScreen({route, navigation}){
  const consId = route.params;
  return(
    <RiderSingleChat ConsumerId={consId.consumerId}/>
  )
}



function FromScreen(){
  return(
    <From/>
  )
}

function ToScreen(){
  return(
    <To/>
  )
}

function RequestFromScreen(){
  return(
    <RequestFrom/>
  )
}

function RequestToScreen(){
  return(
    <RequestTo/>
  )
}

function OngoingScreen(){
  return(
    <Ongoing/>
  )
}

function CarOngoingScreen(){
  return(
    <CarOngoing/>
  )
}

function RiderOngoingScreen(){
  return(
    <RiderOngoing/>
  )
}

function ScheduledScreen({route,navigation}){
  const destination = route.params;
  const [destinationFrom, setDestinationFrom] = React.useState('');
  const [destinationTo, setDestinationTo] = React.useState('');


  React.useEffect(() => {
    if(destination){
      if(destination.from){
        setDestinationFrom(destination.from);
      }
      else if (destination.to){
        setDestinationTo(destination.to);
      }
    }
  }, [destination]);
  return(
    <Scheduled From={destinationFrom} To={destinationTo}/>
  )
}

function ScheduledFromScreen(){
  return(
    <ScheduledFrom/>
  )
}

function ScheduledToScreen(){
  return(
    <ScheduledTo/>
  )
}

function AccountScreen(){
  return(
    <Account/>
  )
}
function PhoneScreen(){
  return(
    <Phone/>
  )
}

function OTPScreen({route,navigation}){
  const confirmation = route.params
  console.log(confirmation)
  return(
    <OTP confirmation={confirmation}/>
  )
}

const Stack = createNativeStackNavigator();

function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Test" component={TestScreen} options={{headerShown: false}}/> */}
        {/* <Stack.Screen name="RatingScreen" component={RatingsScreen} options={{headerShown: false}}/> */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown:false}}/>
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="NewProfile" component={NewProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="NewProfilePhone" component={NewProfilePhoneScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Gender" component={GenderScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ConsumerRide" component={ConsumerRideScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Find" component={FindScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RiderMyRide" component={RiderMyRideScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RiderOngoing" component={RiderOngoingScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Ongoing" component={OngoingScreen} options={{headerShown:false}}/>
        <Stack.Screen name="CarOngoing" component={CarOngoingScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MyRide" component={MyRideScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Report" component={ReportScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RiderReport" component={RiderReportScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RateRide" component={RateRideScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Terms" component={TermsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RideStarted" component={RideStartedScreen} options={{headerShown:false, unmountOnBlur: true}}/>
        <Stack.Screen name="ConsumerRideStarted" component={ConsumerRideStartedScreen} options={{headerShown:false, unmountOnBlur: true}}/>
        <Stack.Screen name="FindCar" component={FindCarScreen} options={{headerShown:false}}/>
        <Stack.Screen name="CarRequests" component={CarRequestsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="CarMyRide" component={CarMyRideScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Rate" component={RateScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Waiting" component={WaitingScreen} options={{headerShown: false}}/>
        <Stack.Screen name="OnBoard" component={OnBoardScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Offer" component={OfferScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Request" component={RequestScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SingleChat" component={SingleChatScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RiderSingleChat" component={RiderSingleChatScreen} options={{headerShown: false}}/>
        <Stack.Screen name="From" component={FromScreen} options={{headerShown: false}}/>
        <Stack.Screen name="To" component={ToScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ScheduledFrom" component={ScheduledFromScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RequestFrom" component={RequestFromScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RequestTo" component={RequestToScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ScheduledTo" component={ScheduledToScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Scheduled" component={ScheduledScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Account" component={AccountScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ScheduledConsumer" component={ScheduledConsumerScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Phone" component={PhoneScreen} options={{headerShown: false}}/>
        <Stack.Screen name="OTP" component={OTPScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;