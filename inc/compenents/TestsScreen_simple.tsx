import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestDeviceScreen = () => {
  const [testStep, setTestStep] = useState(0);
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testSteps = [
    'Test Step 1: Check Battery Health',
    'Test Step 2: Check Network Connection',
  ];

  const performTestStep = async () => {
    switch (testStep) {
      case 0:
        console.log('before checkBatteryHealth')
        const batteryHealth = await checkBatteryHealth();
        console.log('after checkBatteryHealth  ', batteryHealth)
        setTestResults((prevResults) => ({ ...prevResults, batteryHealth }));
        break;
      case 1:
        console.log('before checkNetworkConnection')
        const networkStatus = await checkNetworkConnection();
        console.log('after checkNetworkConnection  ', networkStatus)
        setTestResults((prevResults) => ({ ...prevResults, networkStatus }));
        break;
      default:
        break;
    }

    setTestStep((prevStep) => prevStep + 1);
  };

  const sendTestResults = async () => {
    setIsLoading(true);
    try {
      // Send test results to API
      // await sendTestDataToAPI(testResults);
      console.log('Test data sent successfully!');
    } catch (error) {
      console.error('Error sending test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (testStep < testSteps.length) {
      // performTestStep();
    } else {
      sendTestResults();
    }
  }, [testStep]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'black' }} > dddd{testSteps[testStep]}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button textColor='white' icon="rocket-launch" mode="outlined" onPress={performTestStep} disabled={isLoading}>
          Next
        </Button>
      )}
    </View>
  );
};

const checkBatteryHealth = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('In checkBatteryHealth');
      resolve('ok');
    }, 1000);
  });
};

const checkNetworkConnection = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('In checkNetworkConnection');
      resolve('strong');
    }, 1000);
  });
};

export default TestDeviceScreen;

