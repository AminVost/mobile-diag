import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoImage from './assets/images/logo.png';
// import { sendTestDataToAPI } from './api';

const TestDeviceScreen = () => {
  const [testSteps, setTestSteps] = useState([]); // Array to store test steps
  const [testStepIndex, setTestStepIndex] = useState(0); // Index of the current test step
  const [testResults, setTestResults] = useState({}); // Object to store test results
  const [isLoading, setIsLoading] = useState(false); // Loading state while sending data to API

  // Define test steps with details and priorities
  const testStepsData = [
    { name: 'Battery Health', description: 'Check battery health', resultKey: 'batteryHealth', priority: 1 },
    { name: 'Network Connection', description: 'Check network connection', resultKey: 'networkStatus', priority: 2 },
    // Add more test steps with details and priorities as needed
  ];

  // Function to sort test steps based on priorities
  const sortTestStepsByPriority = () => {
    const sortedSteps = [...testStepsData].sort((a, b) => a.priority - b.priority);
    setTestSteps(sortedSteps);
  };

  // Function to perform each test step
  const performTestStep = async () => {
    // Perform the test corresponding to the current step
    const currentStep = testSteps[testStepIndex];
    switch (currentStep.name) {
      case 'Battery Health':
        // Code to check battery health
        const batteryHealth = await checkBatteryHealth();
        setTestResults((prevResults) => ({ ...prevResults, [currentStep.resultKey]: batteryHealth }));
        break;
      case 'Network Connection':
        // Code to check network connection
        const networkStatus = await checkNetworkConnection();
        setTestResults((prevResults) => ({ ...prevResults, [currentStep.resultKey]: networkStatus }));
        break;
      // Add cases for more test steps
      default:
        break;
    }

    // Store test results in AsyncStorage after each step
    await AsyncStorage.setItem('testResults', JSON.stringify(testResults));

    // Move to the next test step
    setTestStepIndex((prevIndex) => prevIndex + 1);
  };

  // Function to send test results to API
  const sendTestResultsToAPI = async () => {
    setIsLoading(true);
    try {
      // Send test results to API
      await sendTestDataToAPI(testResults);
      alert('Test data sent successfully!');
    } catch (error) {
      console.error('Error sending test data:', error);
      alert('Error sending test data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform the current test step when the component mounts or the test step changes
  useEffect(() => {
    if (testStepIndex < testSteps.length) {
      performTestStep();
    } else {
      // All test steps completed
      sendTestResultsToAPI();
    }
  }, [testStepIndex]);

  // Sort test steps by priority when the component mounts
  useEffect(() => {
    sortTestStepsByPriority();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{testSteps[testStepIndex].description}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Next" onPress={performTestStep} disabled={isLoading} />
      )}
    </View>
  );
};

// Function to check battery health (example)
const checkBatteryHealth = async () => {
  // Code to check battery health
  return 'Good'; // Example result
};

// Function to check network connection (example)
const checkNetworkConnection = async () => {
  // Code to check network connection
  return 'Connected'; // Example result
};

export default TestDeviceScreen;
