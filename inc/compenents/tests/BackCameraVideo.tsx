import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import RNFS from 'react-native-fs';
import { requestPermissions, openAppSettings } from '../CameraPermission';
import Video from 'react-native-video';

const BackCameraVideoTest = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [videoUri, setVideoUri] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const cameraRef = useRef(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const device = useCameraDevice('back');


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    requestCameraPermission();
    return () => {
      console.log('unmouting... backCamera')
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

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.startRecording({
        flash: 'on',
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

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    if (videoPath) {
      updatedTestSteps[testStep - 1].data = videoPath;
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
          <Text style={styles.customModalTitle}>Please select the Back Camera test result</Text>
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
    <View style={styles.container}>
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
      <CustomAlert visible={isAlertVisible} onClose={toggleAlert} />
    </View>
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
    textAlign: 'center',
    paddingBottom: 5,
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
  },
  customModalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  customModalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
