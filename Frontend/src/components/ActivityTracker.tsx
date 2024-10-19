// src/hooks/useActivityTracker.js
import { useEffect } from 'react';

const useActivityTracker = (resetTimeout) => {
    useEffect(() => {
        const handleActivity = () => {
            if (resetTimeout) {
                resetTimeout(); // Chama a função passada para resetar o timeout
            }
        };

        // Monitora eventos de mouse e teclado
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [resetTimeout]);
};

export default useActivityTracker;
