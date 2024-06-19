import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Alert,ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { DataContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';

const NativeCameraPhoto = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);
  const getDuration = useStepTimer();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    openNativeCamera();
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackButtonPress = () => {
    return true; // Prevent going back
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
          handleResult('Skip');
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
          handleResult('Fail');
        } else {
          const photoPath = await savePhoto(response.assets[0].uri);
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
      updatedTestSteps[nativeCameraStepIndex].result = result;
      updatedTestSteps[nativeCameraStepIndex].duration = getDuration();
      if (photoPath) {
        updatedTestSteps[nativeCameraStepIndex].filePath = photoPath;
      }
      setTestsSteps(updatedTestSteps);
      setTestStep((prevStep) => prevStep + 1);
    } else {
      console.log('No step found');
    }
  }, [testSteps, setTestsSteps, setTestStep]);

  return (
    <>
      <Timer />
      <View style={styles.container}>
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
  },
  btnLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 17,
  },
});

export default NativeCameraPhoto;