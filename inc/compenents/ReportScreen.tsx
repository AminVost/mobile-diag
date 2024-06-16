import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext, TimerContext } from '../../App';
import { formatTime } from '../utils/formatTime';

export default function ReportScreen({ navigation }) {
    const { testSteps } = useContext(DataContext);
    const { elapsedTimeRef, startTime } = useContext(TimerContext);
    console.log(elapsedTimeRef.current)


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
            {/* <Text style={styles.header}>Test Report</Text> */}
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.header}>The total elapsed time: {formatTime(elapsedTimeRef.current)}</Text>
                {testSteps.map((step, index) => (
                    <View key={index} style={[styles.stepContainer, getResultColor(step.result)]}>
                        <Icon name={step.icon} size={30} style={styles.icon} />

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{step.title}</Text>
                            <View style={styles.subTitle}>
                                <Text style={styles.stepInfo}>Priority: {step.priority}</Text>
                                {step.duration &&
                                    < Text style={styles.stepInfo}>Duration: {step.duration}</Text>
                                }
                            </View>
                        </View>
                    </View>
                ))
                }
            </ScrollView >
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
                Go back home
            </Button>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Quicksand-Bold'
    },
    subTitle: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 10,
    },
    stepInfo: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'Quicksand-Regular'
    },
    pass: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    fail: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
    skip: {
        backgroundColor: '#e2e3e5',
        borderColor: '#d6d8db',
    },
    notStarted: {
        backgroundColor: '#ffbfb8',
        borderColor: '#ffbfb8',
    },
    button: {
        marginTop: 20,
        alignSelf: 'center',
    },
});
