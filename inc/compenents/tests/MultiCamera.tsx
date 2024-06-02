import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import RNFS from 'react-native-fs';
import { requestPermissions, openAppSettings } from '../CameraPermission';

const MultiCameraTest = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const cameraRef = useRef(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [photoPath, setPhotoPath] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const devices = useCameraDevices();
  // console.log(devices);
  const cameraDevices = devices || [];
  const FormattedCameraDevices = cameraDevices.length > 0 ? cameraDevices.map(({ formats, ...rest }) => rest) : [];
  const device = cameraDevices[currentCameraIndex];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    requestCameraPermission();
    return () => {
      // console.log('testSteps', testSteps[0].devicesInfo);
      console.log('testSteps', testSteps[0].multiCamResult);
      backHandler.remove();
    };
  }, []);

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

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: 'on',
        qualityPrioritization: 'speed',
        enableShutterSound: true,
      });

      const directoryPath = `${RNFS.PicturesDirectoryPath}/RapidMobileDiag`;
      try {
        await RNFS.mkdir(directoryPath);
      } catch (err) {
        console.error('Error creating directory:', err);
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const fileName = `Camera_${currentCameraIndex}_${formattedDate}_${formattedTime}.jpg`;
      const filePath = `${directoryPath}/${fileName}`;
      setPhotoPath(filePath);

      try {
        await RNFS.copyFile(photo.path, filePath);
        setPhotoUri(filePath);
      } catch (err) {
        console.error('Error saving photo:', err);
      }
    }
  };

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    const multiCameraStepIndex = updatedTestSteps.findIndex(step => step.title === 'MultiCamera');

    if (multiCameraStepIndex !== -1) {
      const multiCamResult = updatedTestSteps[multiCameraStepIndex].multiCamResult || [];
      const cameraResult = {
        title: devices[currentCameraIndex].name, // Use the name of the camera
        text: '',
        result,
        filePath: photoPath,
        error: null,
        duration: null,
      };

      multiCamResult[currentCameraIndex] = cameraResult;
      updatedTestSteps[multiCameraStepIndex].multiCamResult = multiCamResult;
    }

    if (currentCameraIndex < cameraDevices.length - 1) {
      setCurrentCameraIndex((prevIndex) => prevIndex + 1);
      setPhotoUri(null); // Reset photoUri for the next camera
      setPhotoPath(null); // Reset photoPath for the next camera
    } else {
      // Determine the overall result
      const finalResults = updatedTestSteps[multiCameraStepIndex].multiCamResult.map(cam => cam.result);
      let finalResult = 'Pass';
      if (finalResults.includes('Fail')) {
        finalResult = 'Fail';
      } else if (finalResults.includes('Skip')) {
        finalResult = 'Skip';
      }
      updatedTestSteps[multiCameraStepIndex].result = finalResult;
      updatedTestSteps[multiCameraStepIndex].devicesInfo = FormattedCameraDevices
      setTestsSteps(updatedTestSteps);
      console.log(testSteps[0].multiCamResult[0]);
      console.log(testSteps[0].multiCamResult[1]);
      setTestStep((prevStep) => prevStep + 1);
      setAlertVisible(false);
    }
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
          <Text style={styles.customModalTitle}>Please select the test result for {devices[currentCameraIndex].name}</Text>
          <View style={styles.customModalRow}>
            <Icon name="camera-enhance-outline" size={100} color="#4908b0" />
          </View>
          <View style={styles.customModalBtns}>
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

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: `file://${photoUri}` }} style={styles.photo} />
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
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.preview}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.btnTakePic} onPress={takePicture}>
            <Icon name="checkbox-blank-circle" size={70} color={"#fff"} />
          </TouchableOpacity>
        </View>
      )}
      <CustomAlert visible={isAlertVisible} onClose={toggleAlert} />
    </View>
  );
};
export default MultiCameraTest;


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
