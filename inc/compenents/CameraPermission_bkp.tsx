import { PermissionsAndroid, Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export const requestPermissions = async () => {
  const readMediaImages = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    {
      title: 'Storage Permission',
      message: 'App needs access READ_MEDIA_IMAGES',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  console.log('readMediaImages' , readMediaImages)
  
  const writeGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'App needs access WRITE_EXTERNAL_STORAGE',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  console.log('writeGranted' , writeGranted)

  const readGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'App needs access READ_EXTERNAL_STORAGE',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
    );
    console.log('readGranted' , readGranted)

  if (writeGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || readGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return 'never_ask_again';
  }

  if (writeGranted === PermissionsAndroid.RESULTS.GRANTED && readGranted === PermissionsAndroid.RESULTS.GRANTED) {
  // if (readMediaImages === PermissionsAndroid.RESULTS.GRANTED) {
    const cameraPermission = await Camera.requestCameraPermission();
    const micPermission = await Camera.requestMicrophonePermission();

    if (cameraPermission === 'granted' && micPermission === 'granted') {
      return 'granted';
    } else {
      Alert.alert('Permission Required', 'Camera permission is required to take pictures.');
      return 'denied';
    }
  } else {
    console.log('EXTERNAL STORAGE permission denied');
    return 'denied';
  }
};

export const openAppSettings = () => {
  Alert.alert(
    'Permission Required',
    'Please go to the app settings and enable the necessary permissions.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
    { cancelable: false }
  );
};
