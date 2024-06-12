import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions, BackHandler, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { DataContext } from '../../../App';

const { width, height } = Dimensions.get('screen');

const testPatterns = [
    { type: 'color', value: 'red' },
    { type: 'color', value: 'green' },
    { type: 'color', value: 'blue' },
    { type: 'color', value: 'white' },
    { type: 'color', value: 'black' },
    { type: 'grid', value: 'black' },
    { type: 'gradient', value: 'black' },
];

const Display = () => {
    const { testStep, setTestStep, testSteps, setTestsSteps, elapsedTime, setElapsedTime } = useContext(DataContext);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [testComplete, setTestComplete] = useState(false);
    const [showText, setShowText] = useState(true);
    const localElapsedTimeRef = useRef(elapsedTime);
    const [displayElapsedTime, setDisplayElapsedTime] = useState(elapsedTime);
    const opacity = useSharedValue(1);

    useEffect(() => {
        console.log('testSteps[testStep]', testSteps[testStep - 1]);
        hideNavigationBar();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        const timer = setInterval(() => {
            localElapsedTimeRef.current += 1;
            // setDisplayElapsedTime(localElapsedTimeRef.current); // Update state to trigger re-render for the timer display
        }, 1000);

        return () => {
            console.log('unmounting Display...');
            backHandler.remove();
            showNavigationBar();
            clearInterval(timer);
            setElapsedTime(prevElapsedTime => prevElapsedTime + localElapsedTimeRef.current);
        };
    }, [elapsedTime, setElapsedTime]);

    useEffect(() => {
        const timerText = setTimeout(() => {
            setShowText(false);
        }, 1000);
        console.log('timer...');
        return () => clearTimeout(timerText);
    }, [currentTestIndex]);

    const handleBackButtonPress = useCallback(() => {
        setAlertVisible(true);
        return true; // Returning true prevents default back button behavior
    }, []);

    const handleResult = useCallback((result) => {
        const updatedTestSteps = [...testSteps];
        updatedTestSteps[testStep - 1].result = result;
        setTestsSteps(updatedTestSteps);
        setTestStep((prevStep) => prevStep + 1);
        setAlertVisible(false);
    }, [testStep, testSteps, setTestStep, setTestsSteps]);

    const toggleAlert = useCallback(() => {
        setAlertVisible(!isAlertVisible);
    }, [isAlertVisible]);

    const CustomAlert = useCallback(() => {
        return (
            <Modal
                visible={isAlertVisible}
                transparent={true}
                animationType="slide"
                hardwareAccelerated={true}
                onRequestClose={toggleAlert}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.customModalContent}>
                        <Text style={styles.customModalTitle}>Please select the Display test result {formatTime(localElapsedTimeRef.current)}</Text>
                        <View style={styles.customModalRow}>
                            <Icon name="circle-opacity" size={100} color="#4908b0" />
                        </View>
                        <View style={styles.customModalBtns}>
                            <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
                                Fail
                            </Button>
                            <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
                                Skip
                            </Button>
                            <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
                                Pass
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }, [isAlertVisible, handleResult, toggleAlert]);

    const handleNextTest = () => {
        if (currentTestIndex === testPatterns.length - 1) {
            setTestComplete(true);
        } else {
            opacity.value = 0;
            setTimeout(() => {
                setShowText(true);
                setCurrentTestIndex((prevIndex) => (prevIndex + 1) % testPatterns.length);
                opacity.value = 1;
            }, 300);
        }
    };

    const restartTest = () => {
        setCurrentTestIndex(0);
        setTestComplete(false);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withSpring(opacity.value),
        };
    });

    const renderPattern = () => {
        const currentTest = testPatterns[currentTestIndex];
        switch (currentTest.type) {
            case 'color':
                return <Animated.View style={[styles.pattern, { backgroundColor: currentTest.value }, animatedStyle]} />;
            case 'grid':
                return (
                    <Animated.View style={[styles.pattern, styles.gridPattern, animatedStyle]}>
                        {Array.from({ length: 20 }).map((_, row) => (
                            <View key={row} style={styles.gridRow}>
                                {Array.from({ length: 10 }).map((_, col) => (
                                    <View key={col} style={[styles.gridCell, { backgroundColor: (row + col) % 2 === 0 ? 'black' : 'white' }]} />
                                ))}
                            </View>
                        ))}
                    </Animated.View>
                );
            case 'gradient':
                return (
                    <Animated.View style={[styles.pattern, styles.gradientPattern, animatedStyle]}>
                        {Array.from({ length: height }).map((_, i) => (
                            <View key={i} style={{ width, height: 1, backgroundColor: `rgb(${i % 256}, ${i % 256}, ${i % 256})` }} />
                        ))}
                    </Animated.View>
                );
            default:
                return null;
        }
    };

    const renderCompletionPage = () => {
        return (
            <View style={styles.completionContainer}>
                <Text style={styles.completionText}>The display test is complete.</Text>
                <Text style={styles.completionText}>{formatTime(localElapsedTimeRef.current)}</Text>
                <Text style={styles.completionText}>Please select an option below to proceed.</Text>
                <Button mode="elevated"
                    buttonColor="#3498db"
                    labelStyle={[styles.reTestBtn]}
                    icon={() => (
                        <Icon
                            name="refresh"
                            size={30}
                            color="white"
                        />
                    )}
                    textColor="white"
                    style={[styles.stepTestBtn, { marginBottom: 30 }]}
                    onPress={restartTest}
                >
                    Display Test Again
                </Button>
                <View style={styles.buttonContainer}>
                    <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
                        Fail
                    </Button>
                    <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
                        Skip
                    </Button>
                    <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
                        Pass
                    </Button>
                </View>
            </View>
        );
    };

    return (
        <>
            <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <CustomAlert />
            {testComplete ? (
                renderCompletionPage()
            ) : (
                <TouchableOpacity style={styles.container} onPress={handleNextTest}>
                    {renderPattern()}
                    {showText && (
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Tap to change pattern ({currentTestIndex + 1}/{testPatterns.length})</Text>
                        </View>
                    )}
                </TouchableOpacity>
            )}
        </>
    );
};

export default Display;

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
    },
    gridPattern: {
        flexDirection: 'column',
    },
    gridRow: {
        flexDirection: 'row',
        flex: 1,
    },
    gridCell: {
        flex: 1,
    },
    gradientPattern: {
        flexDirection: 'column',
    },
    textContainer: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
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
        textAlign: 'center',
        paddingBottom: 5,
        color: 'black',
        fontWeight: '600',
        fontFamily: 'Quicksand-Bold',
        fontSize: 16,
        marginBottom: 10,
    },
    customModalRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    customModalBtns: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    stepTestBtn: {
        padding: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        paddingHorizontal: 10,
        marginBottom: 20,
        bottom: 0,
    },
    btns: {
        padding: 8,
    },
    btnLabel: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 17
    },
    reTestBtn: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 17
    },
    completionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completionText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Quicksand-semiBold'
    },
});