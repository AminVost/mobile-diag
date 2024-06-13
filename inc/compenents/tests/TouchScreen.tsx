import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, Dimensions, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, BackHandler, Platform, Image, PanResponder, Modal, Pressable, Linking, PermissionsAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../App';
import CustomAlert from './CustomAlert';
import Timer from '../Timer';


const TouchScreenTest = ({ navigation, route }) => {
    const { testStep, setTestStep, testSteps, setTestsSteps } = useContext(DataContext);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const heightBar = StatusBar.currentHeight;
    const [squares, setSquares] = useState([]);
    const [completed, setCompleted] = useState(false);
    const screenWidth = Dimensions.get('screen').width;
    const screenHeight = Dimensions.get('screen').height;

    const numCols = 5;
    const numRows = 10;

    // Calculate square size based on both screen width and height
    const squareWidth = screenWidth / numCols;
    const squareHeight = screenHeight / numRows;

    useEffect(() => {
        hideNavigationBar();
        generateSquares();
        setStartTime(Date.now());
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            backHandler.remove();
            showNavigationBar();
            console.log('unmount..... touchScreen' , testSteps[testStep - 1])
        };
    }, []);

    const handleBackButtonPress = useCallback(() => {
        setAlertVisible(!isAlertVisible);
        return true; // Returning true prevents default back button behavior
    },[isAlertVisible]);

    const handleResult = useCallback((result) => {
        setEndTime(Date.now());
        // Calculate elapsedTimeStep when endTime updates
        // Using setTimeout to ensure endTime has updated value
        setTimeout(() => {
            const elapsedTimeStep = Math.floor((endTime - startTime) / 1000);
            console.log('result ', result);
            const updatedTestSteps = [...testSteps];
            updatedTestSteps[testStep - 1].result = result;
            updatedTestSteps[testStep - 1].duration = elapsedTimeStep;
            setTestsSteps(updatedTestSteps);
            console.log('hereeeeeeeeeeeeeeeee',testSteps[testStep - 1])
        }, 0);

        setTestStep((prevStep) => prevStep + 1);
        setAlertVisible(false);
    }, [endTime, startTime, testStep, testSteps, setTestsSteps]);

    const toggleAlert = useCallback(() => {
        // setAlertVisible(!isAlertVisible);
        setAlertVisible(prev => !prev);
    }, []);

    useEffect(() => {
        if (completed) {
            // Update the result for the current test step
            const updatedTestSteps = [...testSteps];
            updatedTestSteps[testStep].result = 'pass'; // or whatever your result is
            setTestsSteps(updatedTestSteps);
            setTestStep((prevStep) => prevStep + 1);
        }
    }, [completed]);

    const generateSquares = () => {
        const newSquares = [];

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                newSquares.push({ id: `${i}-${j}`, x: j * squareWidth, y: i * squareHeight });
            }
        }

        setSquares(newSquares);
    };

    const handleSquareDrag = (squareId) => {
        const updatedSquares = squares.filter(square => square.id !== squareId);
        setSquares(updatedSquares);
        if (updatedSquares.length === 0) {
            setCompleted(true);
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            const touchX = gestureState.moveX;
            const touchY = gestureState.moveY;

            squares.forEach(square => {
                if (
                    touchX >= square.x &&
                    touchX <= square.x + squareWidth &&
                    touchY >= square.y &&
                    touchY <= square.y + squareHeight
                ) {
                    handleSquareDrag(square.id);
                }
            });
        },
    });

    return (
        <>
            <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="default" />
            <Timer />
            <CustomAlert isAlertVisible={isAlertVisible} handleResult={handleResult} toggleAlert={toggleAlert} currentTestStep={testSteps[testStep - 1]} />
            <View
                style={styles.container}
                {...panResponder.panHandlers}
            >
                {squares.map(square => (
                    <View
                        key={square.id}
                        style={[styles.square, { width: squareWidth, height: squareHeight, left: square.x, top: square.y }]}
                    >
                    </View>
                ))}
                {/* {
                    completed &&
                    <>
                        <Icon name="check-circle" size={150} color="#27ae60" />
                        <Text style={styles.completionText}>
                            Touch screen test successful!
                        </Text>
                    </>
                } */}
            </View>
        </>
    );
};
export default TouchScreenTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f6fa'
    },
    square: {
        position: 'absolute',
        backgroundColor: '#273c75',
        borderWidth: 1,
        borderColor: '#ffffff3d',
    },
    completionText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: '#27ae60',
    },
    modalBackground: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customModalContent: {
        backgroundColor: 'white',
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    customModalTitle: {
        width: 'auto',
        borderColor: '#0000002e',
        textAlign: 'center',
        paddingBottom: 5,
        color: 'black',
        fontWeight: '600',
        fontFamily: 'Quicksand-Bold',
        fontSize: 16,
        marginBottom: 10
    },
    customModalRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20
    },
    customModalText: {
        fontSize: 13,
    },
    closeButtonCon: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        color: 'blue',
        marginTop: 20,
        fontSize: 16,
    },
    customModalBtns: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10
    },
    btns: {
        padding: 8,
    },
    btnLabel: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 17
    },
});

