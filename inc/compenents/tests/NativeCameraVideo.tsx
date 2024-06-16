import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, Alert, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { Button } from 'react-native-paper';
import { launchCamera } from 'react-native-image-picker';
import { DataContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';

const NativeCameraVideo = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [videoUri, setVideoUri] = useState(null);
  const getDuration = useStepTimer();


  useEffect(() => {
    // Prevent hardware back button press
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
        mediaType: 'video',
        cameraType: 'back',
        quality: 0.7,
        durationLimit: 30, // Limit the duration of the video to 30 seconds
      },
      async (response) => {
        if (response.didCancel) {
          handleResult('Fail');
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
          handleResult('Fail');
        } else {
          setVideoUri(response.assets[0].uri);
          // handleResult('Pass', response.assets[0].uri);
        }
      }
    );
  };

  const handleResult = useCallback((result) => {
    const updatedTestSteps = [...testSteps];
    const nativeCameraStepIndex = updatedTestSteps.findIndex((step) => step.title === 'NativeCameraVideo');

    if (nativeCameraStepIndex !== -1) {
      updatedTestSteps[nativeCameraStepIndex].result = result;
      updatedTestSteps[nativeCameraStepIndex].duration = getDuration();
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
        {videoUri ? (
          <Video source={{ uri: videoUri }} style={styles.video} controls />
        ) : (
          <View style={styles.cameraContainer}>
            <Text style={styles.text}>Waiting for camera...</Text>
            <ActivityIndicator size="large" color="#4908b0" />

          </View>
        )}
        {videoUri && (
          <View style={styles.btnContainer}>
            <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass', videoUri)}>
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
  video: {
    width: '100%',
    height: '90%',
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

export default NativeCameraVideo;
