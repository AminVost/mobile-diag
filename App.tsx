import React, { createContext, useState, useEffect, useRef } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ActivityIndicator, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import NetInfo from '@react-native-community/netinfo';
import { LaunchArguments } from "react-native-launch-arguments";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { storeData } from './storageUtils';
import HomeScreen from './inc/compenents/HomeScreen';
import DeviceInfoScreen from './inc/compenents/DeviceInfoScreen';
import SettingScreen from './inc/compenents/SettingScreen';
import ReportScreen from './inc/compenents/ReportScreen';
import CheckList from './inc/compenents/CheckList';
import Requirements from './inc/compenents/Requirements';
import HelpScreen from './inc/compenents/HelpScreen';
import TestsScreen from './inc/compenents/TestsScreen';

import TouchScreen from './inc/compenents/tests/TouchScreen';
import MultiTouch from './inc/compenents/tests/MultiTouch';
import Display from './inc/compenents/tests/Display';
import Brightness from './inc/compenents/tests/Brightness';
import Rotation from './inc/compenents/tests/Rotation';
import BackCamera from './inc/compenents/tests/BackCamera';
import FrontCamera from './inc/compenents/tests/FrontCamera';
import MultiCamera from './inc/compenents/tests/MultiCamera';
import BackCameraVideo from './inc/compenents/tests/BackCameraVideo';
import NativeCameraPhoto from './inc/compenents/tests/NativeCameraPhoto';
import NativeCameraVideo from './inc/compenents/tests/NativeCameraVideo';
import { formatTime } from './inc/utils/formatTime';

export const DataContext = createContext(false);
export const TimerContext = createContext({});
const Drawer = createDrawerNavigator();

export default function App() {
  // hideNavigationBar();
  const [isInternetConnected, setIsNetConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [receivedSerialNumber, setReceivedSerialNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testStep, setTestStep] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const elapsedTimeRef = useRef(0);

  // const [testSteps, setTestsSteps] = useState([
  //   {
  //     title: 'Display',
  //     text: '',
  //     Modaltext: 'Please select the Display test result',
  //     icon: 'circle-opacity',
  //     showInfoBar: false,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 11,
  //   },
  //   {
  //     title: 'TouchScreen',
  //     text: '',
  //     Modaltext: 'Please select the TouchScreen test result',
  //     icon: 'cellphone',
  //     showInfoBar: false,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 10,
  //   },
  //   {
  //     title: 'Multitouch',
  //     text: '',
  //     icon: 'hand-clap',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 9,
  //   },
  //   {
  //     title: 'Brightness',
  //     text: '',
  //     icon: 'brightness-6',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 8,
  //   },
  //   {
  //     title: 'Rotation',
  //     text: `Please turn on the 'Auto Rotate' feature and rotate your device to check the auto-rotation sensor`,
  //     icon: 'screen-rotation',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 7,
  //   },
  //   {
  //     title: 'BackCamera',
  //     text: '',
  //     icon: 'camera-rear-variant',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     filePath: null,
  //     error: null,
  //     duration: null,
  //     priority: 4,
  //   },
  //   {
  //     title: 'FrontCamera',
  //     text: '',
  //     icon: 'camera-front-variant',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     filePath: null,
  //     error: null,
  //     duration: null,
  //     priority: 5,
  //   },
  //   {
  //     title: 'MultiCamera',
  //     text: '',
  //     icon: 'camera-flip-outline',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     multiCamResult: [],
  //     devicesInfo: null,
  //     error: null,
  //     duration: null,
  //     priority: 6,
  //   },
  //   {
  //     title: 'BackCameraVideo',
  //     text: '',
  //     icon: 'video-outline',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     filePath: null,
  //     error: null,
  //     duration: null,
  //     priority: 1,
  //   },
  //   {
  //     title: 'NativeCameraVideo',
  //     text: '',
  //     icon: 'video-check-outline',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     error: null,
  //     duration: null,
  //     priority: 2,
  //   },
  //   {
  //     title: 'NativeCameraPhoto',
  //     text: '',
  //     icon: 'camera-enhance',
  //     showInfoBar: true,
  //     showTimer: true,
  //     showStepTitle: true,
  //     showProgress: true,
  //     result: null,
  //     filePath: null,
  //     error: null,
  //     duration: null,
  //     priority: 3,
  //   },
  // ]);

  const [testSteps, setTestsSteps] = useState([
    {
      title: 'BackCamera',
      text: '',
      icon: 'camera-rear-variant',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 1,
    },
    {
      title: 'FrontCamera',
      text: '',
      icon: 'camera-front-variant',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 2,
    },
    {
      title: 'MultiCamera',
      text: '',
      icon: 'camera-flip-outline',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      multiCamResult: [],
      devicesInfo: null,
      error: null,
      duration: null,
      priority: 3,
    },
    {
      title: 'BackCameraVideo',
      text: '',
      icon: 'video-outline',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 4,
    },
    {
      title: 'NativeCameraVideo',
      text: '',
      icon: 'video-check-outline',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      error: null,
      duration: null,
      priority: 5,
    },
    {
      title: 'NativeCameraPhoto',
      text: '',
      icon: 'camera-enhance',
      showInfoBar: true,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 6,
    },
  ]);



  interface MyExpectedArgs {
    serialNumber?: string;
    wsIp?: string;
  }

  const paramss = LaunchArguments.value<MyExpectedArgs>();
  const paramsTest = { "wsIp": "192.168.1.22", "serialNumber": "R58M42HXCZW" };//TODO

  useEffect(() => {
    if (paramsTest) {
      storeData(paramsTest);
      if (paramsTest.serialNumber) {
        // const serialNumber = paramsTest?.serialNumber;
        setReceivedSerialNumber(paramsTest.serialNumber);
      } else {
        console.log('serial number is Undefiend')
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetConnected(state.isConnected);
    })
    return () => unsubscribe();
  }, []);


  // useEffect(() => {
  //   let ws;
  //   const wsPort = '3655';
  //   if (!websocketConnected) {
  //     const connectWebSocket = () => {
  //       if (paramsTest.wsIp) {
  //         const wsUrl = 'ws://' + paramsTest?.wsIp + ':' + wsPort; // WebSocket server URL
  //         ws = new WebSocket(wsUrl);

  //         ws.onopen = () => {
  //           setWebsocketConnected(true);
  //           console.log('WebSocket connected');
  //         };

  //         ws.onmessage = (event) => {
  //           console.log('Received message:', event.data);
  //         };

  //         ws.onerror = (error) => {
  //           setWebsocketConnected(false);
  //           console.log('WebSocket error:', error.message);
  //         };

  //         ws.onclose = () => {
  //           setWebsocketConnected(false);
  //           console.log('WebSocket closed');
  //           //Auto Recconect
  //           setTimeout(connectWebSocket, 2000);
  //         };
  //       } else {
  //         Alert.alert('Ws Url not Defined.');
  //         return;
  //       }
  //     };

  //     if (!websocketConnected) {
  //       connectWebSocket();
  //     }

  //     return () => {
  //       if (ws) {
  //         ws.close();
  //       }
  //     };
  //   }else{
  //     console.log('webSocket Already Connected.')
  //   }
  // }, [isInternetConnected]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);

  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.loaderLogo}
        />
        <ActivityIndicator size="large" color="#4908b0" />
      </View>
    );
  }


  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image
            source={require('./assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  const ReportHeader = () => {
    return (
      <View style={styles.headerRightContainer}>
        <Text style={styles.headerRightText}>{formatTime(elapsedTimeRef.current)}</Text>
      </View>
    );
  };


  return (

    // <DataContext.Provider value={{ isInternetConnected, setIsNetConnected, websocketConnected, setWebsocketConnected, receivedSerialNumber, testStep, setTestStep, testSteps, setTestsSteps, elapsedTime, setElapsedTime }}>
    <PaperProvider>
      <DataContext.Provider value={{ isInternetConnected, setIsNetConnected, websocketConnected, setWebsocketConnected, receivedSerialNumber, testStep, setTestStep, testSteps, setTestsSteps }}>
        <TimerContext.Provider value={{ startTime, setStartTime, elapsedTimeRef }}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                  drawerActiveBackgroundColor: '#4908b0',
                  drawerActiveTintColor: "white",
                  drawerType: 'back',
                  drawerStyle: { width: '70%' },
                  overlayColor: 'transparent',
                }}
              >
                {/* <Drawer.Screen name="ScanQrCode" component={ScanQrCode} options={{ headerShown: false }} /> */}
                <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false, unmountOnBlur: true }} />
                <Drawer.Screen name="DeviceInfo" component={DeviceInfoScreen} />
                <Drawer.Screen name="Setting" component={SettingScreen} />
                <Drawer.Screen name="Report" component={ReportScreen} />
                <Drawer.Screen name="CheckList" component={CheckList} />
                <Drawer.Screen name="Requirements" component={Requirements} />
                <Drawer.Screen name="Help" component={HelpScreen} />
                <Drawer.Screen name="TouchScreen" component={TouchScreen} options={{ title: 'TouchScreen', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="MultiTouch" component={MultiTouch} options={{ title: 'MultiTouch', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="Display" component={Display} options={{ title: 'Display', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="Brightness" component={Brightness} options={{ title: 'Brightness', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="Rotation" component={Rotation} options={{ title: 'Rotation', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="BackCamera" component={BackCamera} options={{ title: 'BackCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="FrontCamera" component={FrontCamera} options={{ title: 'FrontCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="MultiCamera" component={MultiCamera} options={{ title: 'MultiCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="BackCameraVideo" component={BackCameraVideo} options={{ title: 'BackCameraVideo', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="NativeCameraPhoto" component={NativeCameraPhoto} options={{ title: 'NativeCameraPhoto', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="NativeCameraVideo" component={NativeCameraVideo} options={{ title: 'NativeCameraVideo', headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
                <Drawer.Screen name="TestsScreen" component={TestsScreen} options={{
                  drawerLabel: () => null,
                  headerShown: false
                }} />
              </Drawer.Navigator>

            </NavigationContainer>
          </SafeAreaProvider>
        </TimerContext.Provider>
      </DataContext.Provider >
    </PaperProvider>

  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  logo: {
    width: 200,
    height: 70,
    resizeMode: 'contain',
  },
  loaderLogo: {
    width: 300,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 5
  },
  loadingContainer: {
    backgroundColor: 'white',
    flex: 1,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerRightContainer: {
    marginRight: 10,
  },
  headerRightText: {
    fontSize: 16,
    color: '#000',
  },
})