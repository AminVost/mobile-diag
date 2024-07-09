import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { requestPermissions, openAppSettings } from '../CameraPermission';
import { DataContext, TimerContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';
import sendWsMessage from '../../utils/wsSendMsg'
import AnimatedIcon from '../../utils/AnimatedIcon'

const NativeCameraPhoto = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps, wsSocket, receivedUuid } = useContext(DataContext);
  const { elapsedTimeRef } = useContext(TimerContext);
  const [photoUri, setPhotoUri] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const getDuration = useStepTimer();
  const nativePauseTime = useRef(0)

  useEffect(() => {
    sendWsMessage(wsSocket, {
      uuid: receivedUuid,
      type: 'progress',
      status: 'step',
      status: 'step',
      step: testStep + '/' + testSteps.length,
      currentStep: testSteps[testStep - 1].title
    });
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    nativePauseTime.current = Date.now();
    requestCameraPermission();
    return () => {
      console.log('unMount Native CameraPhoto')
      backHandler.remove();
      setIsTimerVisible(false);
    };
  }, []);

  const handleBackButtonPress = () => {
    return true; // Prevent going back
  };

  const requestCameraPermission = async () => {
    const permissionStatus = await requestPermissions();
    // console.log('permissionStatus', permissionStatus)
    if (permissionStatus === 'granted') {
      setPermissionsGranted(true);
      openNativeCamera();
    } else if (permissionStatus === 'never_ask_again' || permissionStatus == 'denied') {
      openAppSettings();
    }
  };

  const openNativeCamera = () => {

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.3,
      },
      async (response) => {
        if (response.didCancel) {
          elapsedTimeRef.current += Math.floor((Date.now() - nativePauseTime.current) / 1000)
          handleResult('Skip');
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
          elapsedTimeRef.current += Math.floor((Date.now() - nativePauseTime.current) / 1000)
          handleResult('Fail');
        } else {
          const { uri } = response.assets[0];
          const photoPath = await savePhoto(uri);
          // console.log('elapseeeeeeeed=> ' , Math.floor((Date.now() - nativePauseTime.current) / 1000))
          elapsedTimeRef.current += Math.floor((Date.now() - nativePauseTime.current) / 1000)
          if (photoPath) {
            setPhotoUri(photoPath);
          } else {
            Alert.alert('Error', 'Failed to save photo');
            handleResult('Fail');
          }
        }
      }
    );
  };

  const savePhoto = async (uri) => {
    const directoryPath = `${RNFS.PicturesDirectoryPath}/RapidMobileDiag`;
    try {
      await RNFS.mkdir(directoryPath);
    } catch (err) {
      console.error('Error creating directory:', err);
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `NativeCamera_${formattedDate}_${formattedTime}.jpg`;
    const filePath = `${directoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(uri, filePath);

      // Convert the photo to base64
      const fileBase64String = await RNFS.readFile(filePath, 'base64');
      const finalFileBase64 = 'data:image/jpeg;base64,' + fileBase64String;
      setFileBase64(finalFileBase64);

      return filePath;
    } catch (err) {
      console.error('Error saving photo:', err);
      return null;
    }
  };

  const handleResult = useCallback((result, photoPath = null) => {
    const updatedTestSteps = [...testSteps];
    const nativeCameraStepIndex = updatedTestSteps.findIndex((step) => step.title === 'NativeCameraPhoto');

    if (nativeCameraStepIndex !== -1) {
      if (photoPath) {
        updatedTestSteps[nativeCameraStepIndex].fileItem.base64 = fileBase64;
        updatedTestSteps[nativeCameraStepIndex].fileItem.filePath = photoPath;
      }
      updatedTestSteps[nativeCameraStepIndex].result = result;
      updatedTestSteps[nativeCameraStepIndex].duration = getDuration();
      // console.log('injaaaa', updatedTestSteps[nativeCameraStepIndex])
      setTestsSteps(updatedTestSteps);
      setTestStep((prevStep) => prevStep + 1);
    } else {
      console.log('No step found');
    }
  }, [testSteps, setTestsSteps, setTestStep, fileBase64, getDuration]);

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting permissions...</Text>
        <ActivityIndicator size="large" color="#4908b0" />
      </View>
    );
  }
  return (
    <>
      {isTimerVisible && <Timer />}
      <View style={styles.container}>
        <AnimatedIcon />

        {photoUri ? (
          <Image source={{ uri: `file://${photoUri}` }} style={styles.photo} />
        ) : (
          <View style={styles.cameraContainer}>
            <Text style={styles.text}>Waiting for camera...</Text>
            <ActivityIndicator size="large" color="#4908b0" />
          </View>
        )}
        {photoUri && (
          <View style={styles.btnContainer}>
            <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass', photoUri)}>
              Pass
            </Button>
          </View>
        )}
      </View>
    </>
  );
};

export default NativeCameraPhoto;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  photo: {
    width: '100%',
    height: '90%',
    objectFit: 'contain',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    height: '10%',
  },
  btns: {
    padding: 8,
    borderRadius: 8
  },
  btnLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 17,
  },
});