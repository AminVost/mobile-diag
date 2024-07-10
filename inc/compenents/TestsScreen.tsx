import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { DataContext } from '../../App';
import sendWsMessage from '../utils/wsSendMsg'

const TestsScreens = ({ navigation, route }) => {
  const { testStep, testSteps, setTestsSteps, startContinue, wsSocket, receivedUuid, setIsFinishedTests } = useContext(DataContext);
  const hasSortedRef = useRef(false);

  const performTestStep = async () => {
    console.log('performTestStep');

    const sortedTestSteps = [...testSteps].sort((a, b) => a.priority - b.priority);
    setTestsSteps(sortedTestSteps);
    hasSortedRef.current = true;
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
          // navigation.navigate('HiddenStack', { screen: 'Rotation' });
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

  // useEffect(() => {
  //   if (!testStep) {
  //     return;
  //   }
  //   if (testStep <= testSteps.length) {
  //     performTestStep();
  //   } else {
  //     console.log('finished test');
  //     setIsFinishedTests(true);
  //     sendWsMessage(wsSocket, {
  //       uuid: receivedUuid,
  //       type: 'progress'
  //     });
  //     navigation.navigate('Report');
  //   }

  //   return () => '';
  // }, [testStep, startContinue]);

  useEffect(() => {
    if (!testStep) {
      return;
    }
    if (testStep <= testSteps.length) {
      performTestStep();
    } else {
      console.log('finished test');
      // setIsDiagStart(false);
      setIsFinishedTests(true);

      sendWsMessage(wsSocket, {
        uuid: receivedUuid,
        type: 'progress',
        status: 'readyToSubmit'
      });
      navigation.navigate('Report');
    }

    return () => {
      console.log('unmount testScreen')

    };
  }, [testStep, startContinue]);

  useEffect(() => {
    if (wsSocket) {
      const handleWebSocketMessage = (event) => {
        if (event) {
          console.log('Received event.data in TestsScreen:', event.data);
          const message = JSON.parse(event.data);
          if (message.type === 'action' && message.action === 'submit') {
            navigation.navigate('Report')
          } else if (message.type === 'action' && message.action === 'handleContinueDiag') {
            navigation.navigate('Home', { isContinue: true })
          }
        };
      };

      wsSocket.addEventListener('message', handleWebSocketMessage);
      return () => {
        console.log('disabled addEventListener testScreen')
        wsSocket.removeEventListener('message', handleWebSocketMessage);
      };
    }
  }, [wsSocket]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4908b0" />
      <Text style={styles.text}>Preparing test procedures</Text>
    </View>
  );
};

export default TestsScreens;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Quicksand-SemiBold'
  }
});