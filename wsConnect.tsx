import React, { createContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const connectWebSocket = () => {
  const [websocketConnected, setWebsocketConnected] = React.useState(false);
  const [wss, setWss] = React.useState(null);

  const [wsUrl, setWsUrl] = useState(null);
  console.log('in connectWebSocket...')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('deviceparams');
        if (jsonValue !== null) {
          const data = JSON.parse(jsonValue);
          // setWsUrl(data);
        }
      } catch (error) {
        console.log('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  console.log('in ConnectWebSocket Function . URL: ');
  return;
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    setWebsocketConnected(true);
    console.log('WebSocket connected');
  };

  ws.onmessage = (data) => {
    // a message was received
    console.log('Server Response:', data);
  };

  ws.onerror = (error) => {
    setWebsocketConnected(false);
    console.log('WebSocket error:', error.message);
  };

  ws.onclose = () => {
    setWebsocketConnected(false);
    console.log('WebSocket closed');
  };

  setWss(ws);

};