import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageTestSteps = async data => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('refTestSteps', jsonValue);
    console.log('saved storageTestSteps in AsyncStorage');
  } catch (error) {
    console.log('Error storing refTestSteps:', error);
  }
};
