import React, { memo, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, Modal,StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext, TimerContext } from '../../../App';
import { formatTime } from '../../utils/formatTime';
const CustomAlert = memo(({ isAlertVisible, handleResult, toggleAlert }) => {

    // const { elapsedTimeRef } = useContext(TimerContext);
    console.log('CustomAlert rendered');
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
                    <Text style={styles.customModalTitle}>Please select the Display test result</Text>
                    {/* <Text style={styles.customModalTitle}>{`Elapsed Time: ${formatTime(elapsedTimeRef.current)}`}</Text> */}
                    {/* Do not include frequently changing props */}
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
});

export default CustomAlert;

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
