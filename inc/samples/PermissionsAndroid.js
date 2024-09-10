import {PermissionsAndroid} from 'react-native';

const requestReadPhoneStatePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: 'IMEI Permission',
        message: 'App needs access to IMEI for (explain reason here)', // Replace with your reason
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true; // Permission granted
    } else {
      console.warn('IMEI permission denied');
      return false; // Permission denied
    }
  } catch (err) {
    console.warn(err);
    return false; // Handle errors
  }
};

export default requestReadPhoneStatePermission;
