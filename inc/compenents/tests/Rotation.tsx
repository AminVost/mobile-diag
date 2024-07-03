import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, BackHandler, Dimensions } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';
import sendWsMessage from '../../utils/wsSendMsg'
import AnimatedIcon from '../../utils/AnimatedIcon'

const Rotation = () => {
  const { testStep, setTestStep, testSteps, setTestsSteps, wsSocket, receivedUuid } = useContext(DataContext);
  const [orientation, setOrientation] = useState('Portrait');
  const [orientationChanges, setOrientationChanges] = useState(0);
  const [testPassed, setTestPassed] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const getDuration = useStepTimer();

  useEffect(() => {
    sendWsMessage(wsSocket, {
      uuid: receivedUuid,
      type: 'progress',
      step: testStep + '/' + testSteps.length,
      currentStep: testSteps[testStep - 1].title
    });

    hideNavigationBar();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      const newOrientation = width > height ? 'Landscape' : 'Portrait';

      // Update orientation and count changes
      setOrientation((prevOrientation) => {
        if (prevOrientation !== newOrientation) {
          setOrientationChanges((prevChanges) => prevChanges + 1);
        }
        return newOrientation;
      });
    };

    // Initial check
    updateOrientation();

    // Add listener
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      backHandler.remove();
      subscription?.remove();
      showNavigationBar();
      setIsTimerVisible(false);
      sendWsMessage(wsSocket, {
        uuid: receivedUuid,
        type: 'progress',
        status: 'pause',
        currentStep: testSteps[testStep - 1].title
    });
    };
  }, []);

  useEffect(() => {
    // Automatically pass if orientation changes from portrait to landscape and back to portrait
    if (orientationChanges >= 2 && orientation === 'Portrait') {
      setTestPassed(true);
      setTimeout(() => {
        handleResult('Pass');
      }, 1000);
    }
  }, [orientationChanges, orientation]);

  const handleBackButtonPress = () => true;

  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    updatedTestSteps[testStep - 1].duration = getDuration();
    setTestsSteps(updatedTestSteps);
    setTestStep((prevStep) => prevStep + 1);
  };

  return (
    <View style={styles.container}>
      <AnimatedIcon />
      {isTimerVisible && <Timer />}
      {testSteps[testStep - 1]?.text &&
        < Text style={styles.text}>
          {testSteps[testStep - 1].text}
        </Text>
      }
      {
        testPassed ? (
          <>
            <Icon name="check-circle" size={130} color="#44bd32" />
            <Text style={[styles.orientationText, styles.orientationSuccessText]}>Auto-rotation is working correctly</Text>
          </>
        ) : (
          <>
            <Icon
              name={orientation === 'Portrait' ? 'phone-rotate-landscape' : 'phone-rotate-portrait'}
              size={140}
              color="#4908b0"
            />
            <Text style={[styles.orientationText]}>Current Orientation: {orientation}</Text>
          </>
        )
      }
      <View style={styles.btnContainer}>
        <Button
          mode="elevated"
          buttonColor="#e84118"
          textColor="white"
          style={styles.btns}
          labelStyle={styles.btnLabel}
          onPress={() => handleResult('Fail')}
        >
          Fail
        </Button>
        <Button
          mode="elevated"
          buttonColor="#7f8fa6"
          textColor="white"
          style={styles.btns}
          labelStyle={styles.btnLabel}
          onPress={() => handleResult('Skip')}
        >
          Skip
        </Button>
        <Button
          mode="elevated"
          buttonColor="#44bd32"
          textColor="white"
          style={styles.btns}
          labelStyle={styles.btnLabel}
          onPress={() => handleResult('Pass')}
        >
          Pass
        </Button>
      </View>
    </View >
  );
};

export default Rotation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    margin: 10,
    fontFamily: 'Quicksand-SemiBold',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20
  },
  orientationText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: '#4908b0',
    fontFamily: 'Quicksand-Bold'
  },
  orientationSuccessText: {
    color: '#27ae60',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0
  },
  btns: {
    padding: 7,
    borderRadius: 8
  },
  btnLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 17
  },
});
