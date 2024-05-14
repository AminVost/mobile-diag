import React, { createContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} textColor='black' mode="outlined" >
        Go To Home
      </Button>
    </View>
  );
}