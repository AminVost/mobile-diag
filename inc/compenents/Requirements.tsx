import React, { createContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import { Button, PaperProvider, Switch, Tooltip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Requirements({ navigation }) {


  const checklistItems = [
    "Any Bluetooth Device",
    "Headset",
    "NFC Tag",
    "SIM Card",
    "Camera",
    "Another Camera Device",
    "Magnet",
    "SD Card",
    "OTG Connector",
    "Any Bluetooth Device",
    "Headset",
    "NFC Tag",
    "SIM Card",
    "Camera",
    "Another Camera Device",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "Magnet",
    "SD Card",
    "OTG Connector",
  ];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.preTestTitle}>Pre-Test Requirements</Text>
        <Text style={styles.preTestText}>Please prepare the following tools before testing the mobile device.</Text>
        <ScrollView style={styles.checkListScroll} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
          {checklistItems.map((item, index) => (
            <Text key={index} style={styles.checklistItems}>{index + 1}. {item}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
  checkListScroll: {
    flex: 1,
    width: 300
  },
  buttonModalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checklistItems: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
    marginVertical: 5

  },

});