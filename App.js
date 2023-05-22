import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Box, Text, AlertDialog, Slide, Alert } from "native-base";
import { Platform, SafeAreaView, ToastAndroid } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useNetInfo } from "@react-native-community/netinfo";
import NetInfo from "@react-native-community/netinfo";
import Main from "./assets/stack/Main";

export default function App() {
  const netInfo = useNetInfo();
  const [isOpenTop, setIsOpenTop] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      if (state.type == "none") {
        setIsOpenTop(true);
        setIsConnected(false);
      } else {
        setIsOpenTop(false);
        setIsConnected(true);
      }
      console.log("Is connected?", state.isConnected);
    });

    const interval = setInterval(() => {
      SplashScreen.hide();
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      // reload the page when the connection is restored
    }
  }, [isConnected]);

  return (
    <NativeBaseProvider>
      <Slide in={isOpenTop} placement="top">
        <Alert bgColor='danger.600' justifyContent="center" status="error" safeAreaTop={ Platform.OS === 'ios' ? 8 : 0}>
          <Alert.Icon color='white' />
          <Text color="white" fontWeight="medium">
            No Internet Connection
          </Text>
        </Alert>
      </Slide>
      <Main />
    </NativeBaseProvider>
  );
}
