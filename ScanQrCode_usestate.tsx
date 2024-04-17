import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable } from 'react-native';
import { RNCamera } from 'react-native-camera';
import logoImage from './assets/images/logo.png';
import { useWebSocket } from './WebSocketContext'; // Import useWebSocket hook


export default function ScanQrCode({ route, navigation }) {
    const { setConnected } = useWebSocket()
    const [cameraType, setCameraType] = React.useState(RNCamera.Constants.Type.back);
    const [flashMode, setFlashMode] = React.useState(RNCamera.Constants.FlashMode.auto);
    const cameraRef = React.useRef(null);
    const barcodeCodes: any[] = [];

    const [websocketConnected, setWebsocketConnected] = React.useState(false);


    const [serverResponse, setServerResponse] = React.useState(null);
    const [wss, setWss] = React.useState(null);


    const onBarCodeRead = async (scanResult: { type: any; data: null; }) => {

        if (scanResult.data != null && !websocketConnected) { // Check if websocket is not already connected

            barcodeCodes.push(scanResult.data);
            await connectWebSocket(scanResult.data);
        } else {

            if (scanResult.data == null) {
                console.log('Error=> Qrcode Url Is Null');
            } else {
                console.log('Error=> websocket already connected');
            }

        }
        return;
    };

    const connectWebSocket = async (url) => {
        const wsUrl = url;

        // const wsUrl = 'http://192.168.1.24:2552';
        console.log('in ConnectWebSocket Function . URL: ', url);

        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
            setWebsocketConnected(true);
            setConnected(true);
            console.log('WebSocket connected');
        };

        ws.onmessage = (data) => {
            // a message was received
            setServerResponse(data);
            console.log('Server Response:', data);
        };

        ws.onerror = (error) => {
            // setWebsocketConnected(false);
            console.log('WebSocket error:', error.message);
        };

        ws.onclose = () => {
            setWebsocketConnected(false);
            navigation.navigate('StartApp', { websocketConnected });
            console.log('WebSocket closed');
        };

        setWss(ws);

    };
    React.useEffect(() => {
        if (websocketConnected) {
            navigation.navigate('StartApp', { websocketConnected });
        }
        console.log('QR websocketConnected: ', websocketConnected);
    }, [websocketConnected, navigation]);

    return (
        <View style={styles.container}>
            <RNCamera
                ref={cameraRef}
                defaultTouchToFocus
                flashMode={flashMode}
                mirrorImage={false}
                onBarCodeRead={onBarCodeRead}
                onFocusChanged={() => { console.log('focused') }}
                onZoomChanged={() => { }}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera phone',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                }}
                style={styles.preview}
                type={cameraType}
            />
            <View style={[styles.overlay]}>
                <Image source={logoImage} style={styles.logo} resizeMode='contain' />
            </View>
            <View style={[styles.scannerBoxContainer]}>
                <Text style={[styles.scanText]}>Please scan the QRCode</Text>
                <View style={[styles.scannerBox]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECF0F1'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
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
    logo: {
        width: 240,
        resizeMode: 'stretch',
    },
});