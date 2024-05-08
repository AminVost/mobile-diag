import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const executeSpecificationTests = async (testStep, testSteps) => {
    return new Promise(async (resolve, reject) => {
        try {
            testSteps[testStep].subset.find((item) => item.title === 'Model').value = DeviceInfo.getModel();
            testSteps[testStep].subset.find((item) => item.title === 'Device Name').value = await DeviceInfo.getDeviceName();
            testSteps[testStep].subset.find((item) => item.title === 'Brand').value = DeviceInfo.getBrand();
            testSteps[testStep].subset.find((item) => item.title === 'Device').value = await DeviceInfo.getDevice();
            testSteps[testStep].subset.find((item) => item.title === 'OS').value = Platform.OS;
            testSteps[testStep].subset.find((item) => item.title === 'Manufacturer').value = await DeviceInfo.getManufacturer();
            resolve('');
        } catch (error) {
            console.error('Error executing specification tests:', error);
            reject(error);
        }
    });
};