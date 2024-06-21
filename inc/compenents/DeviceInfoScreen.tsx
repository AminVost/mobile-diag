import React, { createContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeviceInfoScreen({ navigation }) {
  const [deviceParams, setDeviceParams] = useState(null);
  const [storageData, setStorageData] = useState([]);

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

  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);

        const formattedData = result.map(([key, value]) => ({ key, value }));
        setStorageData(formattedData);
      } catch (error) {
        console.error('Error fetching AsyncStorage data:', error);
      }
    };

    fetchStorageData();
  }, []);

  return (
    <>
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
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>AsyncStorage Data:</Text>
          {storageData.map(({ key, value }) => (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Key: {key}</Text>
              <Text>Value: {value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}