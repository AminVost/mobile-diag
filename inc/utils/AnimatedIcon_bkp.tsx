// AnimatedIcon.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../App';

const AnimatedIcon = () => { 
    const { testStep } = useContext(DataContext);
    const { width, height } = Dimensions.get('screen');

    const iconPosition = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(true);

    // useEffect(() => {
    //     setVisible(true);
    //     animateIcon();
    // }, []);

    useEffect(() => {
        if (testStep === 1) {
            setVisible(true);
            animateIcon();
        } else {
            setVisible(false);
        }
    }, [testStep]);

    const animateIcon = () => {
        Animated.sequence([
            Animated.timing(iconPosition, { toValue: 80, duration: 800, useNativeDriver: true }),
            Animated.timing(iconPosition, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(iconPosition, { toValue: 80, duration: 800, useNativeDriver: true }),
            Animated.timing(iconPosition, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start(() => {
            setVisible(false);
        });
    };

    if (!visible) {
        return null;
    }

    return (
        <View style={[styles.bgAnimted, { width: width }, { height: height }]}>
            <View style={styles.container}>
                <Text style={styles.fixedText}>Swipe Right To Open The Menu</Text>
                <Animated.View style={[styles.iconContainer, { transform: [{ translateX: iconPosition }] }]}>
                    <Icon name="hand-pointing-up" size={60} color="white" style={styles.icon} />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bgAnimted: {
        position: 'absolute',
        // top: 0,
        // bottom: 0,
        // left: 0,
        // width: '100%',
        // height: '100%',
        zIndex: 9,
        backgroundColor: '#00000085'
    },
    container: {
        position: 'absolute',
        alignItems: 'center',
        top: '15%', // Adjust this value based on the desired position
        left: 0,
    },
    fixedText: {
        marginBottom: 10, // Adjust the space between the text and the icon
        marginLeft: 5,
        fontSize: 16,
        color: 'white', // Change the color as needed
        fontFamily: 'Quicksand-Medium'
    },
    iconContainer: {
        position: 'absolute',
        left: -10,
        top: 20
    },
    icon: {
        transform: [{ rotate: '-30deg' }], // Adjust the degree as needed
    },
});

export default AnimatedIcon;
