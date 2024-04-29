import React, { createContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeviceInfoScreen({ navigation }) {
  const [deviceParams, setDeviceParams] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('deviceparams');
        if (jsonValue !== null) {
          const data = JSON.parse(jsonValue);
          setDeviceParams(data);
        }
      } catch (error) {
        console.log('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Device Parameters:</Text>
      {deviceParams && (
        <View>
          <Text>AuthToken: {deviceParams.serialNumber}</Text>
          <Text>SkipAuth: {deviceParams.wsIp}</Text>
        </View>
      )}
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}