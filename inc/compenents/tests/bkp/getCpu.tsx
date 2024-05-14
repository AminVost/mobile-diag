import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getCpu = async (testStep, testSteps) => {
    return new Promise(async (resolve, reject) => {
        console.log('in getCpu Func');
        try {
            const supportedAbis = await DeviceInfo.supportedAbis();
            const getHardware = await DeviceInfo.getHardware();
            const supported32BitAbis = await DeviceInfo.supported32BitAbis();
            const supported64BitAbis = await DeviceInfo.supported64BitAbis();

            testSteps[testStep].subset.find((item) => item.title === 'CPU Model').value = getHardware ? getHardware : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'supportedAbis').value = supportedAbis ? supportedAbis : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'supported32BitAbis').value = supported32BitAbis ? supported32BitAbis : 'unknown';
            testSteps[testStep].subset.find((item) => item.title === 'supported64BitAbis').value = supported64BitAbis ? supported64BitAbis : 'unknown';
            // console.log('testSteps', supportedAbis , getHardware, supported32BitAbis , supported64BitAbis);
            resolve('');
        } catch (error) {
            console.error('Error executing specification tests:', error);
            reject(error);
        }
    });
};
