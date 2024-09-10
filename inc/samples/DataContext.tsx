// DataContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { LaunchArguments } from "react-native-launch-arguments";
import { storeData } from './inc/utils/storageUtils';

interface DataContextType {
  isInternetConnected: boolean;
  setIsNetConnected: React.Dispatch<React.SetStateAction<boolean>>;
  websocketConnected: boolean;
  setWebsocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
  receivedSerialNumber: string | null;
  testStep: number;
  setTestStep: React.Dispatch<React.SetStateAction<number>>;
  testSteps: TestStep[];
  setTestsSteps: React.Dispatch<React.SetStateAction<TestStep[]>>;
  elapsedTime: number;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
}

interface TestStep {
  title: string;
  text: string;
  result: any;
  error: any;
  duration: any;
  priority: number;
  filePath?: string;
  multiCamResult?: any[];
  devicesInfo?: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isInternetConnected, setIsNetConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [receivedSerialNumber, setReceivedSerialNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [testStep, setTestStep] = useState(1);
  const [testSteps, setTestsSteps] = useState<TestStep[]>([
    {
      title: 'TouchScreen',
      text: '',
      result: null,
      error: null,
      duration: null,
      priority: 9,
    },
    {
      title: 'Multitouch',
      text: '',
      result: null,
      error: null,
      duration: null,
      priority: 3,
    },
    {
      title: 'Display',
      text: '',
      result: null,
      error: null,
      duration: null,
      priority: 6,
    },
    {
      title: 'Brightness',
      text: '',
      result: null,
      error: null,
      duration: null,
      priority: 5,
    },
    {
      title: 'Rotation',
      text: '',
      result: null,
      error: null,
      duration: null,
      priority: 7,
    },
    {
      title: 'BackCamera',
      text: '',
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 8,
    },
    {
      title: 'FrontCamera',
      text: '',
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 4,
    },
    {
      title: 'MultiCamera',
      text: '',
      result: null,
      multiCamResult: [],
      devicesInfo: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 1,
    },
    {
      title: 'BackCameraVideo',
      text: '',
      result: null,
      filePath: null,
      error: null,
      duration: null,
      priority: 2,
    },
  ]);

  const paramsTest = { "wsIp": "192.168.1.22", "serialNumber": "R58M42HXCZW" };

  useEffect(() => {
    if (paramsTest) {
      storeData(paramsTest);
      if (paramsTest.serialNumber) {
        setReceivedSerialNumber(paramsTest.serialNumber);
      } else {
        console.log('Serial number is Undefined');
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.loaderLogo}
        />
        <ActivityIndicator size="large" color="#4908b0" />
      </View>
    );
  }

  return (
    <DataContext.Provider value={{
      isInternetConnected, setIsNetConnected, websocketConnected, setWebsocketConnected, receivedSerialNumber, testStep, setTestStep, testSteps, setTestsSteps, elapsedTime, setElapsedTime
    }}>
      {children}
    </DataContext.Provider>
  );
};

const styles = StyleSheet.create({
    drawerHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
    },
    logo: {
      width: 200,
      height: 70,
      resizeMode: 'contain',
    },
    loaderLogo: {
      width: 300,
      height: 70,
      resizeMode: 'contain',
      marginBottom: 5
    },
    loadingContainer: {
      backgroundColor: 'white',
      flex: 1,
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
  })

export { DataProvider, DataContext };
