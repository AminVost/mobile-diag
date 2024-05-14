import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getSpecifications = async (testStep, testSteps) => {
    return new Promise(async (resolve, reject) => {
        console.log('in getSpecifications Func');
        try {
            const model = DeviceInfo.getModel();
            const deviceName = await DeviceInfo.getDeviceName();
            const brand = DeviceInfo.getBrand();
            const device = await DeviceInfo.getDevice();
            const deviceType = DeviceInfo.getDeviceType() === 'Handset' ? 'Mobile' : DeviceInfo.getDeviceType();
            const OS = Platform.OS;
            const osVersion = DeviceInfo.getSystemVersion();
            const manufacturer = await DeviceInfo.getManufacturer();

            testSteps[testStep].subset.find((item) => item.title === 'Model').value = model ? model : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'Device Name').value = deviceName ? deviceName : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'Brand').value = brand ? brand : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'Device').value = device ? device : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'Device Type').value = deviceType ? deviceType : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'OS').value = OS ? OS : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'OS Version').value = osVersion ? osVersion : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'Manufacturer').value = manufacturer ? manufacturer : 'unknown';
            resolve('');
        } catch (error) {
            console.error('Error executing specification tests:', error);
            reject(error);
        }
    });
};