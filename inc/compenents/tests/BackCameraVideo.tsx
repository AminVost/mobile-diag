import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext, TimerContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';
import RNFS from 'react-native-fs';
import { requestPermissions, openAppSettings } from '../CameraPermission';
import Video from 'react-native-video';
import sendWsMessage from '../../utils/wsSendMsg'
import AnimatedIcon from '../../utils/AnimatedIcon'

const BackCameraVideoTest = ({ navigation }) => {
  const { testStep, setTestStep, testSteps, setTestsSteps, elapsedTime, setElapsedTime, wsSocket, receivedUuid, isSingleTest, isFinishedTests } = useContext(DataContext);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [videoPath, setVideoPath] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const device = useCameraDevice('back');
  const getDuration = useStepTimer();


  useEffect(() => {
    if (isSingleTest) {
      sendWsMessage(wsSocket, {
        uuid: receivedUuid,
        type: 'progress',
        status: 'step',
        step: 'singleTest',
        currentStep: testSteps[testStep - 1].title
      });
    } else {
      sendWsMessage(wsSocket, {
        uuid: receivedUuid,
        type: 'progress',
        status: 'step',
        step: testStep + '/' + testSteps.length,
        currentStep: testSteps[testStep - 1].title
      });
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    requestCameraPermission();
    return () => {
      console.log('unmounting... backCamera');
      setCameraActive(false);
      backHandler.remove();
      setIsTimerVisible(false);
    };
  }, []);

  const handleBackButtonPress = useCallback(() => {
    return true;
  }, []);

  const requestCameraPermission = async () => {
    const permissionStatus = await requestPermissions();
    console.log('permissionStatus: ', permissionStatus)
    if (permissionStatus === 'granted') {
      setPermissionsGranted(true);
    } else if (permissionStatus === 'never_ask_again' || permissionStatus === 'denied') {
      openAppSettings();
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.startRecording({
        flash: 'off',
        onRecordingFinished: (video) => handleVideoSaved(video),
        onRecordingError: (error) => console.error(error),
      });
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      setCameraActive(false); // Disable the camera after stopping the recording
    }
  };

  const handleVideoSaved = async (video) => {
    const directoryPath = `${RNFS.PicturesDirectoryPath}/RapidMobileDiag`;
    try {
      await RNFS.mkdir(directoryPath);
    } catch (err) {
      console.error('Error creating directory:', err);
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `BackCamera_${formattedDate}_${formattedTime}.mp4`;
    const filePath = `${directoryPath}/${fileName}`;
    setVideoPath(filePath);

    try {
      await RNFS.copyFile(video.path, filePath);
      setVideoUri(filePath);
    } catch (err) {
      console.error('Error saving video:', err);
    }
  };

  const handleResult = useCallback((result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    updatedTestSteps[testStep - 1].duration = getDuration();
    if (videoPath) {
      updatedTestSteps[testStep - 1].filePath = videoPath;
    }
    setTestsSteps(updatedTestSteps);
    if (isSingleTest && isFinishedTests) {
      sendWsMessage(wsSocket, {
        uuid: receivedUuid,
        type: 'progress',
        status: 'readyToSubmit'
      });
      navigation.navigate('Report');
    } else {
      setTestStep((prevStep) => prevStep + 1);
    }
  }, [testStep, testSteps, videoPath, setTestStep, setTestsSteps, isFinishedTests, isSingleTest]);



  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting permissions...</Text>
        <ActivityIndicator size="large" color="#4908b0" />
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
    <>
      {isTimerVisible &&
        <Timer />}
      <View style={styles.container}>
        <AnimatedIcon />

        {videoUri ? (
          <>
            <Video source={{ uri: `file://${videoUri}` }} style={styles.video} controls={true} />
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
            <Camera ref={cameraRef} style={styles.preview} device={device} isActive={cameraActive} video={true} />
            <TouchableOpacity style={styles.btnTakeVid} onPress={isRecording ? stopRecording : startRecording}>
              <Icon name={isRecording ? "stop-circle" : "checkbox-blank-circle"} size={70} color={"#fff"} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default BackCameraVideoTest;


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
  btnTakeVid: {
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '10%',
  },
  video: {
    width: '100%',
    height: '90%',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  btns: {
    padding: 7,
    borderRadius: 8
  },
  btnLabel: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
