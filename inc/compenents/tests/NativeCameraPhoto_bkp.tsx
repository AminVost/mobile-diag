import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import { DataContext } from '../../../App';
import Timer from '../Timer';

const NativeCameraPhoto = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    openNativeCamera();
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackButtonPress = () => {
    // Prevent going back
    return true;
  };

  const openNativeCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
      },
      (response) => {
        if (response.didCancel) {
          handleResult('Fail');
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
          handleResult('Fail');
        } else {
          setPhotoUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    const nativeCameraStepIndex = updatedTestSteps.findIndex((step) => step.title === 'NativeCameraPhoto');

    if (nativeCameraStepIndex !== -1) {
      updatedTestSteps[nativeCameraStepIndex].result = result;
      setTestsSteps(updatedTestSteps);
      setTestStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <>
      <Timer />
      <View style={styles.container}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.cameraContainer}>
            <Text style={styles.text}>Waiting for camera...</Text>
          </View>
        )}
        <View style={styles.btnContainer}>
          <Button
            mode="elevated"
            buttonColor="#e84118"
            textColor="white"
            style={styles.btns}
            labelStyle={styles.btnLabel}
            onPress={() => handleResult('Fail')}
          >
            Fail
          </Button>
          <Button
            mode="elevated"
            buttonColor="#44bd32"
            textColor="white"
            style={styles.btns}
            labelStyle={styles.btnLabel}
            onPress={() => handleResult('Pass')}
          >
            Pass
          </Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  btns: {
    margin: 10,
    paddingHorizontal: 20,
  },
  btnLabel: {
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default NativeCameraPhoto;
