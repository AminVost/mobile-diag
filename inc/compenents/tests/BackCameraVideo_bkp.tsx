import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import { requestPermissions, openAppSettings } from '../CameraPermission';
import Video from 'react-native-video'; // Import the Video component

const BackCameraVideo = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [videoUri, setVideoUri] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isActiveCamera, setisActiveCamera] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const cameraRef = useRef(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    requestCameraPermission();
    return () => {
      backHandler.remove();
      // Cleanup the camera reference on component unmount
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    if (permissionsGranted && !device) {
      console.log('No camera device found');
    }
  }, [permissionsGranted, device]);

  const handleBackButtonPress = () => {
    setAlertVisible(!isAlertVisible);
    return true;
  };

  const requestCameraPermission = async () => {
    const permissionStatus = await requestPermissions();
    console.log('permissionStatus', permissionStatus);
    if (permissionStatus === 'granted') {
      setPermissionsGranted(true);
    } else if (permissionStatus === 'never_ask_again' || permissionStatus === 'denied') {
      openAppSettings();
    }
  };

  const recordVideo = async () => {
    if (!permissionsGranted) {
      Alert.alert('Permissions not granted', 'Please grant the necessary permissions to use the camera.');
      return;
    }

    if (!device) {
      console.error('No camera device found');
      return;
    }

    if (cameraRef.current) {
      try {
        setVideoUri(null); // Reset video URI before starting a new recording
        setisActiveCamera(true);
        await cameraRef.current.startRecording({
          onRecordingFinished: (video) => setVideoUri(video.path),
          onRecordingError: (error) => console.error('Recording Error: ', error),
        });
        console.log('videoUri', videoUri)

        setTimeout(() => {
          cameraRef.current.stopRecording();
          setisActiveCamera(false);
        }, 5000);
      } catch (error) {
        console.error('Error starting recording', error);
        if (error.message.includes('prepare failed')) {
          Alert.alert('Error', 'Prepare failed, please ensure no other app is using the camera');
        }
      }
    } else {
      console.log('Camera not initialized');
    }
  };

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    if (videoUri) {
      updatedTestSteps[testStep - 1].data = videoUri;
    }
    setTestsSteps(updatedTestSteps);
    setTestStep((prevStep) => prevStep + 1);
    console.log(testSteps);
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
      onRequestClose={toggleAlert}
    >
      <View style={styles.modalBackground}>
        <View style={styles.customModalContent}>
          <Text style={styles.customModalTitle}>Please select the Back Camera test result</Text>
          <View style={styles.customModalRow}>
            <Icon name="camera-enhance-outline" size={100} color="#4908b0" />
          </View>
          <View style={styles.customModalBtns}>
            <Button mode="contained" buttonColor="#e84118" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="contained" buttonColor="#7f8fa6" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="contained" buttonColor="#44bd32" textColor="white" style={styles.stepTestBtn} onPress={() => handleResult('Pass')}>
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
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            controls={true}
          />
          <View style={styles.btnContainer}>
            <Button mode="contained" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
              Fail
            </Button>
            <Button mode="contained" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
              Skip
            </Button>
            <Button mode="contained" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
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
            isActive={isActiveCamera}
            video={true}
            audio={true} // Enable audio if required
            onError={(error) => console.error('Camera Error: ', error)} // Handle camera errors
          />
          <TouchableOpacity style={styles.btnTakeVideo} onPress={recordVideo}>
            <Icon name="checkbox-blank-circle" size={70} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <CustomAlert />
    </View>
  );
};
export default BackCameraVideo;


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
  btnTakeVideo: {
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  customModalBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
