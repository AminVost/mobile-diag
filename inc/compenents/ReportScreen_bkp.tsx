import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Button, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { DataContext, TimerContext } from '../../App';
import { formatTimeHms } from '../utils/formatTimeHms';

export default function ReportScreen({ navigation }) {
    const { testSteps, deviceDetails } = useContext(DataContext);
    const { elapsedTimeRef } = useContext(TimerContext);

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

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
    }, [navigation, elapsedTimeRef.current]);

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
        setLoading(true);
        const inventoryId = 123; // Replace with the actual inventory_id
        try {
            const formData = new FormData();
            formData.append('duration', JSON.stringify(elapsedTimeRef.current));
            formData.append('testSteps', JSON.stringify(testSteps));
            formData.append('deviceDetails', JSON.stringify(deviceDetails));
    
            const response = await axios.post(`https://source-code.ir/testapi/api.php?inventory_id=${inventoryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progress) => { 
                    console.log('progress', (progress.loaded / progress.total) * 100); 
                },
            });
    
            // Check if the response status is success
            if (response.data.status === 'success') {
                console.log('Data saved successfully:', response.data);
                setResponse('Data saved successfully.');
            } else {
                console.error('Error response from server:', response.data);
                setResponse(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error sending result:', error);
            setResponse('Error sending result. Please try again.');
        } finally {
            setLoading(false);
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
                                    <Text style={styles.stepInfo}>Duration: {step.duration}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.resultContainer}>
                            {step.result === 'Pass' &&
                                <Icon name='check-circle' size={30} style={[styles.iconPass]} />
                            }
                            {step.result === 'Skip' &&
                                <Icon name='reload' size={30} style={styles.iconSkip} />
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
                <Button mode="contained" labelStyle={styles.btnLabel} icon={() => <Icon name="export-variant" size={20} color="white" />} onPress={handleSendResult} style={[styles.button, { backgroundColor: '#2980b9' }]}>
                    Send Result
                </Button>
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Sending results...</Text>
                </View>
            )}
            {response && (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>{response}</Text>
                </View>
            )}
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
        columnGap: 15
    },
    icon: {
        marginRight: 10,
        color: 'black'
    },
    iconPass: {
        marginRight: 10,
        color: '#27ae60'
    },
    iconSkip: {
        marginRight: 10,
        color: '#2c3e50'
    },
    iconFail: {
        marginRight: 10,
        color: '#c0392b'
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
        color: 'black'
    },
    subTitle: {
        flexDirection: 'row',
        columnGap: 10,
    },
    stepInfo: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'Quicksand-Regular'
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
        // marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: 5
    },
    btnLabel: {
        fontSize: 15
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
        fontFamily: 'Quicksand-SemiBold'
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
        alignItems: 'center'
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
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
});