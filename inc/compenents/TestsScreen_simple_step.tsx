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

const SpecificationTestComponent = ({ test }) => {
  return (
    <View>
      <Text>{test.title}: {test.value}</Text>
      {/* You can add more customizations or components for each test here */}
    </View>
  );
};

const renderTestComponent = (test) => {
  switch (test.title) {
    case 'Device Name':
    case 'OS':
    case 'Brand':
      return <SpecificationTestComponent test={test} />;
    // Add cases for other test titles here
    default:
      return null; // Default case, returns null if test title doesn't match any case
  }
};

const testCategories = [
  {
    title: 'Specification Test',
    tests: [
      { title: 'Device Name', value: 'Device A' },
      { title: 'OS', value: 'Android' },
      { title: 'Brand', value: 'Samsung' },
    ],
  },
  // Add more test categories as needed
];

const TestDeviceScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = testCategories.reduce((acc, category) => acc + category.tests.length, 0);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSkipStep = () => {
    // Implement skipping logic here
    // For now, just move to the next step
    handleNextStep();
  };

  const currentCategory = testCategories.find(
    (category) => currentStep < category.tests.length
  );
  const currentTest = currentCategory ? currentCategory.tests[currentStep] : null;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test Stage: {currentStep + 1}/{totalSteps}</Text>
      {currentCategory && (
        <View>
          <Text>Test Title: {currentCategory.title}</Text>
          <View style={{ marginTop: 20 }}>
            {renderTestComponent(currentTest)}
          </View>
        </View>
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Next" onPress={handleNextStep} />
        <Button title="Skip" onPress={handleSkipStep} />
      </View>
    </View>
  );
};

export default TestDeviceScreen;


