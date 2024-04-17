import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async data => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('deviceparams', jsonValue);
  } catch (error) {
    console.log('Error storing data:', error);
  }
};
