import React from 'react';
import { View, Button, Alert } from 'react-native';
import factoryReset from './DeviceReset';

const App = () => {
  const handleFactoryReset = () => {
    Alert.alert(
      "Confirm Factory Reset",
      "This will erase all data on the device. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: factoryReset }
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <Button title="Factory Reset" onPress={handleFactoryReset} />
    </View>
  );
};

export default App;
