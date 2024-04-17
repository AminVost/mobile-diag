import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
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

export const NetworkContext = createContext(false);
const Drawer = createDrawerNavigator();

export default function App() {
  const [isInternetConnected, setIsNetConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = React.useState(false);
  const [wss, setWss] = React.useState(null);
  interface MyExpectedArgs {
    serialNumber?: string;
    wsIp?: string;
  }

  const paramss = LaunchArguments.value<MyExpectedArgs>();
  const paramsTest = { "wsIp": "192.168.1.22", "serialNumber": "R58M42HXCZW" };

  useEffect(() => {
    if (paramsTest) {
      storeData(paramsTest);
    }
  }, [paramsTest]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetConnected(state.isConnected);

    })
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isInternetConnected) {
      const wsUrl = 'ws://192.168.1.22:3655'; // Use ws:// for WebSocket connection
      const ws = new WebSocket(wsUrl);

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
      };

      setWss(ws);

      return () => {
        if (wss) {
          wss.close();
        }
      };
    }
  }, [isInternetConnected]);
  
  return (
    <NetworkContext.Provider value={{ isInternetConnected, setIsNetConnected , websocketConnected, setWebsocketConnected }}>
      <NavigationContainer>

        <Drawer.Navigator initialRouteName="Home">
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
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  scannerBoxContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanScreenMessage: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  upperPart: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middlePart: {
    display: 'flex',
    flex: 4,
    backgroundColor: '#4908b0',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    width: '100%',

  },
  deviceDetailsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
    color: 'white',
    textAlign: 'center'
  },
  detailsItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  detailsTextLabel: {
    flex: 1,
    fontWeight: '600',
    color: 'white',
    fontSize: 14
  },
  detailsTextValue: {
    flex: 2,
    fontSize: 13,
    textAlign: 'right',
    color: 'white'
  },
  preTestTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black',
    fontFamily: 'Quicksand-Regular',
  },
  preTestText: {
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 15,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#00000026',
    paddingBottom: 7
  },
  startButtonDiag: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    width: 200,
    height: 200,
    display: 'flex',
    borderWidth: 2,
    borderColor: '#40079a75',
    backgroundColor: 'white',
  },
  startButtonWipe: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    width: 200,
    height: 200,
    display: 'flex',
    borderWidth: 2,
    borderColor: '#cf433566',
    backgroundColor: 'white',
  },
  startIconDiag: {
    color: '#4908b0',
    fontSize: 120,
  },
  startIconWipe: {
    color: '#E74C3C',
    fontSize: 120,
  },
  startButtonTextWipe: {
    fontSize: 18,
    color: '#E74C3C',
    fontFamily: 'Quicksand-Bold',
  },
  startButtonTextDiag: {
    fontSize: 18,
    color: '#4908b0',
    fontFamily: 'Quicksand-Bold',
  },
  checklistItems: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
    marginVertical: 5

  },
  checkListScroll: {
    flex: 1,
    width: 300
  },
  scannerBox: {
    borderWidth: 6,
    borderColor: 'black',
    width: 350,
    aspectRatio: 1,
    backgroundColor: '#ffffff54',
    borderRadius: 50
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: 'white',
    flex: 1,
    height: 50,
    maxHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  scanText: {
    width: '100%',
    width: 250,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: 'black',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logo: {
    width: 240,
    resizeMode: 'stretch',
  },
  menuButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    left: 10
  },
  preTestButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    right: 10
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBtnContainer: {
    padding: 50,
    backgroundColor: 'red'
  },
  middlePartBtns: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20
  },
  middlePartDeviceInfo: {
    display: 'flex',
    // borderWidth: 1,
    // borderColor: 'white',
    borderRadius: 10,
    padding: 12,
    width: '90%',
    alignSelf: 'center',
    // backgroundColor: '#ffffff21',
    marginTop: '10%'
  },
  deviceContainer: {
    display: 'flex',
    rowGap: 10
  },
  switchBtn: {
    transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }],
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 30,
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  switchText: {
    fontFamily: 'Quicksand-Bold',
    color: 'black',
    fontSize: 18
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
    color: '#ffffff5c',
    textAlign: 'center',
    width: '100%',
    marginBottom: '1%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,,
    backgroundColor: 'white'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.95,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonModalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    color: 'rgba(0, 0, 0, 0.35)',
    fontSize: 35
  },
});