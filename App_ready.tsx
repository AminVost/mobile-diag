import * as React from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function ScanQrCode({ route, navigation }) {
  const [cameraType, setCameraType] = React.useState(RNCamera.Constants.Type.back);
  const [flashMode, setFlashMode] = React.useState(RNCamera.Constants.FlashMode.auto);
  const cameraRef = React.useRef(null);
  const barcodeCodes: any[] = [];
  const [websocketConnected, setWebsocketConnected] = React.useState(false);
  const [serverResponse, setServerResponse] = React.useState(null);
  const [wss, setWss] = React.useState(null);

  const onBarCodeRead = async (scanResult: { type: any; data: null; }) => {
    // navigation.navigate('Drawer');
    // return;
    if (scanResult.data != null && !websocketConnected) { // Check if websocket is not already connected

      barcodeCodes.push(scanResult.data);
      await connectWebSocket(scanResult.data);
    } else {

      if (scanResult.data == null) {
        console.log('Error=> Qrcode Url Is Null');
      } else {
        console.log('Error=> websocket already connected');
      }

    }
    return;
  };

  const connectWebSocket = async (url) => {
    // const wsUrl = url;

    const wsUrl = 'http://192.168.1.24:2552';
    console.log('in ConnectWebSocket Function . URL: ', url);
  
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      setWebsocketConnected(true);
      navigation.navigate('Drawer');
      console.log('WebSocket connected');
    };
  
    ws.onmessage = (data) => {
      // a message was received
      setServerResponse(data);
      console.log('Server Response:', data);
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
  };
  

  return (
    <View style={styles.container}>

      <RNCamera
        ref={cameraRef}
        defaultTouchToFocus
        flashMode={flashMode}
        mirrorImage={false}
        onBarCodeRead={onBarCodeRead}
        onFocusChanged={() => { console.log('focused') }}
        onZoomChanged={() => { }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera phone',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }}
        style={styles.preview}
        type={cameraType}
      />
      <View style={[styles.overlay]}>
        <Text style={styles.scanScreenMessage}>Please scan the barcode</Text>
      </View>
      {/* <View style={[styles.scannerBox]}>

      </View> */}
      <View style={[styles.scannerBoxContainer]}>
        <View style={[styles.scannerBox]} />
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {

  const checklistItems = [
    "Any Bluetooth Device",
    "Headset",
    "NFC Tag",
    "SIM Card",
    "Camera",
    "Another Camera Device",
    "Magnet",
    "SD Card",
    "OTG Connector",
    "Any Bluetooth Device",
    "Headset",
    "NFC Tag",
    "SIM Card",
    "Camera",
    "Another Camera Device",
    "Magnet",
    "SD Card",
    "OTG Connector",
  ];
  const [deviceDetails, setDeviceDetails] = React.useState({
    deviceName: '',
    brand: DeviceInfo.getBrand(),
    oS: '',
    imei: '',
    meid: '',
    serialNumber: ''
  });


  // React.useEffect(() => {
  //   Promise.all([DeviceInfo.getDevice(),DeviceInfo.getSerialNumber()]).then(([device]) => {
  //     setDeviceDetails({
  //       ...deviceDetails,
  //       deviceName: device,

  //     });
  //   });
  // }, []);
  React.useEffect(() => {
    Promise.all([DeviceInfo.getDevice(), DeviceInfo.getSerialNumber()]).then(([device, serialNumber]) => {
      setDeviceDetails({
        ...deviceDetails,
        deviceName: device,
        serialNumber: serialNumber
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.upperPart}>
        <Text style={styles.deviceDetails}>Device Details</Text>
        <View style={styles.detailsItem}>
          <Text style={styles.detailsTextLabel}>Device:</Text>
          <Text style={styles.detailsTextValue}>{deviceDetails.brand} {deviceDetails.deviceName}</Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.detailsTextLabel}>OS:</Text>
          <Text style={styles.detailsTextValue}>{Platform.OS}</Text>
        </View> 
        <View style={styles.detailsItem}>
          <Text style={styles.detailsTextLabel}>IMEI:</Text>
          <Text style={styles.detailsTextValue}>Your Mobile Phone Name</Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.detailsTextLabel}>MEID:</Text>
          <Text style={styles.detailsTextValue}>Your Mobile Phone Name</Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.detailsTextLabel}>Serial Number:</Text>
          <Text style={styles.detailsTextValue}>{deviceDetails.serialNumber}</Text>
        </View>
      </View>

      <View style={styles.middlePart}>
        <Text style={styles.testingChecklist}>Testing Checklist</Text>
        <ScrollView style={styles.checkListScroll} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
          {checklistItems.map((item, index) => (
            <Text key={index} style={styles.checklistItems}>{index + 1}. {item}</Text>
          ))}
        </ScrollView>
      </View>

      <TouchableHighlight style={styles.startButton}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableHighlight >
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanQrCode">
        <Stack.Screen
          name="ScanQrCode"
          component={ScanQrCode}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    backgroundColor: 'white',
    opacity: 0.8,
    flex: 1
  },
  scannerBox: {
    borderWidth: 6,
    borderColor: 'black',
    width: 350,
    aspectRatio: 1,
    backgroundColor: '#ffffff54',
    borderRadius: 50
  },
  scannerBoxContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    flex: 2,
    // backgroundColor: '#0080004f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middlePart: {
    flex: 3,
    // backgroundColor: '#ff8c0042',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceDetails: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black'
  },
  detailsItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  detailsTextLabel: {
    flex: 1,
    fontWeight: '700',
    color: 'black',
    fontSize: 15
  },
  detailsTextValue: {
    flex: 2,
    fontSize: 14,
    // borderWidth: 1,
    textAlign: 'right',
    color: 'black'
  },
  testingChecklist: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black',
  },
  startButton: {
    backgroundColor: '#4908b0',
    // backgroundColor: '#9B59B6',
    // backgroundColor: '#ab91eb',
    // backgroundColor: '#574b90',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

  },
  startButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
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
  }
});