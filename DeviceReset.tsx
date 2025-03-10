import { NativeModules } from 'react-native';

const { DeviceResetModule } = NativeModules;

const factoryReset = async () => {
  try {
    const result = await DeviceResetModule.factoryReset();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export default factoryReset;
