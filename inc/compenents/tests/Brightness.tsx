import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, StatusBar } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { Button } from 'react-native-paper';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { DataContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';
import sendWsMessage from '../../utils/wsSendMsg'
import AnimatedIcon from '../../utils/AnimatedIcon'


const Brightness = () => {
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const { testStep, setTestStep, testSteps, setTestsSteps, wsSocket, receivedUuid } = useContext(DataContext);
  const [brightness, setBrightness] = useState(1);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const autoAdjustRef = useRef(autoAdjust);
  const timeoutRef = useRef(null);
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

    const fetchBrightness = async () => {
      try {
        await DeviceBrightness.setBrightnessLevel(brightness);
        // Automatic brightness transition
        timeoutRef.current = setTimeout(async () => {
          await transitionBrightness(1, 0);
          await transitionBrightness(0, 1);
        }, 1000);
      } catch (error) {
        console.error("Error setting initial brightness:", error);
      }
    };

    fetchBrightness();

    return () => {
      backHandler.remove();
      showNavigationBar();
      clearTimeout(timeoutRef.current);
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
    autoAdjustRef.current = autoAdjust;
  }, [autoAdjust]);

  const handleBackButtonPress = () => true;

  const transitionBrightness = async (start, end) => {
    const steps = 20;
    const delay = 50;
    const stepSize = (end - start) / steps;

    for (let i = 0; i <= steps; i++) {
      if (!autoAdjustRef.current) break;

      const newBrightness = start + i * stepSize;
      setBrightness(newBrightness);
      try {
        await DeviceBrightness.setBrightnessLevel(newBrightness);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error("Error during brightness transition:", error);
      }
    }
  };

  const handleBrightnessChange = async (value) => {
    setAutoAdjust(false);
    setBrightness(value);
    try {
      await DeviceBrightness.setBrightnessLevel(value);
    } catch (error) {
      console.error("Error setting brightness:", error);
    }
  };

  // const handleResult = useCallback((result) => {
  //   const updatedTestSteps = [...testSteps];
  //   updatedTestSteps[testStep - 1].result = result;
  //   setTestsSteps(updatedTestSteps);
  //   setTestStep((prevStep) => prevStep + 1);
  // }, [testStep, testSteps, setTestsSteps, setTestStep]);


  const handleResult = (result) => {
    const updatedTestSteps = [...testSteps];
    updatedTestSteps[testStep - 1].result = result;
    updatedTestSteps[testStep - 1].duration = getDuration();
    setTestsSteps(updatedTestSteps);
    setTestStep((prevStep) => prevStep + 1);
  };

  return (
    <>

      {isTimerVisible && <Timer />}
      <AnimatedIcon />
      <View style={styles.container}>
        <Text style={styles.text}>Adjust the screen brightness using the slider below:</Text>
        <Text style={styles.text}>Current Brightness: {Math.round(brightness * 100)}%</Text>
        <View style={styles.sliderContainer}>
          <Icon name="white-balance-sunny" size={30} color="#4908b0" />
          <Slider
            style={[styles.range, { width: '85%', height: 40 }]}
            minimumValue={0}
            maximumValue={1}
            value={brightness}
            onValueChange={handleBrightnessChange}
            minimumTrackTintColor="#FFF"
            maximumTrackTintColor="#000000"
            thumbTintColor='#4908b0'
          />
        </View>
        <View style={styles.btnContainer}>
          <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
            Fail
          </Button>
          <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
            Skip
          </Button>
          <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
            Pass
          </Button>
        </View>
      </View>
    </>
  );
};

export default Brightness;

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
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0
  },
  range: {
    height: 40,
  },
  btns: {
    padding: 8,
    borderRadius: 8
  },
  btnLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 17
  },
});
