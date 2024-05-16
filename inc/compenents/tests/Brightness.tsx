import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import SystemBrightness from 'react-native-screen-brightness';

const Brightness = () => {
  const setBrightness = async (value) => {
    try {
      await SystemBrightness.setBrightness(value);
    } catch (error) {
      console.error('Failed to set brightness:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Increase Brightness"
        onPress={() => setBrightness(0.75)} // Set brightness to 75%
      />
      <Button
        title="Decrease Brightness"
        onPress={() => setBrightness(0.25)} // Set brightness to 25%
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Brightness;
