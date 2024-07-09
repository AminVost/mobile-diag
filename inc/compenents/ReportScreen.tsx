import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Tooltip, Modal, Portal, ProgressBar, MD3Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { DataContext, TimerContext } from '../../App';
import { formatTimeHms } from '../utils/formatTimeHms';
import { appConfig } from '../../config';
import sendWsMessage from '../utils/wsSendMsg'

export default function ReportScreen({ navigation }) {
    const { testSteps, deviceDetails, isInternetConnected, isDiagStart, isSubmitResult, setIsSubmitResult, isFinishedTests, wsSocket, receivedUuid, tokenReceived } = useContext(DataContext);
    const { elapsedTimeRef } = useContext(TimerContext);
    const [storedDeviceParams, setStoredDeviceParams] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const [abortController, setAbortController] = useState(null);


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Tooltip title="Total Duration Time" enterTouchDelay={10} leaveTouchDelay={1000}>
                    <View style={styles.headerRightContainer}>
                        <Icon style={styles.timerIcon} name="timer-outline" size={18} color="black" />
                        <Text style={styles.headerRightText}>{formatTimeHms(elapsedTimeRef.current)}</Text>
                    </View>
                </Tooltip>
            ),
        });
        return () => {
            console.log('unmount report Screnn....')
            handleCloseModal();
        };
    }, [navigation, elapsedTimeRef.current]);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('deviceparams');
                if (jsonValue != null) {
                    setStoredDeviceParams(JSON.parse(jsonValue));
                }
            } catch (error) {
                console.log('Error reading data:', error);
            }
        };
        getData();
    }, [wsSocket]);

    // useEffect(() => {
    //     if (isStartDiag) {
    //         navigation.navigate('Home', {
    //             isStartDiag,
    //         });
    //     }
    // }, [isStartDiag]);

    useEffect(() => {
        if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
            wsSocket.onmessage = (event) => {
                console.log('Received message ReportScreen:', event.data);
                const message = JSON.parse(event.data);
                if (message.type === 'action' && message.action === 'submit') {
                    handleSendResult();
                } else if (message.type === 'action' && message.action === 'returnToHome') {
                    // setIsStartDiag(true);
                    navigation.navigate('Home');
                }
            };
        }
    }, [wsSocket]);

    const getResultColor = (result) => {
        switch (result) {
            case 'Pass':
                return styles.pass;
            case 'Fail':
                return styles.fail;
            case 'Skip':
                return styles.skip;
            default:
                return styles.notStarted;
        }
    };

    const navigateToTest = (testName) => {
        navigation.navigate(testName);
    };

    const handleSendResult = async () => {
        if (!isInternetConnected) {
            Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
            return;
        }
        if (!isDiagStart) {
            Alert.alert('No test has been done yet', 'Please complete the test steps first to send information.');
            return;
        }
        if (isSubmitResult) {
            Alert.alert('It is not possible to resend the test result', 'Please repeat the test steps to resend the test results.');
            return;
        }
        if (!isFinishedTests) {
            Alert.alert('Complete the test steps', 'Please complete the test steps to send the result.');
            return;
        }
        setLoading(true);
        setModalVisible(true);
        setProgress(0);
        const apiUrl = 'https://myrapidtrack.com/final_acc/_apps/diag_mobile/submitData';
        // const token = tokenReceived ? tokenReceived : '9259af73-c1da-4786-aa6b-c4a788525889';
        const token ='9259af74443-c1da-4786-aa6b-c4a788525889';
        const platform = 'linux';
        const appVersion = appConfig.version;
        const inventoryId = '202406162653';

        const payload = {
            token,
            platform,
            appVersion,
            inventoryId,
            fileData: {
                duration: elapsedTimeRef.current,
                system_info: {
                    brand: deviceDetails.brand,
                    deviceName: deviceDetails.deviceName,
                    hardWare: deviceDetails.hardWare,
                    imei: deviceDetails.imei,
                    manufacturer: deviceDetails.manufacturer,
                    meid: deviceDetails.meid,
                    model: deviceDetails.model,
                    os: deviceDetails.os,
                    osVersion: deviceDetails.osVersion,
                    serialNumber: deviceDetails.serialNumber,
                    storage_layouts: deviceDetails.storage_layouts,
                    memory_layouts: deviceDetails.memory_layouts,
                    cpu: deviceDetails.cpu
                },
                steps: testSteps.map(step => ({
                    duration: step.duration || null,
                    error: step.error || null,
                    ...(step.fileItem && { fileItem: step.fileItem }),
                    priority: step.priority,
                    result: step.result,
                    showInfoBar: step.showInfoBar,
                    showProgress: step.showProgress,
                    showStepTitle: step.showStepTitle,
                    showTimer: step.showTimer,
                    text: step.text,
                    title: step.title,
                    ...(step.multiCamResult && { multiCamResult: step.multiCamResult }),
                    ...(step.devicesInfo && { devicesInfo: step.devicesInfo })
                }))
            }
        };
        // const payloadString = JSON.stringify(payload);
        // console.log(`Payload size: ${payloadString.length} bytes`);

        const controller = new AbortController();
        setAbortController(controller);

        try {
            // console.log('try To send Result' , payload);
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });

            if (response.data.status === 'success') {
                console.log('success send Result= ', response.data.message)
                sendWsMessage(wsSocket, {
                    uuid: receivedUuid,
                    type: 'progress',
                    status: 'submitted'
                });
                setIsSubmitResult(true);
                setUploadMessage(response.data.message);
                setIsSuccess(true);
            } else {
                console.log('error else send Result= ', response.data.message)
                setUploadMessage(response.data.message);
                setIsSuccess(false);
                sendWsMessage(wsSocket, {
                    uuid: receivedUuid,
                    type: 'progress',
                    status: 'failedToSubmit',
                    error: response.data.message ? response.data.message : 'unKnown'
                });
            }
        } catch (error) {
            console.log('catch send Result= ', error.message)
            if (axios.isCancel(error)) {
                setUploadMessage('Upload canceled by user');
                sendWsMessage(wsSocket, {
                    uuid: receivedUuid,
                    type: 'progress',
                    status: 'canceleSubmit'
                });
            } else {
                setUploadMessage(error.message);
            }
            sendWsMessage(wsSocket, {
                uuid: receivedUuid,
                type: 'progress',
                status: 'failedToSubmit',
                error: error.message
            });
            setIsSuccess(false);
        } finally {
            setLoading(false);
            setModalVisible(true);
        }
    };

    const handleModalButtonPress = () => {
        if (isSuccess) {
            setModalVisible(false); // Close modal on success
        } else {
            handleSendResult(); // Retry on failure
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleCancelUpload = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {testSteps.map((step, index) => (
                    <View key={index} style={[styles.stepContainer, getResultColor(step.result)]} onPress={() => navigateToTest(step.screenName)}>
                        <Icon name={step.icon} size={30} style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{step.title}</Text>
                            <View style={styles.subTitle}>
                                <Text style={styles.stepInfo}>Priority: {step.priority}</Text>
                                {step.duration &&
                                    <Text style={styles.stepInfo}>Duration: {step.duration}s</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.resultContainer}>
                            {step.result === 'Pass' &&
                                <Icon name='check-circle' size={30} style={[styles.iconPass]} />
                            }
                            {step.result === 'Skip' &&
                                <Icon name='skip-next-circle' size={30} style={styles.iconSkip} />
                            }
                            {step.result === 'Fail' &&
                                <Icon name='close-circle' size={30} style={styles.iconFail} />
                            }
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.btnContainer}>
                <Button mode="contained" labelStyle={styles.btnLabel} icon={() => <Icon name="home-import-outline" size={20} color="white" />} onPress={() => navigation.goBack()} style={[styles.button, { backgroundColor: '#4908b0' }]}>
                    Go back home
                </Button>
                <Button
                    mode="contained"
                    labelStyle={styles.btnLabel}
                    icon={() => <Icon name="export-variant" size={20} color="white" />}
                    onPress={handleSendResult}
                    style={[styles.button, { backgroundColor: !isInternetConnected || !isDiagStart || isSubmitResult || !isFinishedTests ? '#d3d3d3' : '#2980b9' }]}
                >
                    Send Result
                </Button>
            </View>
            <Portal>
                <Modal visible={isModalVisible} contentContainerStyle={styles.modalContainer} dismissable={false}>
                    <Text style={styles.modalTitle}>{loading ? 'Uploading Results...' : 'Upload Status'}</Text>
                    {loading ? (
                        <>
                            <ActivityIndicator size="large" color="#4908b0" />
                            <Button mode="contained" onPress={handleCancelUpload} style={styles.modalButton}>
                                Cancel Upload
                            </Button>
                        </>
                    ) : (
                        <>
                            <Icon name={isSuccess ? 'check-circle' : 'alert-circle'} size={70} style={isSuccess ? styles.iconSuccess : styles.iconFail} />
                            <Text style={styles.uploadMessage}>{uploadMessage}</Text>
                            <View style={styles.modalButtonContainer}>
                                <Button mode="contained" onPress={handleModalButtonPress} icon={isSuccess ? null : 'refresh'} style={[styles.modalButton]}>
                                    {isSuccess ? 'OK' : 'Try Again'}
                                </Button>
                                {!isSuccess && (
                                    <Button mode="contained" onPress={handleCloseModal} style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}>
                                        Close
                                    </Button>
                                )}
                            </View>
                        </>
                    )}
                </Modal>
            </Portal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    scrollView: {
        flexGrow: 1,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        position: 'relative',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 10,
        columnGap: 15,
    },
    icon: {
        marginRight: 10,
        color: 'black',
    },
    iconPass: {
        marginRight: 10,
        color: '#27ae60',
    },
    iconSkip: {
        marginRight: 10,
        color: '#2c3e50',
    },
    iconFail: {
        marginRight: 10,
        color: '#c0392b',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
        color: 'black',
    },
    subTitle: {
        flexDirection: 'row',
        columnGap: 10,
    },
    stepInfo: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'Quicksand-Regular',
    },
    pass: {
        backgroundColor: '#d4edda',
        borderColor: '#0000004f',
    },
    fail: {
        backgroundColor: '#f8d7da',
        borderColor: '#0000004f',
    },
    skip: {
        backgroundColor: '#e2e3e5',
        borderColor: '#0000004f',
    },
    notStarted: {
        backgroundColor: 'white',
        borderColor: '#00000075',
    },
    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: 5,
    },
    btnLabel: {
        fontSize: 15,
    },
    headerRightContainer: {
        marginRight: 10,
        flexDirection: 'row',
        columnGap: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Quicksand-SemiBold',
    },
    timerIcon: {
        alignSelf: 'center',
        alignContent: 'center',
    },
    resultContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        alignItems: 'center',
    },
    responseContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 10,
    },
    responseText: {
        fontSize: 16,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'Quicksand-Bold',
        color: 'black'
    },
    progressBar: {
        width: '100%',
        height: 40,
        borderRadius: 5,
    },
    progressText: {
        marginTop: 10,
        fontSize: 16,
    },
    uploadMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Quicksand-SemiBold',
        lineHeight: 30
    },
    iconSuccess: {
        color: '#27ae60',
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 20,
        // width: '100%'
        flexGrow: 1
    },
    modalButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 7
    }
});

