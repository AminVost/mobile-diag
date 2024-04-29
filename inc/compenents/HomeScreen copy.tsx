import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoImage from './assets/images/logo.png';
import { NetworkContext } from '../../App';
// import CustomAlert from './inc/modal/customAlert';


export default function HomeScreen({ navigation, route }) {
  const { isInternetConnected, websocketConnected, receivedSerialNumber } = useContext(NetworkContext);

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
  const [isSwitchDiag, setisSwitchDiag] = React.useState(true);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [isAlertVisible, setAlertVisible] = useState(false);

  const onToggleSwitch = () => setisSwitchDiag(!isSwitchDiag);

  const paperTheme = {

  };

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };

  const CustomAlert = () => {
    return (
      <Modal
        visible={isAlertVisible}
        transparent={true}
        animationType="fade"
        hardwareAccelerated={true}
        onRequestClose={() => {
          setAlertVisible(!isAlertVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.customModalContent}>
            <Text style={styles.customModalTitle}>Connection Status Guide</Text>

            <View style={styles.customModalRow}>
              <Icon name="wifi-remove" size={30} color="#e84118" />
              <Text style={styles.customModalText}>The device is not connected to the Internet</Text>
            </View>
            <View style={styles.customModalRow}>
              <Icon name="wifi-alert" size={30} color="#F79F1F" />
              <Text style={styles.customModalText}>The device is connected to the Internet, but the connection with the PC system is not established</Text>
            </View>
            <View style={styles.customModalRow}>
              <Icon name="wifi-check" size={30} color="#44bd32" />
              <Text style={styles.customModalText}>The connection is established correctly</Text>
            </View>

            <TouchableOpacity style={styles.closeButtonCon} onPress={toggleAlert}>
              <Text style={styles.closeButton}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  React.useEffect(() => {
    Promise.all([
      DeviceInfo.getDevice(),
      DeviceInfo.supportedAbis(),
      DeviceInfo.getTotalMemory(),
      DeviceInfo.getHardware(),
      DeviceInfo.getFreeDiskStorageOld(),
      DeviceInfo.getFreeDiskStorage(),
    ]).then(([device, abis, memory, hardWare, storage, free]) => {
      setDeviceDetails({
        ...deviceDetails,
        deviceName: device,
        serialNumber: receivedSerialNumber,
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
        <CustomAlert visible={isAlertVisible} onClose={toggleAlert} />
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="forwardburger" size={40} color={isSwitchDiag ? "#4908b0" : "#E74C3C"} />
        </TouchableOpacity>
        {/* <Tooltip title="Pre-Test Requirements" enterTouchDelay={100} leaveTouchDelay={1000}>
          <TouchableOpacity style={styles.preTestButton} onPress={() => setModalVisible(!modalVisible)}>
            <Icon name="progress-question" size={40} color="#4908b0" />
          </TouchableOpacity>
        </Tooltip> */}
        <TouchableOpacity style={[styles.wifiButton]} onPress={toggleAlert}>
          {
            !isInternetConnected ?
              <Icon name="wifi-remove" size={40} style={[isInternetConnected]} color="#e84118" />
              : !websocketConnected ?
                <Icon name="wifi-alert" size={40} style={[isInternetConnected]} color="#F79F1F" />
                :
                <Icon name="wifi-check" size={40} style={[isInternetConnected]} color="#44bd32" />

          }
        </TouchableOpacity>
        <View style={styles.upperPart}>
          <TouchableOpacity style={isSwitchDiag ? styles.startButtonDiag : styles.startButtonWipe}>
            {
              isSwitchDiag ?
                <Icon name={'cog-play-outline'} style={styles.startIconDiag} />
                :
                <Icon name={'cellphone-remove'} style={styles.startIconWipe} />
            }
            {
              isSwitchDiag ?
                <Text style={styles.startButtonTextDiag}>
                  Click To Diag
                </Text>
                :
                <Text style={styles.startButtonTextWipe}>
                  Click To Wipe
                </Text>
            }
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchText]}>
              Wipe
            </Text>
            <Switch value={isSwitchDiag} style={styles.switchBtn} onValueChange={onToggleSwitch} trackColor={{ false: '#E74C3Cb8', true: '#4908b099' }} thumbColor={isSwitchDiag ? '#4908b0' : '#E74C3C'} />
            <Text style={[styles.switchText]}>
              Diag
            </Text>
          </View>
        </View>

        <View style={[styles.middlePart, { backgroundColor: isSwitchDiag ? '#4908b0' : '#E74C3C' }]}>
          {
            isSwitchDiag &&

            <View style={styles.middlePartBtnsCon}>
              <Button textColor='white' icon="rocket-launch" mode="outlined" style={styles.preTestBtn} onPress={() => console.log('Pressed')}>
                Diag Report
              </Button>
              <View style={styles.middlePartBtns}>
                <Button textColor='white' icon="rocket-launch" mode="outlined" style={{ borderColor: 'white' }} onPress={() => console.log('Pressed')}>
                  Check List
                </Button>
                <Button textColor='white' icon="progress-question" mode="outlined" style={{ borderColor: 'white' }} onPress={() => setModalVisible(!modalVisible)}>
                  Requirements
                </Button>
              </View>
            </View>
          }
          <View style={styles.middlePartDeviceInfo}>
            <Text style={styles.deviceDetailsTitle}>Device Info</Text>
            <View style={styles.deviceContainer}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Device:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.brand} {deviceDetails.deviceName}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Serial Number:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.serialNumber}</Text>
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
                <Text style={styles.detailsTextLabel}>HardWare:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.hardWare}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>RAM:</Text>
                <Text style={styles.detailsTextValue}>{(deviceDetails.memory)} GB</Text>
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
    // backgroundColor: '#4908b0',
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
    top: 60,
    right: 10
  },
  preTestButton2: {
    marginLeft: 10,
    marginTop: 10,
  },
  wifiButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    right: 10,
  },
  connectWifi: {
    color: 'green'
  },
  disConnectWifi: {
    color: 'red'
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
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20,
  },
  middlePartBtnsCon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20,
  },
  preTestBtn: {
    marginTop: '5%',
    borderColor: 'white'
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
    marginTop: '5%'
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
  buttonModalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    color: 'rgba(0, 0, 0, 0.35)',
    fontSize: 35
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalContent: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 15,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  customModalTitle: {
    width: 'auto',
    borderColor: '#0000002e',
    textAlign: 'center',
    paddingBottom: 5,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    marginBottom: 10
  },
  customModalRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  customModalText: {
    fontSize: 13,
  },
  closeButton: {
    color: 'blue',
    marginTop: 20,
    fontSize: 16,
  },
  closeButtonCon: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  }
});