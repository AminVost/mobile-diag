import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ActivityIndicator, useWindowDimensions, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { LaunchArguments } from "react-native-launch-arguments";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData } from './storageUtils';
import DeviceInfo from 'react-native-device-info';
import logoImage from './assets/images/logo.png';
import ScanQrCode from './ScanQrCode';
import HomeScreen from './HomeScreen';
import DeviceInfoScreen from './DeviceInfoScreen';
import SettingScreen from './SettingScreen';
import ReportScreen from './ReportScreen';
import HelpScreen from './HelpScreen';
import { FlipInEasyX } from 'react-native-reanimated';

export const NetworkContext = createContext(false);
const Drawer = createDrawerNavigator();

export default function App() {
  const [isInternetConnected, setIsNetConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = React.useState(false);
  const [wss, setWss] = React.useState(null);
  const [receivedSerialNumber, setReceivedSerialNumber] = React.useState(null);
  const dimensions = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);

  // const isLargeScreen = dimensions.width >= 768;
  interface MyExpectedArgs {
    serialNumber?: string;
    wsIp?: string;
  }

  const paramss = LaunchArguments.value<MyExpectedArgs>();
  const paramsTest = { "wsIp": "192.168.1.22", "serialNumber": "R58M42HXCZW" };

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
  }, [paramsTest]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetConnected(state.isConnected);

    })
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    let ws;
    const wsPort = '3655';
    if (!websocketConnected) {
      const connectWebSocket = () => {
        if (paramsTest.wsIp) {
          const wsUrl = 'ws://' + paramsTest?.wsIp + ':' + wsPort; // WebSocket server URL
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
            console.log('WebSocket error:', error.message);
          };

          ws.onclose = () => {
            setWebsocketConnected(false);
            console.log('WebSocket closed');
            // Attempt to reconnect after a delay
            // setTimeout(connectWebSocket, 3000); // Adjust the delay as needed
          };
        } else {
          Alert.alert('Ws Url not Defined.');
          return;
        }
      };

      if (!websocketConnected && isInternetConnected) {
        connectWebSocket();
      }

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [isInternetConnected, websocketConnected]);


  useEffect(() => {
    // Simulating some asynchronous loading process
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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
    <NetworkContext.Provider value={{ isInternetConnected, setIsNetConnected, websocketConnected, setWebsocketConnected, receivedSerialNumber }}>
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
          <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="DeviceInfo" component={DeviceInfoScreen} />
          <Drawer.Screen name="Setting" component={SettingScreen} />
          <Drawer.Screen name="Report" component={ReportScreen} />
          <Drawer.Screen name="Help" component={HelpScreen} />
        </Drawer.Navigator>

      </NavigationContainer>
    </NetworkContext.Provider>
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
})