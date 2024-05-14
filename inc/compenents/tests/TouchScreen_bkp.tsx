// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, PanResponder, Dimensions, Text, StatusBar, SafeAreaView } from 'react-native';
// import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';

// const TouchScreenTest = () => {
//     hideNavigationBar();

//     const [squares, setSquares] = useState([]);
//     const [completed, setCompleted] = useState(false);
//     const screenWidth = Dimensions.get('screen').width;
//     const screenHeight = Dimensions.get('screen').height;
//     const squareSize = Math.min(screenWidth, screenHeight) / 7;
//     // const squareSizeW = Math.min(screenWidth) / 8;
//     // const squareSizeH = Math.min(screenHeight) / 11;

//     useEffect(() => {
//         generateSquares();
//     }, []);

//     const generateSquares = () => {
//         const squaresPerRow = Math.ceil(screenWidth / squareSize);
//         const squaresPerColumn = Math.ceil(screenHeight / squareSize);
//         const newSquares = [];

//         for (let i = 0; i < squaresPerColumn; i++) {
//             for (let j = 0; j < squaresPerRow; j++) {
//                 newSquares.push({ id: `${i}-${j}`, x: j * squareSize, y: i * squareSize });
//             }
//         }

//         setSquares(newSquares);
//     };

//     const handleSquareDrag = (squareId) => {
//         const updatedSquares = squares.filter(square => square.id !== squareId);
//         setSquares(updatedSquares);
//         if (updatedSquares.length === 0) {
//             setCompleted(true);
//         }
//     };

//     const panResponder = PanResponder.create({
//         onStartShouldSetPanResponder: () => true,
//         onPanResponderMove: (event, gestureState) => {
//             const touchX = gestureState.moveX;
//             const touchY = gestureState.moveY;

//             squares.forEach(square => {
//                 if (
//                     touchX >= square.x &&
//                     touchX <= square.x + squareSize &&
//                     touchY >= square.y &&
//                     touchY <= square.y + squareSize
//                 ) {
//                     handleSquareDrag(square.id);
//                 }
//             });
//         },
//     });
//     if (completed) {
//         showNavigationBar();
//     }

//     return (
//         <>
//             <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="default" />
//             <View style={{
//                 flex: 1,
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }} {...panResponder.panHandlers}>
//                 {squares.map(square => (
//                     <View
//                         key={square.id}
//                         style={[styles.square, { width: squareSize, height: squareSize, left: square.x, top: square.y }]} />
//                 ))}
//                 {completed && <Text style={styles.completionText}>Touch screen test successful!</Text>}
//             </View>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         position: 'relative',
//     },
//     square: {
//         position: 'absolute',
//         backgroundColor: 'blue',
//         borderWidth: 1,
//         borderColor: '#ffffff3d'
//     },
//     completionText: {
//         position: 'absolute',
//         bottom: 20,
//         alignSelf: 'center',
//         fontWeight: 'bold',
//         fontSize: 20,
//         color: 'green',
//     },
// });

// export default TouchScreenTest;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Text, StatusBar } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';

const TouchScreenTest = () => {
    useEffect(() => {
        hideNavigationBar();
        return () => showNavigationBar(); // Ensure the navigation bar is shown when the component unmounts
    }, []);

    const [squares, setSquares] = useState([]);
    const [completed, setCompleted] = useState(false);
    const screenWidth = Dimensions.get('screen').width;
    const screenHeight = Dimensions.get('screen').height;
    const squareSize = Math.min(screenWidth, screenHeight) / 7;
    // const squareSizeW = Math.min(screenWidth) / 8;
    // const squareSizeH = Math.min(screenHeight) / 11;

    useEffect(() => {
        generateSquares();
    }, []);

    const generateSquares = () => {
        const squaresPerRow = Math.ceil(screenWidth / squareSize);
        const squaresPerColumn = Math.ceil(screenHeight / squareSize);
        const newSquares = [];

        for (let i = 0; i < squaresPerColumn; i++) {
            for (let j = 0; j < squaresPerRow; j++) {
                newSquares.push({ id: `${i}-${j}`, x: j * squareSize, y: i * squareSize });
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
                    touchX <= square.x + squareSize &&
                    touchY >= square.y &&
                    touchY <= square.y + squareSize
                ) {
                    handleSquareDrag(square.id);
                }
            });
        },
    });

    return (
        <>
            <StatusBar hidden={true} translucent={true} backgroundColor="transparent" barStyle="default" />
            <View style={styles.container} {...panResponder.panHandlers}>
                {squares.map(square => (
                    <View
                        key={square.id}
                        style={[styles.square, { width: squareSize, height: squareSize, left: square.x, top: square.y }]} />
                ))}
                {completed && <Text style={styles.completionText}>Touch screen test successful!</Text>}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    square: {
        position: 'absolute',
        backgroundColor: 'blue',
        borderWidth: 1,
        borderColor: '#ffffff3d'
    },
    completionText: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'green',
    },
});

export default TouchScreenTest;

