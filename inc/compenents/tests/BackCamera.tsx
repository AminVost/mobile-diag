import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices, useCameraDevice } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import { DataContext } from '../../../App';
import RNFS from 'react-native-fs';

const BackCamera = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);
  const [Device, setDevice] = useState(null);
  const cameraRef = useRef(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  const requestCameraPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    // setDevice(useCameraDevice('back'));

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'IMEI Permission',
        message: 'App needs access WRITE STORAGE', // Replace with your reason
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // const cameraPermission = await Camera.requestCameraPermission();
      const micPermission = await Camera.requestMicrophonePermission();

      if (cameraPermission === 'granted' && micPermission === 'granted') {
        setPermissionsGranted(true);
      } else {
        Alert.alert('Permission Required', 'Camera permission is required to take pictures.');
      }
    } else {
      console.warn('IMEI permission denied');
      return false; // Permission denied
    }

  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      const directoryPath = `${RNFS.PicturesDirectoryPath}/RapidMobileDiag`;
      await RNFS.mkdir(directoryPath);
      const filePath = `${directoryPath}/${testSteps[testStep - 1].title}1.jpg`;

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
    updatedTestSteps[testStep - 1].result = result;
    setTestsSteps(updatedTestSteps);
    setTestStep((prevStep) => prevStep + 1);
  };

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting permissions...</Text>
        <ActivityIndicator size="large" color="#4908b0" />
      </View>
    );
  }

  if (!Device) {
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
            <Button mode="contained" onPress={() => handleResult('Fail')}>Fail</Button>
            <Button mode="contained" onPress={() => handleResult('Skip')}>Skip</Button>
            <Button mode="contained" onPress={() => handleResult('Pass')}>Pass</Button>
          </View>
        </>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.preview}
            device={Device}
            isActive={true}
            photo={true}
          >
          </Camera>
          <View style={styles.captureContainer}>
            <Button mode="contained" onPress={takePicture}>Take Picture</Button>
          </View>
        </>
      )}
    </View>
  );
};

export default BackCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    width: '100%',
    padding: 20,
  },
  photo: {
    width: '100%',
    height: '80%',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
