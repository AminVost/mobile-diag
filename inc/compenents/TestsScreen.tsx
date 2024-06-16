import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { DataContext, TimerContext } from '../../App';

const TestsScreens = ({ navigation, route }) => {
  const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
  const { startTime, setStartTime } = useContext(TimerContext);

  const performTestStep = async () => {
    const sortedTestSteps = [...testSteps].sort((a, b) => a.priority - b.priority);
    setTestsSteps(sortedTestSteps);
    if (testStep <= sortedTestSteps.length) {
      const currentTest = sortedTestSteps[testStep - 1];
      // console.log('currentTest', currentTest);
      // console.log('currentTest.title', currentTest.title);
      switch (currentTest.title) {
        case 'TouchScreen':
          navigation.navigate('TouchScreen');
          break;
        case 'Multitouch':
          navigation.navigate('MultiTouch');
          break;
        case 'Display':
          navigation.navigate('Display');
          break;
        case 'Brightness':
          navigation.navigate('Brightness');
          break;
        case 'Rotation':
          navigation.navigate('Rotation');
          break;
        case 'BackCamera':
          navigation.navigate('BackCamera');
          break;
        case 'FrontCamera':
          navigation.navigate('FrontCamera');
          break;
        case 'MultiCamera':
          navigation.navigate('MultiCamera');
          break;
        case 'BackCameraVideo':
          navigation.navigate('BackCameraVideo');
          break;
        case 'NativeCameraPhoto':
          navigation.navigate('NativeCameraPhoto');
          break;
        case 'NativeCameraVideo':
          navigation.navigate('NativeCameraVideo');
          break;
      }
    } else {
      console.log('step not found')
    }
  };

  const sendTestResults = async () => {
    try {
      // await sendTestDataToAPI(testResults);
      console.log('Test data sent successfully!');
    } catch (error) {
      console.error('Error sending test data:', error);
    } finally {
      console.log('Finally sending test data');
    }
  };

  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (testStep <= testSteps.length) {
      performTestStep();
    } else {
      console.log('hereeeeeee',testSteps);
      console.log('finished test')
      navigation.navigate('Report');
    }

    return () => '';
  }, [testStep]);

};

export default TestsScreens;