import React, { useEffect, useRef, useState, useContext } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../App';

const AnimatedIcon = () => { 
    const { testStep } = useContext(DataContext);
    const { width, height } = Dimensions.get('screen');

    const iconPosition = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(true);

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

    const handlePress = () => {
        setVisible(false);
        iconPosition.stopAnimation(); // Stop the animation
    };

    if (!visible) {
        return null;
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={[styles.bgAnimted, { width: width }, { height: height }]}>
                <View style={styles.container}>
                    <Text style={styles.fixedText}>Swipe Right To Open The Menu</Text>
                    <Animated.View style={[styles.iconContainer, { transform: [{ translateX: iconPosition }] }]}>
                        <Icon name="hand-pointing-up" size={60} color="white" style={styles.icon} />
                    </Animated.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bgAnimted: {
        position: 'absolute',
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
