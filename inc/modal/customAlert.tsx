import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert, ScrollView, TouchableOpacity, Platform, Image, Modal, Pressable, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import your icon library

const [isAlertVisible, setAlertVisible] = useState(false);

const CustomAlert = ({ visible, toggleAlert }) => {
    const [isVisible, setIsVisible] = useState(visible);

    const handleClose = () => {
        setIsVisible(false);
        toggleAlert();
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.customModalContent}>
                    <Text style={styles.customModalTitle}>Connection Status Guide</Text>

                    <View style={styles.customModalRow}>
                        <Icon name="wifi-remove" size={30} color="#e84118" />
                        <Text style={styles.customModalText}>The device is not connected to the Internet</Text>
                    </View>
                    <View style={styles.customModalRow}>
                        <Icon name="wifi-alert" size={30} color="#F79F1F" />
                        <Text style={styles.customModalText}>The device is connected to the Internet, but the connection with the PC system is not established</Text>
                    </View>
                    <View style={styles.customModalRow}>
                        <Icon name="wifi-check" size={30} color="#44bd32" />
                        <Text style={styles.customModalText}>The connection is established correctly</Text>
                    </View>

                    <TouchableOpacity style={styles.closeButtonCon} onPress={handleClose}>
                        <Text style={styles.closeButton}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    customModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    customModalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    customModalText: {
        fontSize: 16,
        marginLeft: 10,
    },
    closeButtonCon: {
        marginTop: 20,
    },
    closeButton: {
        color: 'blue',
        fontSize: 16,
    },
});

export default CustomAlert;