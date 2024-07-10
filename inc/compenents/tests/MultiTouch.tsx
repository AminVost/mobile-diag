import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions, BackHandler, StatusBar } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { Button } from 'react-native-paper';
import { DataContext } from '../../../App';
import Timer from '../Timer';
import useStepTimer from '../useStepTimer';
import sendWsMessage from '../../utils/wsSendMsg'
import AnimatedIcon from '../../utils/AnimatedIcon'



const MultiTouchTest = ({ navigation }) => {
    const [isTimerVisible, setIsTimerVisible] = useState(true);
    const { testStep, setTestStep, testSteps, setTestsSteps, wsSocket, receivedUuid } = useContext(DataContext);
    const [touches, setTouches] = useState([]);
    const [maxTouches, setMaxTouches] = useState(0);
    const getDuration = useStepTimer();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    useEffect(() => {
        sendWsMessage(wsSocket, {
            uuid: receivedUuid,
            type: 'progress',
            status: 'step',
            status: 'step',
            step: testStep + '/' + testSteps.length,
            currentStep: testSteps[testStep - 1].title
        });
        hideNavigationBar();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            backHandler.remove();
            showNavigationBar();
            setIsTimerVisible(false);
        };
    }, []);

    const handleBackButtonPress = () => {
        return true;
    };

    const handleResult = useCallback((result) => {
        const updatedTestSteps = [...testSteps];
        updatedTestSteps[testStep - 1].result = result;
        updatedTestSteps[testStep - 1].duration = getDuration();
        setTestsSteps(updatedTestSteps);
        setTestStep((prevStep) => prevStep + 1);
    }, [testStep, testSteps, setTestStep, setTestsSteps]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            updateTouches(evt.nativeEvent.touches);
        },
        onPanResponderMove: (evt, gestureState) => {
            updateTouches(evt.nativeEvent.touches);
        },
        onPanResponderRelease: (evt, gestureState) => {
            setTouches([]);
        },
    });

    const updateTouches = (touchList) => {
        const touchPoints = Array.from(touchList).map((touch) => ({
            x: touch.pageX,
            y: touch.pageY,
            id: touch.identifier,
        }));
        setTouches(touchPoints);
        setMaxTouches((prevMax) => Math.max(prevMax, touchPoints.length));
    };

    useEffect(() => {
        if (maxTouches > 2) {
            handleResult('Pass');
        }
    }, [maxTouches]);

    return (
        <>
            <StatusBar hidden={false} translucent={false} backgroundColor="transparent" barStyle="default" />
            {isTimerVisible && <Timer />}
            <View style={styles.container}>
                <AnimatedIcon />
                <View
                    style={[styles.touchArea, { width: screenWidth, height: screenHeight }]}
                    {...panResponder.panHandlers}
                >
                    {touches.map((touch) => (
                        <View
                            key={touch.id}
                            style={[styles.touchCircle, { left: touch.x - 25, top: touch.y - 25 }]} />
                    ))}
                    <Text style={styles.touchCount}>Touch Points: {touches.length}</Text>
                    <Text style={styles.maxTouchCount}>Max Touch Points: {maxTouches}</Text>
                </View>
                <View style={[styles.btnContainer]}>
                    <Button
                        mode="elevated"
                        buttonColor="#e84118"
                        textColor="white"
                        style={styles.btns}
                        labelStyle={styles.btnLabel}
                        onPress={() => handleResult('Fail')}
                    >
                        fail
                    </Button>
                    <Button
                        mode="elevated"
                        buttonColor="#7f8fa6"
                        textColor="white"
                        style={styles.btns}
                        labelStyle={styles.btnLabel}
                        onPress={() => handleResult('Skip')}
                    >
                        Skip
                    </Button>
                    <Button
                        mode="elevated"
                        buttonColor="#44bd32"
                        textColor="white"
                        style={styles.btns}
                        labelStyle={styles.btnLabel}
                        onPress={() => handleResult('Pass')}
                    >
                        Pass
                    </Button>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    touchArea: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    touchCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'rgba(0, 150, 136, 0.7)',
        borderWidth: 1,
        position: 'absolute',
    },
    touchCount: {
        fontSize: 20,
        margin: 20,
        fontFamily: 'Quicksand-Regular',
        color: '#353b4861'
    },
    maxTouchCount: {
        fontSize: 18,
        color: '#353b4870',
        fontFamily: 'Quicksand-SemiBold'
    },
    skipButton: {
        marginTop: 20,
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 25
    },
    btns: {
        padding: 8,
        borderRadius: 8
    },
    btnLabel: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 17
    },
});

export default MultiTouchTest;
