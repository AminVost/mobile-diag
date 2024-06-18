import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext, TimerContext } from '../../App';
import { formatTime } from '../utils/formatTime';
import { ColorProperties } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function ReportScreen({ navigation }) {
    const { testSteps } = useContext(DataContext);
    const { elapsedTimeRef, startTime } = useContext(TimerContext);
    console.log(elapsedTimeRef.current);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Tooltip title="Total Duration Time" enterTouchDelay={10} leaveTouchDelay={1000}>
                    <View style={styles.headerRightContainer}>
                        <Icon style={styles.timerIcon} name="timer-outline" size={18} color="black" />
                        <Text style={styles.headerRightText}>{formatTime(elapsedTimeRef.current)}</Text>
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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {testSteps.map((step, index) => (
                    <View key={index} style={[styles.stepContainer, getResultColor(step.result)]}>
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
                            {/* <Text style={styles.resultText}>{step.result}</Text> */}
                            {step.result == 'Pass' &&
                                <Icon name='check-circle' size={30} style={[styles.iconPass]} />
                            }
                            {step.result == 'Skip' &&
                                <Icon name='skip-next-circle' size={30} style={styles.iconSkip} />
                            }
                            {step.result == 'Fail' &&
                                <Icon name='close-circle' size={30} style={styles.iconFail} />
                            }

                        </View>
                    </View>
                ))}
            </ScrollView>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
                Go back home
            </Button>
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
    icon: {
        marginRight: 10,
        color: 'white'
    },
    iconPass: {
        marginRight: 10,
        color: 'white'
    },
    iconSkip: {
        marginRight: 10,
        color: 'white'
    },
    iconFail: {
        marginRight: 10,
        color: 'white'
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Quicksand-Bold',
        color: 'white'
    },
    subTitle: {
        flexDirection: 'row',
        columnGap: 10,
    },
    stepInfo: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Quicksand-Regular'
    },
    pass: {
        backgroundColor: '#27ae60',
        borderColor: '#0000004f',
    },
    fail: {
        backgroundColor: '#e74c3c',
        borderColor: '#0000004f',
    },
    skip: {
        backgroundColor: '#7f8c8d',
        borderColor: '#0000004f',
    },
    notStarted: {
        backgroundColor: '#ffbfb8',
        borderColor: '#ffbfb8',
    },
    button: {
        marginTop: 20,
        alignSelf: 'center',
    },
    headerRightContainer: {
        marginRight: 10,
        flexDirection: 'row',
        columnGap: 5
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
        // backgroundColor: 'red',
        alignSelf: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
