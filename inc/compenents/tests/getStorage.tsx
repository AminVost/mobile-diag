import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getStorage = async (testStep, testSteps) => {
    return new Promise(async (resolve, reject) => {
        console.log('in getStorage Func');
        try {
            const totalDiskCapacity = await DeviceInfo.getTotalDiskCapacity();
            const freeDiskStorage = await DeviceInfo.getFreeDiskStorage();

            // Convert bytes to gigabytes
            const totalGB = totalDiskCapacity && !isNaN(totalDiskCapacity) ? (totalDiskCapacity / (1024 * 1024 * 1024)).toFixed(2) + ' GB' : 'unknown';
            const freeGB = freeDiskStorage && !isNaN(freeDiskStorage) ? (freeDiskStorage / (1024 * 1024 * 1024)).toFixed(2) + ' GB'  : 'unknown';
            const usedGB = (!isNaN(totalDiskCapacity) && !isNaN(freeDiskStorage)) && totalDiskCapacity && freeDiskStorage ? ((totalDiskCapacity - freeDiskStorage) / (1024 * 1024 * 1024)).toFixed(2) + ' GB'  : 'unknown';

            testSteps[testStep].subset.find((item) => item.title === 'Total').value = `${totalGB}`;
            testSteps[testStep].subset.find((item) => item.title === 'Used').value = `${usedGB}`;
            testSteps[testStep].subset.find((item) => item.title === 'Free').value = `${freeGB}`;

            resolve('');
        } catch (error) {
            console.error('Error executing specification tests:', error);
            reject(error);
        }
    });
};
