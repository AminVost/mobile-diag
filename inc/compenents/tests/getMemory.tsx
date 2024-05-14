import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getMemory = async (testStep, testSteps) => {
    return new Promise(async (resolve, reject) => {
        console.log('in getMemory Func');
        try {
            const getMaxMemoryBytes = await DeviceInfo.getMaxMemory();
            const getTotalMemoryBytes = await DeviceInfo.getTotalMemory();
            const getUsedMemoryBytes = await DeviceInfo.getUsedMemory();

            const getMaxMemoryGB = getMaxMemoryBytes ? (getMaxMemoryBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB' : 'unknown';
            const getTotalMemoryGB = getTotalMemoryBytes ? (getTotalMemoryBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB' : 'unknown';
            const getUsedMemoryGB = getUsedMemoryBytes ? (getUsedMemoryBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB' : 'unknown';

            console.log('getMaxMemory: ', getMaxMemoryGB);
            console.log('getTotalMemory: ', getTotalMemoryGB);
            console.log('getUsedMemory: ', getUsedMemoryGB);

            testSteps[testStep].subset.find((item) => item.title === 'getMaxMemory').value = getMaxMemoryGB;
            testSteps[testStep].subset.find((item) => item.title === 'getTotalMemory').value = getTotalMemoryGB;
            testSteps[testStep].subset.find((item) => item.title === 'getUsedMemory').value = getUsedMemoryGB;

            resolve('');
        } catch (error) {
            console.error('Error executing getMemory tests:', error);
            reject(error);
        }
    });
};

