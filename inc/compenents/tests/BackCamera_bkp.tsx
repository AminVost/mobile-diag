import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, Platform, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-paper';
import { DataContext } from '../../../App';
import RNFS from 'react-native-fs';

const BackCamera = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message: 'Cool Photo App needs access to your camera so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          setPermissionsGranted(true);
        } else {
          console.log('Camera permission denied');
          Alert.alert('Permission Required', 'Camera permission is required to take pictures.');
        }
      } else {
        // iOS permission request (handled by react-native-camera)
        setPermissionsGranted(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      // Capture the photo
      const options = { quality: 1, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      // console.log('data  ', data);
      
      const directoryPath = `${RNFS.PicturesDirectoryPath}/RapidMobileDiag`;
      await RNFS.mkdir(directoryPath);
      // Define the file path
      const filePath = `${directoryPath}/${testSteps[testStep - 1].title}2.jpg`;
      console.log('filePath  ', filePath);


      // Save the photo
      RNFS.writeFile(filePath, data.base64, 'base64')
        .then(() => {
          setPhotoUri(filePath); // Update the state with the file path
          console.log('photoUri ', filePath)
        })
        .catch(err => {
          console.error('Error saving photo:', err); // Log any error
        });
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          {/* Display the saved photo */}
          <Image source={{ uri: `file://${photoUri}` }} style={styles.photo} />
          <View style={styles.btnContainer}>
            <Button mode="contained" onPress={() => handleResult('Fail')}>Fail</Button>
            <Button mode="contained" onPress={() => handleResult('Skip')}>Skip</Button>
            <Button mode="contained" onPress={() => handleResult('Pass')}>Pass</Button>
          </View>
        </>
      ) : (
        <RNCamera
          ref={ref => setCameraRef(ref)}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
        >
          <View style={styles.captureContainer}>
            <Button mode="contained" onPress={takePicture}>Take Picture</Button>
          </View>
        </RNCamera>
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
});
