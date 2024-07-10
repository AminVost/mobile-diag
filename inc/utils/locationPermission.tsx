import { PermissionsAndroid, Alert,Linking } from 'react-native';

export const locationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:'This app needs location permission as this is required  ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return 'granted'
        } else {
            return 'denied'
        }
    } catch (err) {
        console.warn(err);
        return false; // Handle errors
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
