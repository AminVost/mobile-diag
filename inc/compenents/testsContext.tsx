import React, { createContext, useState, useContext } from 'react';

export const TestsContext = createContext();

export const TestsProvider = ({ children }) => {
    const [testStep, setTestStep] = useState(1);
    const [testSteps, setTestSteps] = useState([
        {
            title: 'TouchScreen',
            icon: 'cellphone-screenshot',
            text: '',
            result: null,
            startBtn: true,
            priority: 1,
        },
        {
            title: 'MultiTouch',
            icon: 'cellphone-screenshot',
            text: '',
            result: null,
            startBtn: true,
            priority: 2,
        },
        {
            title: 'Display',
            icon: 'cellphone-screenshot',
            text: '',
            result: null,
            startBtn: true,
            priority: 3,
        },
        {
            title: 'Battery',
            icon: 'cellphone-screenshot',
            text: '',
            result: null,
            startBtn: true,
            priority: 4,
        },
    ]);

    return (
        <TestsContext.Provider value={{ testStep, setTestStep, testSteps, setTestSteps }}>
            {children}
        </TestsContext.Provider>
    );
};

export const useTestsContext = () => useContext(TestsContext);
