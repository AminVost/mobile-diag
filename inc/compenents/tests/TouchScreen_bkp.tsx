import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Text, StatusBar } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import LinearGradient from 'react-native-linear-gradient';

const TouchScreenTest = ({ navigation, route }) => {
    useEffect(() => {
        hideNavigationBar();
        return () => {
            showNavigationBar()
        };
    }, []); 

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
        generateSquares();
    }, []);

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
            <LinearGradient
                colors={['#FFFFFF', '#4CAF50', '#FFFFFF']}
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
                {
                    completed &&
                    <>
                        <Text style={styles.completionText}>
                            Touch screen test successful!
                        </Text>
                    </>
                }
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center'
    },
    square: {
        position: 'absolute',
        backgroundColor: 'blue',
        borderWidth: 1,
        borderColor: '#ffffff3d',
    },
    completionText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
});

export default TouchScreenTest;
