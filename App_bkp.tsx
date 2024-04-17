import * as React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import logoImage from './assets/images/logo.png';

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
    const wsUrl = url;

    // const wsUrl = 'http://192.168.1.24:2552';
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
        // onBarCodeRead={onBarCodeRead}
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
        <Image source={logoImage} style={styles.logo} resizeMode='contain' />
      </View>
      <View style={[styles.scannerBoxContainer]}>
        <Text style={[styles.scanText]}>Please scan the QRCode</Text>
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
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
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
    serialNumber: '',
    cpu: '',
    memory: '',
    hardWare: '',
    freeStorage: '',
  });
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);


  const paperTheme = {

  };

  React.useEffect(() => {
    Promise.all([
      DeviceInfo.getDevice(),
      DeviceInfo.getSerialNumber(),
      DeviceInfo.supportedAbis(),
      DeviceInfo.getTotalMemory(),
      DeviceInfo.getHardware(),
      DeviceInfo.getFreeDiskStorageOld(),
      DeviceInfo.getFreeDiskStorage(),
    ]).then(([device, serialNumber, abis, memory, hardWare, storage, free]) => {
      setDeviceDetails({
        ...deviceDetails,
        deviceName: device,
        serialNumber: serialNumber,
        cpu: abis,
        memory: (memory / (1024 ** 3)).toFixed(2),
        hardWare: hardWare,
        freeStorage: (free / (1024 ** 3)).toFixed(2),
      });
    }).catch(error => {
      console.error('Error retrieving device information:', error);
    });
  }, [])

  return (
    <PaperProvider theme={paperTheme}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="forwardburger" size={40} color="#4908b0" />
        </TouchableOpacity>
        <Tooltip title="Pre-Test Requirements" enterTouchDelay={100} leaveTouchDelay={1000}>
          <TouchableOpacity style={styles.preTestButton} onPress={() => setModalVisible(!modalVisible)}>
            <Icon name="progress-question" size={40} color="#4908b0" />
          </TouchableOpacity>
        </Tooltip>
        <View style={styles.upperPart}>
          <TouchableOpacity style={isSwitchOn ? styles.startButtonWipe : styles.startButtonDiag}>
            {
              isSwitchOn ?
                <Icon name={'cellphone-remove'} style={styles.startIconWipe} />
                :
                <Icon name={'cog-play-outline'} style={styles.startIconDiag} />
            }
            {
              isSwitchOn ?
                <Text style={styles.startButtonTextWipe}>
                  Click To Wipe
                </Text>
                :
                <Text style={styles.startButtonTextDiag}>
                  Click To Diag
                </Text>
            }
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchText]}>
              Diag
            </Text>
            <Switch value={isSwitchOn} style={styles.switchBtn} onValueChange={onToggleSwitch} trackColor={{ false: '#4908b099', true: '#e74c3cb8' }} thumbColor={isSwitchOn ? '#E74C3C' : '#4908b0'} />
            <Text style={[styles.switchText]}>
              Wipe
            </Text>
          </View>
        </View>

        <View style={styles.middlePart}>
          <View style={styles.middlePartBtns}>
            <Button textColor='white' icon="rocket-launch" mode="outlined" style={{ borderColor: 'white' }} onPress={() => console.log('Pressed')}>
              Check List
            </Button>
            <Button textColor='white' icon="rocket-launch" mode="outlined" style={{ borderColor: 'white' }} onPress={() => console.log('Pressed')}>
              Report
            </Button>
          </View>
          <View style={styles.middlePartDeviceInfo}>
            <Text style={styles.deviceDetailsTitle}>Device Info</Text>
            <View style={styles.deviceContainer}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Device:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.brand} {deviceDetails.deviceName}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>OS:</Text>
                <Text style={styles.detailsTextValue}>{Platform.OS}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>CPU:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.cpu}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>RAM:</Text>
                <Text style={styles.detailsTextValue}>{(deviceDetails.memory)} GB</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>free Storage:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.freeStorage}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>HardWare:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.hardWare}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Serial Number:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.serialNumber}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.versionText}>
          Version : 1.0.0
        </Text>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <Text style={styles.preTestTitle}>Pre-Test Requirements</Text>
            <Text style={styles.preTestText}>Please prepare the following tools before testing the mobile device.</Text>
            <ScrollView style={styles.checkListScroll} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
              {checklistItems.map((item, index) => (
                <Text key={index} style={styles.checklistItems}>{index + 1}. {item}</Text>
              ))}
            </ScrollView>
            <Pressable
              style={[styles.buttonModalClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Icon name={'close-circle-outline'} style={styles.closeIcon} />
            </Pressable>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}

function DeviceInfoScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
function SettingScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
function ReportScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
function HelpScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function StartApp() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="DeviceInfo" component={DeviceInfoScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Report" component={ReportScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartApp">
        <Stack.Screen
          name="ScanQrCode"
          component={ScanQrCode}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StartApp"
          component={StartApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

{/*
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
*/}