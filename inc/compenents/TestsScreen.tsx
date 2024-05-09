import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Image, Modal, Pressable, Linking, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RNCamera } from 'react-native-camera';
import { Button, PaperProvider, Switch, Tooltip, Avatar, Card, IconButton, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { executeSpecificationTests } from '../testComponents/executeSpecificationTests'; 

const TestDeviceScreen = ({ navigation, route }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [testStep, setTestStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testData, setTestData] = useState([]);
  const [testSteps, setTestsStep] = useState([
    {
      title: 'Specification',
      icon: 'cellphone-cog',
      subset: [
        { title: 'Model', value: null },
        { title: 'Device Name', value: null },
        { title: 'Brand', value: null },
        { title: 'Device', value: null },
        { title: 'OS', value: null },
        { title: 'Manufacturer', value: null },
      ],
      priority: 1,
    },
    {
      title: 'CPU',
      icon: 'cpu-64-bit',
      subset: [
        { title: 'CPU Model', value: null },
        { title: 'Core Quantity', value: null },
        { title: 'CPU Architecture', value: null },
      ],
      priority: 2,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const performTestStep = async () => {
    switch (testStep) {
      case 0:
        executeSpecificationTests(testStep, testSteps, setTestsStep)        
          .then(() => {
            console.log('in case 0');
            // setTestStep(prevStep => prevStep + 1);
          })
          .catch(error => {
            console.error('Error executing specification tests:', error);
          });
        break;
      case 1:
        await executeCallFunctionTests()
          .then(() => {
            console.log('in case 1', specificationResults);
            // setTestStep(prevStep => prevStep + 1);
          })
          .catch(error => {
            console.error('Error executing executeCallFunctionTests tests:', error);
          });
        break;
      default:
        break;
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
    if (testStep < testSteps.length) {
      performTestStep();
    } else {
      sendTestResults();
    }
  }, [testStep]);

  return (
    <View style={styles.container}>

      <View style={styles.testTopBar}>
        <View>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
        {testSteps[testStep] ?
          <Text style={styles.testsStage}>{testStep + 1} / {testSteps.length}</Text>
          :
          <Text style={styles.testsStage}>{testSteps.length} / {testSteps.length}</Text>
        }
        <Icon name={'close-circle-outline'} style={styles.closeIcon} onPress={() => navigation.navigate('HomeScreen')} />
      </View>

      <View style={styles.upperPart}>
        {testSteps[testStep] ?
          <>
            <Text style={styles.stepTitle}>
              Testing the device {testSteps[testStep].title}
            </Text>
          </>
          :
          <Text style={styles.stepTitle}>
            All tests were done
          </Text>
        }
        <Icon name={testSteps[testStep] ? testSteps[testStep].icon : 'done'} style={styles.testIcon} />
      </View>

      <View style={[styles.middlePart]}>
        {testSteps[testStep] ?
          <>
            <ScrollView style={[styles.middlePartTestsList]}>
              {testSteps[testStep].subset.map((subtopic, index) => (
                <View key={index} style={styles.testCard}>
                  <Text style={styles.testTitle}>{subtopic.title}:</Text>
                  {subtopic.value ?
                    <Text style={styles.testValue}>{subtopic.value}</Text>
                    :
                    <ActivityIndicator size={20} color="#4908b0" />
                  }
                </View>
              ))}
            </ScrollView>
          </>
          :
          <View style={[styles.middlePartTestsList]}>
            <Text>
              Share Report
            </Text>
          </View>
        }
        <View style={styles.buttonsSection}>
          {testSteps[testStep] ?
            <>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => console.log('Pressed')}>
                N/A
              </Button>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => console.log('Pressed')}>
                Skip
              </Button>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => setTestStep((prevStep) => prevStep - 1)}>
                Back
              </Button>
              <Button
                mode="outlined"
                style={styles.stepTestBtn}
                onPress={performTestStep}
                disabled={testStep === testSteps.length - 1}
              >
                {testStep === testSteps.length - 1 ? 'Finish' : 'Pass'}
              </Button>
            </>
            :
            <>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => console.log('Pressed')}>
                Send Data
              </Button>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => console.log('Pressed')}>
                Report
              </Button>
              <Button mode="outlined" style={styles.stepTestBtn} onPress={() => setTestStep((prevStep) => prevStep - 1)}>
                re-Test
              </Button>
            </>
          }
        </View>
      </View>
    </View>
  );
};

const executeCallFunctionTests = async () => {
  // Execute individual tests for Call Function step and return results
  return new Promise(resolve => {
    setTimeout(() => {
      // Resolve the Promise with the test results
      resolve({
        'Check Battery Health': 'Placeholder Value',
        'Check Network Connection': 'Placeholder Value',
        'Check Storage': 'Placeholder Value'
      });
    }, 5000);
  });
};

const executeCpuTests = async () => {
  // Execute individual tests for CPU step and return results
  return {
    'CPU Usage': 'Placeholder Value',
    'Temperature': 'Placeholder Value',
    'Performance': 'Placeholder Value'
  };
};

export default TestDeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4908b0'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  scannerBoxContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanScreenMessage: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  testTopBar: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    paddingHorizontal: 10,
    height: '6%',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff78'
  },

  timerText: {
    fontSize: 16,
    color: 'white'
  },
  testsStage: {
    fontSize: 17,
    color: 'white',
  },
  stepTitle: {
    width: '100%',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    textAlign: 'center'
  },
  upperPart: {
    flex: 3,
    // justifyContent: 'center',,
    top: '8%',
    alignItems: 'center',
    backgroundColor: '#4908b0'
  },
  middlePart: {
    display: 'flex',
    flex: 8,
    flexDirection: 'column',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    width: '100%',
    backgroundColor: '#ECF0F1',
  },

  deviceDetailsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
    color: 'white',
    textAlign: 'center'
  },
  detailsItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 7
  },
  detailsTextLabel: {
    flex: 1,
    fontWeight: '600',
    color: 'white',
    fontSize: 14
  },
  detailsTextValue: {
    flex: 2,
    fontSize: 13,
    textAlign: 'right',
    color: 'white'
  },
  preTestTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black',
    fontFamily: 'Quicksand-Regular',
  },
  preTestText: {
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 15,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#00000026',
    paddingBottom: 7
  },
  startButtonDiag: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    width: 200,
    height: 200,
    display: 'flex',
    borderWidth: 2,
    borderColor: '#40079a75',
    backgroundColor: 'white',
  },
  startButtonWipe: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    width: 200,
    height: 200,
    display: 'flex',
    borderWidth: 2,
    borderColor: '#cf433566',
    backgroundColor: 'white',
  },
  startIconDiag: {
    color: '#4908b0',
    fontSize: 120,
  },
  startIconWipe: {
    color: '#E74C3C',
    fontSize: 120,
  },
  startButtonTextWipe: {
    fontSize: 18,
    color: '#E74C3C',
    fontFamily: 'Quicksand-Bold',
  },
  startButtonTextDiag: {
    fontSize: 18,
    color: '#4908b0',
    fontFamily: 'Quicksand-Bold',
  },
  checklistItems: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
    marginVertical: 5

  },
  checkListScroll: {
    flex: 1,
    width: 300
  },
  scannerBox: {
    borderWidth: 6,
    borderColor: 'black',
    width: 350,
    aspectRatio: 1,
    backgroundColor: '#ffffff54',
    borderRadius: 50
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: 'white',
    flex: 1,
    height: 50,
    maxHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  scanText: {
    width: '100%',
    width: 250,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: 'black',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logo: {
    width: 240,
    resizeMode: 'stretch',
  },
  menuButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    left: 10
  },
  preTestButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 60,
    right: 10
  },
  preTestButton2: {
    marginLeft: 10,
    marginTop: 10,
  },
  wifiButton: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    right: 10,
  },
  connectWifi: {
    color: 'green'
  },
  disConnectWifi: {
    color: 'red'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBtnContainer: {
    padding: 50,
    backgroundColor: 'red'
  },
  middlePartBtns: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20,
  },
  middlePartBtnsCon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 20,
  },
  stepTestBtn: {
    borderColor: '#4908b0',
    color: '#4908b0',
    paddingHorizontal: 5
  },
  middlePartTestsList: {
    display: 'flex',
    padding: 5,
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
    height: '85%',
    flexDirection: 'column',
  },
  buttonsSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    width: '95%',
    height: '10%',
  },

  switchBtn: {
    transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }],
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 30,
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  switchText: {
    fontFamily: 'Quicksand-Bold',
    color: 'black',
    fontSize: 18
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,,
    backgroundColor: 'white'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 5,
    },
    shadowOpacity: 0.95,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonModalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    color: 'white',
    fontSize: 28,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalContent: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 15,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  customModalTitle: {
    width: 'auto',
    borderColor: '#0000002e',
    textAlign: 'center',
    paddingBottom: 5,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    marginBottom: 10
  },
  customModalRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },


  testCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#19191a24',
    // elevation: 2, // This adds shadow on Android
    shadowColor: '#000', // This adds shadow on iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 7
  },
  cardRight: {
    // marginLeft: 16,
    // backgroundColor: 'blue',    
  },
  testTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Quicksand-Bold',
    // backgroundColor: 'green'
  },
  testValue: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 4,
    // backgroundColor: 'red',
    flexGrow: 1
  },
  testIcon: {
    color: 'white',
    fontSize: 70,
    marginTop: 25
  }
});