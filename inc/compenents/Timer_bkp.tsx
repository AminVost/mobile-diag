import React, { useContext, useState, memo, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { TimerContext, DataContext } from '../../App';
import { formatTime } from '../utils/formatTime';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';


const Timer = memo(({ }) => {
    const { elapsedTimeRef, startTime } = useContext(TimerContext);
    const { testStep, testSteps } = useContext(DataContext);
    const currentStep = testSteps[testStep - 1];
    const insets = useSafeAreaInsets();

    // console.log('testStep', currentStep);

    const [gozar, setGozar] = useState(null);

    // elapsedTimeRef.current = gozar ? gozar : elapsedTimeRef.current;

    useEffect(() => {
        if (!currentStep) return;

        const interval = setInterval(() => {
            elapsedTimeRef.current = Math.floor((Date.now() - startTime) / 1000);
            setGozar(elapsedTimeRef.current); // causing the component to render
        }, 1000);

        return () => {
            console.log('unmount Timer')
            clearInterval(interval);
            console.log(elapsedTimeRef.current)
        };
    }, [currentStep]);

    if (!currentStep || !currentStep.showInfoBar) {
        return null;
    }

    return (
        currentStep.showInfoBar &&
        <View style={[styles.barContainer, { top: insets.top }]}>
            {
                currentStep.showTimer &&
                <View style={styles.timerContainer}>
                    <Icon style={styles.timerIcon} name="timer-outline" size={16} color="black" />
                    <Text style={styles.timerText}>
                        {formatTime(elapsedTimeRef.current)}
                    </Text>
                </View>
            }
            {
                currentStep.showStepTitle &&
                <View style={styles.stepContainer}>
                    <Text style={styles.currentText}>
                        {currentStep.title}
                    </Text>
                </View>
            }
            {
                currentStep.showProgress &&
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {testStep}/{testSteps.length}
                    </Text>
                </View>
            }
        </View>
    );
});

export default Timer;

const styles = StyleSheet.create({
    barContainer: {
        position: 'absolute',
        // top: insets.top,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
        // backgroundColor: '#ffffff21',
        backgroundColor: 'white',
        padding: 5
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 5
    },
    timerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 5
    },
    stepContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerIcon: {
        alignSelf: 'center',
        alignContent: 'center'
    },
    timerText: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Quicksand-SemiBold',
        marginLeft: 5,
        width: 'auto'
    },
    currentText: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Quicksand-SemiBold',
        marginLeft: 5
    },
    progressText: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Quicksand-SemiBold',
        marginLeft: 5
    }
});


