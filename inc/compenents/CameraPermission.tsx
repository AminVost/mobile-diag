import { PermissionsAndroid, Alert, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Camera } from 'react-native-vision-camera';

export const requestPermissions = async () => {
  let systemVersion = parseFloat(DeviceInfo.getSystemVersion());
  console.log('systemVersion', systemVersion);

  if (Platform.OS === 'android') {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
    ];

    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      console.log('granted[] ', granted);

      const cameraPermission = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
      const audioPermission = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
      const writePermission = granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
      console.log('writePermission : ', writePermission);
      const readPermission = granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
      console.log('readPermission : ', readPermission);

      if (systemVersion >= 10) {
        if (cameraPermission && audioPermission) {
          return 'granted';
        }
      } else {
        if (cameraPermission && audioPermission && writePermission && readPermission) {
          return 'granted';
        }
      }

      if (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return 'never_ask_again';
      } else {
        return 'denied';
      }
    } catch (err) {
      console.warn(err);
      return 'denied';
    }
  } else {
    // Handle iOS permissions if needed
    console.log('iOS Device');
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
