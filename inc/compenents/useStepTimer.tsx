import { useState, useEffect } from 'react';

const useStepTimer = () => {
    const [startTime] = useState(Date.now());

    const getDuration = () => {
        return Math.round((Date.now() - startTime) / 1000);
    };

    return getDuration;
};

export default useStepTimer;