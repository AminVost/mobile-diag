import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions, BackHandler, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { DataContext, TimerContext } from '../../../App';
import { formatTime } from '../../utils/formatTime';
import CustomAlert from './CustomAlertDisplay';

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
    const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
    const { elapsedTimeRef } = useContext(TimerContext);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [testComplete, setTestComplete] = useState(false);
    const [showText, setShowText] = useState(true);
    const opacity = useSharedValue(1);

    useEffect(() => {
        console.log('testSteps[testStep]', testSteps[testStep - 1]);
        hideNavigationBar();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

        return () => {
            console.log('returnnnnn.... testSteps : ' , testSteps);
            backHandler.remove();
            showNavigationBar();
        };
    }, []);

    useEffect(() => {
        const timerText = setTimeout(() => {
            setShowText(false);
        }, 1000);
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

    // const CustomAlert = useCallback(() => {
    //     console.log('ddddd')
    //     return (
    //         <Modal
    //             visible={isAlertVisible}
    //             transparent={true}
    //             animationType="slide"
    //             hardwareAccelerated={true}
    //             onRequestClose={toggleAlert}
    //         >
    //             <View style={styles.modalBackground}>
    //                 <View style={styles.customModalContent}>
    //                     <Text style={styles.customModalTitle}>Please select the Display test result</Text>
    //                     {/* <Text style={styles.customModalTitle}>{`Elapsed Time: ${formatTime(elapsedTimeRef.current)}`}</Text> */}
                        
    //                     <View style={styles.customModalRow}>
    //                         <Icon name="circle-opacity" size={100} color="#4908b0" />
    //                     </View>
    //                     <View style={styles.customModalBtns}>
    //                         <Button mode="elevated" buttonColor="#e84118" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Fail')}>
    //                             Fail
    //                         </Button>
    //                         <Button mode="elevated" buttonColor="#7f8fa6" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Skip')}>
    //                             Skip
    //                         </Button>
    //                         <Button mode="elevated" buttonColor="#44bd32" textColor="white" style={styles.btns} labelStyle={styles.btnLabel} onPress={() => handleResult('Pass')}>
    //                             Pass
    //                         </Button>
    //                     </View>
    //                 </View>
    //             </View>
    //         </Modal>
    //     );
    // }, [isAlertVisible, handleResult, toggleAlert,elapsedTimeRef.current]);

    const handleNextTest = useCallback(() => {
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
    }, [currentTestIndex]);

    const restartTest = () => {
        setCurrentTestIndex(0);
        setTestComplete(false);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withSpring(opacity.value),
        };
    });

    const renderPattern = useCallback(() => {
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
    }, [currentTestIndex , setCurrentTestIndex]);

    const renderCompletionPage = () => {
        return (
            <View style={styles.completionContainer}>
                <Text style={styles.completionText}>The display test is complete.</Text>
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
            {/* <CustomAlert /> */}
            <CustomAlert isAlertVisible={isAlertVisible} handleResult={handleResult} toggleAlert={toggleAlert} />
            {testComplete ? (
                renderCompletionPage()
            ) : (
                <>
                    <Text style={styles.timerText}>{`Elapsed Time: ${formatTime(elapsedTimeRef.current)}`}</Text>
                    <TouchableOpacity style={styles.container} onPress={handleNextTest}>
                        {renderPattern()}
                        {showText && (
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Tap to change pattern ({currentTestIndex + 1}/{testPatterns.length})</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </>
    );
};

export default Display;

const styles = StyleSheet.create({
    timerText: { fontSize: 20, fontWeight: 'bold' },
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


