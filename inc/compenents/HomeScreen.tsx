import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ActivityIndicator, Dimensions, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking, PermissionsAndroid, Animated, Easing } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Switch, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appConfig } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import sendWsMessage from '../utils/wsSendMsg'
import { DataContext } from '../../App';
import { TimerContext } from '../../App';


const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const { isInternetConnected, websocketConnected, wsSocket, receivedSerialNumber, receivedUuid, deviceDetails, testStep, setTestStep, isDiagStart, setIsDiagStart, setIsSubmitResult, isSubmitResult, setTestsSteps, setStartContinue, startContinue, isFinishedTests, setIsFinishedTests, isSingleTest, setIsSingleTest } = useContext(DataContext);
  const { startTime, setStartTime, elapsedTimeRef } = useContext(TimerContext);

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

  const [isLoading, setIsLoading] = useState(false);

  const [isSwitchDiag, setisSwitchDiag] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [modalRetestVisible, setModalRetestVisible] = useState(false);

  const [isAlertVisible, setAlertVisible] = useState(false);

  const onToggleSwitch = () => setisSwitchDiag(!isSwitchDiag);

  // Animated value for rotation
  const rotation = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(null);

  const startRotation = () => {
    rotation.setValue(0);
    rotateAnim.current = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnim.current.start();
  };

  const stopRotation = () => {
    if (rotateAnim.current) {
      rotateAnim.current.stop();
    }
  };

  useEffect(() => {
    startRotation();
    return () => stopRotation(); // Cleanup on unmount
  }, []);

  // Interpolating rotation value to degrees
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };

  const toggleReTestModal = () => {
    setModalRetestVisible(!modalRetestVisible);
  };

  const resetSteps = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('refTestSteps');
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue);
        setTestsSteps(data);
        console.log('reset Step Tests');
      } else {
        console.log('No data found for refTestSteps');
      }
    } catch (error) {
      console.log('Error retrieving refTestSteps:', error);
    }
  };

  const handleStartDiagBtn = async () => {
    if (isSwitchDiag) {
      if (websocketConnected) {
        setIsLoading(true);
        setIsSingleTest(false);
        if (isDiagStart) {
          toggleReTestModal();
          setIsLoading(false);
          return;
        };
        setStartTime(Date.now());
        setIsDiagStart(true)
        setIsSubmitResult(false);
        setIsFinishedTests(false);//TODO
        setTestStep(1);
        navigation.navigate('TestsScreen');
        setIsLoading(false);
      } else {
        Alert.alert('The device is not connected to the PC WebSocket server!');
      }
    } else {
      Alert.alert('Rapid Mobile Wipe Coming Soon...');
    }
  }

  const handleReTestDiag = async () => {
    setIsLoading(true);
    setIsSingleTest(false);
    console.log('ReTest Diag')
    await resetSteps();
    elapsedTimeRef.current = 0;
    setStartTime(Date.now());
    setIsDiagStart(true);
    setIsSubmitResult(false);
    setIsFinishedTests(false);//TODO
    console.log('setIsSubmitResult', isSubmitResult)
    setTestStep(null);
    setTestStep(1);
    toggleReTestModal();
    setIsLoading(false);
  }

  const handleContinueDiag = () => {
    setIsSingleTest(false);
    if (startContinue) {
      setStartContinue(!startContinue);
      setStartContinue(!startContinue);
    } else {
      setStartContinue(!startContinue);
    }
    toggleReTestModal();
  }

  const CustomAlert = () => {
    return (
      <Modal
        visible={isAlertVisible}
        transparent={true}
        animationType="slide"
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

  const RetestAlert = () => {
    return (
      <Modal
        visible={modalRetestVisible}
        transparent={true}
        animationType="slide"
        hardwareAccelerated={true}
        onRequestClose={() => {
          setModalRetestVisible(!modalRetestVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.customModalContent}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => setModalRetestVisible(!modalRetestVisible)}
            >
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.reTesatModalTitle}>
              {isDiagStart && !isFinishedTests &&
                'First, complete the current test'
              }
              {isDiagStart && isFinishedTests &&
                'Do you want to do the test again?'
              }
            </Text>
            <Text style={styles.reTestModalText}>
              {isDiagStart && !isFinishedTests &&
                'There is currently an unfinished test, do you want to proceed from the previous test or do you want to start a new test?'
              }
              {isDiagStart && isFinishedTests &&
                'You have completed the tests once, do you want to start from the beginning?'
              }
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button mode="contained" icon={'refresh'} onPress={handleReTestDiag} style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}>
                StartOver
              </Button>
              {
                isDiagStart && !isFinishedTests &&
                <Button mode="contained" icon={'redo'} onPress={handleContinueDiag} style={[styles.modalButton]}>
                  Continue
                </Button>
              }

            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // useEffect(() => {
  //   if (route.params) {
  //     console.log('route.params=>> ', route.params)
  //     if (route.params.isStartDiag == true) {
  //       // handleStartDiagBtn()
  //       handleReTestDiag();
  //     }
  //   }

  // }, [route.params]);

  useEffect(() => {
    sendWsMessage(wsSocket, {
      uuid: receivedUuid,
      type: 'progress',
      status: 'backToHome',
    });

  }, []);


  useEffect(() => {
    // if (wsSocket) {
    console.log('try to connect WS HomeScreen')
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
      const handleWebSocketMessage = (event) => {
        if (event) {
          console.log('Received event.data in HomeScreen:', event.data);
          const message = JSON.parse(event.data);
          if (message.type === 'action' && message.action === 'startDiag') {
            handleStartDiagBtn();
          } else if (message.type === 'action' && message.action === 'handleRetestDiag') {
            handleReTestDiag();
          } else if (message.type === 'action' && message.action === 'handleContinueDiag') {
            handleContinueDiag();
          }
        };
      };

      wsSocket.addEventListener('message', handleWebSocketMessage);
      return () => {
        console.log('disabled addEventListener HomeScreen');
        wsSocket.removeEventListener('message', handleWebSocketMessage);
      };
    }
  }, [wsSocket]);


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loaderText}>
          Please Wait...
        </Text>
      </View>
    );
  }
  return (
    <>
      <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
      <View style={{
        flex: 1,
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
        <CustomAlert visible={isAlertVisible} onClose={toggleAlert} />
        <RetestAlert visible={modalRetestVisible} onClose={toggleReTestModal} />
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{
          marginLeft: 10,
          marginTop: 10,
          position: 'absolute',
          top: insets.top,
          left: 10
        }}>
          <Icon name="forwardburger" size={40} color={isSwitchDiag ? "#4908b0" : "#E74C3C"} />
        </TouchableOpacity>
        <TouchableOpacity style={{
          marginLeft: 10,
          marginTop: 10,
          position: 'absolute',
          top: insets.top,
          right: 10
        }} onPress={toggleAlert}>
          {!isInternetConnected ?
            <Icon name="wifi-remove" size={40} style={[isInternetConnected]} color="#e84118" />
            : !websocketConnected ?
              <Icon name="wifi-alert" size={40} style={[isInternetConnected]} color="#F79F1F" />
              :
              <Icon name="wifi-check" size={40} style={[isInternetConnected]} color="#44bd32" />}
        </TouchableOpacity>
        <View style={styles.upperPart}>
          {/* <TouchableOpacity style={isSwitchDiag ? styles.startButtonDiag : styles.startButtonWipe} onPress={handleStartDiagBtn}>
            {isSwitchDiag ?
              <Icon name={'cog-outline'} style={styles.startIconDiag} />
              :
              <Icon name={'cellphone-remove'} style={styles.startIconWipe} />}
            {isSwitchDiag ?
              <Text style={styles.startButtonTextDiag}>
                Click To Start
              </Text>
              :
              <Text style={styles.startButtonTextWipe}>
                Click To Wipe
              </Text>}
          </TouchableOpacity> */}
          <TouchableOpacity
            style={isSwitchDiag ? styles.startButtonDiag : styles.startButtonWipe}
            onPress={handleStartDiagBtn}
            onPressIn={stopRotation}
            onPressOut={startRotation}
          >
            <Animated.View style={animatedStyle}>
              <Icon
                name={isSwitchDiag ? 'cog-outline' : 'cellphone-remove'}
                style={isSwitchDiag ? styles.startIconDiag : styles.startIconWipe}
              />
            </Animated.View>
            <Text style={isSwitchDiag ? styles.startButtonTextDiag : styles.startButtonTextWipe}>
              {isSwitchDiag ? 'Click To Start' : 'Click To Wipe'}
            </Text>
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
          {isSwitchDiag &&

            <View style={styles.middlePartBtnsCon}>
              <Button textColor='white' icon="clipboard-pulse-outline" mode="outlined" style={styles.preTestBtn} onPress={() => navigation.navigate('Report')}>
                Diag Report
              </Button>
            </View>}
          <View style={styles.middlePartDeviceInfo}>
            <Text style={styles.deviceDetailsTitle}>Device Info</Text>
            <View style={styles.deviceContainer}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Device:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.brand} {deviceDetails.deviceName} ({deviceDetails.model})</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Serial Number:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.serialNumber}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>OS:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.os} {deviceDetails.osVersion}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>CPU Model:</Text>
                <Text style={styles.detailsTextValue}>{deviceDetails.hardWare}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>CPU Architectures:</Text>
                <View>
                  {deviceDetails.cpu.map((cpuInfo, index) => (
                    <Text key={index} style={styles.detailsTextValue}>{cpuInfo.architecture}</Text>
                  ))}
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>Storage:</Text>
                <View>
                  {deviceDetails.storage_layouts.map((storage, index) => (
                    <Text key={index} style={styles.detailsTextValue}>
                      {storage.size} GB (used {storage.usedStorage} GB, free {storage.freeStorage} GB)
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsTextLabel}>RAM:</Text>
                <View>
                  {deviceDetails.memory_layouts.map((memory, index) => (
                    <Text key={index} style={styles.detailsTextValue}>
                      {memory.size} GB (used {memory.usedMemory} GB)
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

        </View>
        <Text style={styles.versionText}>
          {/* Version : 1.0.0 */}
          Version : {appConfig.version}
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
      {/* {isLoading &&
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={60} color="white" />
          <Text style={styles.loaderText}>
            Please Wait...
          </Text>
        </View>
      } */}
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
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
    // fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
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
    borderWidth: 1,
    borderColor: '#40079a4a',
    backgroundColor: 'white',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.8, // iOS shadow
    shadowRadius: 2, // iOS shadow
  },
  startButtonWipe: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    width: 200,
    height: 200,
    display: 'flex',
    borderWidth: 1,
    borderColor: '#cf433566',
    backgroundColor: 'white',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.8, // iOS shadow
    shadowRadius: 2, // iOS shadow
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
    top: StatusBar.currentHeight,
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
    borderColor: 'white',
    width: 'auto'
  },
  middlePartDeviceInfo: {
    display: 'flex',
    // borderWidth: 1,
    // borderColor: 'white',
    borderRadius: 10,
    padding: 12,
    width: '96%',
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
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    width: '95%'
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
  reTestModalText: {
    fontSize: 15,
    lineHeight: 21,
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
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
    color: 'black'
  },
  reTesatModalTitle: {
    fontSize: 19,
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
    color: 'black',
    marginTop: 10
  },
  modalButton: {
    marginTop: 20,
    // width: '100%'
    flexGrow: 1
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 7
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  loadingContainer: {
    backgroundColor: '#00000080',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    color: 'white',
    marginTop: 10,
    fontFamily: 'Quicksand-Medium'
  }
});