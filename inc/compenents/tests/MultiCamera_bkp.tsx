import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, Modal, BackHandler } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import RNFS from 'react-native-fs';
import { requestPermissions, openAppSettings } from '../CameraPermission';

const MultiCamera = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const cameraRef = useRef(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [photoPath, setPhotoPath] = useState<string | ((arg: any) => string)>(null);
  const devices = useCameraDevices();
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    requestCameraPermission();
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (permissionsGranted && devices && devices.length > 0) {
      const cycleCameras = async () => {
        for (let i = 0; i < devices.length; i++) {
          setCurrentDeviceIndex(i);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        setIsCycling(false);
      };
      cycleCameras();
    }
  }, [permissionsGranted, devices]);

  const handleBackButtonPress = () => {
    setAlertVisible(!isAlertVisible);
    return true;
  };

  const requestCameraPermission = async () => {
    const permissionStatus = await requestPermissions();
    if (permissionStatus === 'granted') {
      setPermissionsGranted(true);
    } else if (permissionStatus === 'never_ask_again' || permissionStatus === 'denied') {
      openAppSettings();
    }
  };

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    if (photoPath) {
      updatedTestSteps[testStep - 1].data = photoPath;
    }
    setTestsSteps(updatedTestSteps);
    setTestStep((prevStep) => prevStep + 1);
    setAlertVisible(false);
  };

  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };

  const CustomAlert = () => (
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
          <Text style={styles.customModalTitle}>Please select the camera test result</Text>
          <View style={styles.customModalRow}>
            <Icon name="camera-enhance-outline" size={100} color="#4908b0" />
          </View>
          <View style={styles.customModalBtns}>
            <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Pass')}>
              Pass
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found...</Text>
      </View>
    );
  }

  const currentDevice = devices[currentDeviceIndex];

  return (
    <View style={styles.container}>
      {isCycling ? (
        <View style={styles.cameraContainer}>
          <Camera ref={cameraRef} style={styles.preview} device={currentDevice} isActive={true} photo={true} />
        </View>
      ) : (
        <>
          {photoUri ? (
            <Image source={{ uri: `file://${photoUri}` }} style={styles.photo} />
          ) : (
            <View style={styles.cameraContainer}>
              <Camera ref={cameraRef} style={styles.preview} device={currentDevice} isActive={true} photo={true} />
            </View>
          )}
          <View style={styles.btnContainer}>
            <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
              Pass
            </Button>
          </View>
        </>
      )}
      <CustomAlert visible={isAlertVisible} onClose={toggleAlert} />
    </View>
  );
};

export default MultiCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  btnTakePic: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#95a5a6',
    borderRadius: 100,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  captureContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '10%',
  },
  photo: {
    width: '100%',
    height: '90%',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  btns: {
    padding: 7,
  },
  btnLabel: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
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
    marginBottom: 10,
  },
  customModalRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  customModalBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
