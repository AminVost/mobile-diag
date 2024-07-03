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
import { storageTestSteps } from './storageTestSteps';
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

export const DataContext = createContext(false);
export const TimerContext = createContext({});
const Drawer = createDrawerNavigator();

export default function App() {
  // hideNavigationBar();
  const [isInternetConnected, setIsNetConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [receivedSerialNumber, setReceivedSerialNumber] = useState(null);
  const [isDiagStart, setIsDiagStart] = useState(false);
  const [isSubmitResult, setIsSubmitResult] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testStep, setTestStep] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [startContinue, setStartContinue] = useState(false);
  const [isFinishedTests, setIsFinishedTests] = useState(false);
  const elapsedTimeRef = useRef(0);
  
  interface MyExpectedArgs {
    wsIp?: string;
    serialNumber?: string;
    token?: string;
  }
  const paramss = LaunchArguments.value<MyExpectedArgs>();
  // const paramsTest = { "wsIp": "192.168.1.22", "serialNumber": "R58M42HXCZW", "token": "9259af73-c1da-4786-aa6b-c4a788525889" };//TODO
  
  console.log('paramss' , paramss);

  useEffect(() => {
    if (paramss) {
      storeData(paramss);
      if (paramss.serialNumber) {
        // const serialNumber = paramss?.serialNumber;
        setReceivedSerialNumber(paramss.serialNumber);
      } else {
        console.log('serial number is Undefiend')
      }
      if (paramss.token) {
        // const serialNumber = paramss?.serialNumber;
        setToken(paramss.token);
      } else {
        console.log('serial number is Undefiend')
      }
    }
  }, [paramss]);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetConnected(state.isConnected);
    })
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    let ws;
    const wsPort = '2552';
    if (!websocketConnected) {
      const connectWebSocket = () => {
        if (paramss.wsIp) {
          const wsUrl = 'ws://' + paramss?.wsIp + ':' + wsPort + '?uuid=' + receivedSerialNumber; // WebSocket server URL
          console.log('wsUrl' , wsUrl)
          ws = new WebSocket(wsUrl);

          ws.onopen = () => {
            setWebsocketConnected(true);
            console.log('WebSocket connected');
          };

          ws.onmessage = (event) => {
            console.log('Received message:', event.data);
          };

          ws.onerror = (error) => {
            setWebsocketConnected(false);
            console.log('WebSocket error:', error?.message);
          };

          ws.onclose = (msg) => {
            setWebsocketConnected(false);
            console.log('WebSocket closed' , msg?.message);
            //Auto Recconect
            // setTimeout(connectWebSocket, 2000);
          };
        } else {
          Alert.alert('Ws Url not Defined.');
          return;
        }
      };

      if (!websocketConnected) {
        connectWebSocket();
      }

      return () => {
        if (ws) {
          ws.close();
        }
      };
    } else {
      console.log('webSocket Already Connected.')
    }
  }, [isInternetConnected]);


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
  //     priority: 1,
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
  //     priority: 2,
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
  //     priority: 3,
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
  //     priority: 4,
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
  //     priority: 5,
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
  //     fileItem: {
  //       ext: "jpg",
  //       base64: null,
  //       filePath: null,
  //     },
  //     error: null,
  //     duration: null,
  //     priority: 6,
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
  //     fileItem: {
  //       ext: "jpg",
  //       base64: null,
  //       filePath: null,
  //     },
  //     error: null,
  //     duration: null,
  //     priority: 7,
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
  //     priority: 8,
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
  //     priority: 9,
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
  //     priority: 10,
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
  //     fileItem: {
  //       ext: "jpg",
  //       base64: null,
  //       filePath: null,
  //     },
  //     error: null,
  //     duration: null,
  //     priority: 11,
  //   },
  // ]);


  const [testSteps, setTestsSteps] = useState([
    {
      title: 'Rotation',
      text: `Please turn on the 'Auto Rotate' feature and rotate your device to check the auto-rotation sensor`,
      icon: 'screen-rotation',
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
      title: 'Display',
      text: '',
      Modaltext: 'Please select the Display test result',
      icon: 'circle-opacity',
      showInfoBar: false,
      showTimer: true,
      showStepTitle: true,
      showProgress: true,
      result: null,
      error: null,
      duration: null,
      priority: 1,
    },
    // {
    //   title: 'NativeCameraPhoto',
    //   text: '',
    //   icon: 'camera-enhance',
    //   showInfoBar: true,
    //   showTimer: true,
    //   showStepTitle: true,
    //   showProgress: true,
    //   result: null,
    //   fileItem: {
    //     ext: "jpg",
    //     base64: null,
    //     filePath: null,
    //   },
    //   error: null,
    //   duration: null,
    //   priority: 2,
    // },
    // {
    //   title: 'BackCamera',
    //   text: '',
    //   icon: 'camera-rear-variant',
    //   showInfoBar: true,
    //   showTimer: true,
    //   showStepTitle: true,
    //   showProgress: true,
    //   result: null,
    //   fileItem: {
    //     ext: "jpg",
    //     base64: null,
    //     filePath: null,
    //   },
    //   error: null,
    //   duration: null,
    //   priority: 1,
    // },
    // {
    //   title: 'FrontCamera',
    //   text: '',
    //   icon: 'camera-front-variant',
    //   showInfoBar: true,
    //   showTimer: true,
    //   showStepTitle: true,
    //   showProgress: true,
    //   result: null,
    //   fileItem: {
    //     ext: "jpg",
    //     base64: null,
    //     filePath: null,
    //   },
    //   error: null,
    //   duration: null,
    //   priority: 3,
    // },
    // {
    //   title: 'MultiCamera',
    //   text: '',
    //   icon: 'camera-flip-outline',
    //   showInfoBar: true,
    //   showTimer: true,
    //   showStepTitle: true,
    //   showProgress: true,
    //   result: null,
    //   multiCamResult: [],
    //   devicesInfo: null,
    //   error: null,
    //   duration: null,
    //   priority: 4,
    // },
  ]);


  const [deviceDetails, setDeviceDetails] = useState({
    brand: DeviceInfo.getBrand(),
    deviceName: '',
    hardWare: '',
    imei: '',
    manufacturer: '',
    meid: '',
    model: '',
    os: Platform.OS,
    osVersion: '',
    serialNumber: '',
    storage_layouts: [],
    memory_layouts: [],
    cpu: [{
      architecture: '', // Start with an empty string to accumulate architectures
      model: ''
    }],
    phoneNumber: '',
  });

  useEffect(() => {
    storageTestSteps(testSteps);
  }, []);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const [
          device,
          hardWare,
          manufacturer,
          model,
          osVersion,
          storage,
          memory,
          abis,
          usedMemory,
          freeStorage,
          phoneNumber,
        ] = await Promise.all([
          DeviceInfo.getDevice(),
          DeviceInfo.getHardware(),
          DeviceInfo.getManufacturer(),
          DeviceInfo.getModel(),
          DeviceInfo.getSystemVersion(),
          DeviceInfo.getTotalDiskCapacity(),
          DeviceInfo.getTotalMemory(),
          DeviceInfo.supportedAbis(),
          DeviceInfo.getUsedMemory(),
          DeviceInfo.getFreeDiskStorage(),
          DeviceInfo.getPhoneNumber(),
        ]);

        // Combine supported ABIs into a comma-separated string
        const cpuArchitectures = abis.join(', ');

        const updatedDeviceDetails = {
          brand: DeviceInfo.getBrand(),
          deviceName: device,
          hardWare: hardWare,
          imei: '',
          manufacturer: manufacturer,
          meid: '',
          model: model,
          os: Platform.OS,
          osVersion: osVersion,
          serialNumber: 'receivedSerialNumber', // Adjust if you can fetch the actual serial number
          storage_layouts: [{
            size: (storage / (1024 ** 3)).toFixed(2), // Convert bytes to GB
            freeStorage: (freeStorage / (1024 ** 3)).toFixed(2), // Convert bytes to GB
            usedStorage: ((storage - freeStorage) / (1024 ** 3)).toFixed(2), // Convert bytes to GB
            type: '',
            name: '',
            serialNum: '',
            interfaceType: '', // internal/external/usb
            temperature: '',
          }],
          memory_layouts: [{
            size: (memory / (1024 ** 3)).toFixed(2), // Convert bytes to GB
            usedMemory: (usedMemory / (1024 ** 3)).toFixed(2), // Convert bytes to GB
            type: '',
            partNum: '',
            serialNum: '',
          }],
          cpu: [{
            architecture: cpuArchitectures,
            model: '', // You can set the CPU model here if needed
          }],
          phoneNumber: phoneNumber,
        };

        setDeviceDetails(updatedDeviceDetails);
      } catch (error) {
        console.error('Error retrieving device information:', error);
      }
    };

    fetchDeviceDetails();

    return () => {
      console.log('unmount App');
    };
  }, []);


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

  return (

    <PaperProvider>
      <DataContext.Provider value={{ isInternetConnected, setIsNetConnected, websocketConnected, setWebsocketConnected, receivedSerialNumber, testStep, setTestStep, testSteps, setTestsSteps, deviceDetails, setDeviceDetails, isDiagStart, setIsDiagStart, isSubmitResult, setIsSubmitResult, startContinue, setStartContinue, isFinishedTests, setIsFinishedTests }}>
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
                <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false, unmountOnBlur: true }} />
                <Drawer.Screen name="DeviceInfo" component={DeviceInfoScreen} />
                <Drawer.Screen name="Setting" component={SettingScreen} />
                <Drawer.Screen name="Report" component={ReportScreen} />
                <Drawer.Screen name="CheckList" component={CheckList} />
                <Drawer.Screen name="Requirements" component={Requirements} />
                <Drawer.Screen name="Help" component={HelpScreen} />
                <Drawer.Screen name="TestsScreen" component={TestsScreen} options={{
                  drawerLabel: () => null,
                  headerShown: false,
                  drawerItemStyle: { display: 'none' }
                }} />

                <Drawer.Screen name="TouchScreen" component={TouchScreen} options={{ title: 'TouchScreen', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="MultiTouch" component={MultiTouch} options={{ title: 'MultiTouch', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="Display" component={Display} options={{ title: 'Display', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="Brightness" component={Brightness} options={{ title: 'Brightness', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="Rotation" component={Rotation} options={{ title: 'Rotation', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="BackCamera" component={BackCamera} options={{ title: 'BackCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="FrontCamera" component={FrontCamera} options={{ title: 'FrontCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="MultiCamera" component={MultiCamera} options={{ title: 'MultiCamera', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="BackCameraVideo" component={BackCameraVideo} options={{ title: 'BackCameraVideo', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="NativeCameraPhoto" component={NativeCameraPhoto} options={{ title: 'NativeCameraPhoto', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="NativeCameraVideo" component={NativeCameraVideo} options={{ title: 'NativeCameraVideo', headerShown: false, drawerLabel: () => null, unmountOnBlur: true, drawerItemStyle: { display: 'none' } }} />

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