import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';

type InternetContextType = {
    isConnected: boolean;
};

const InternetContext = createContext<InternetContextType | undefined>(undefined);

export const InternetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
            if (!state.isConnected) {
                router.replace('/connection-error');
            }
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    return (
        <InternetContext.Provider value={{ isConnected }
        }>
            {children}
        </InternetContext.Provider>
    );
};

export const useInternet = () => {
    const context = useContext(InternetContext);
    if (context === undefined) {
        throw new Error('useInternet must be used within an InternetProvider');
    }
    return context;
};