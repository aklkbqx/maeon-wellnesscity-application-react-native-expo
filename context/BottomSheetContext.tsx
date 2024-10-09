import React, { createContext, useContext, useState } from 'react';

type BottomSheetContextType = {
    isBottomSheetVisible: boolean;
    setIsBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
    toggleBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(true);

    const toggleBottomSheet = () => {
        setIsBottomSheetVisible(prev => !prev);
    };

    return (
        <BottomSheetContext.Provider value={{ isBottomSheetVisible, setIsBottomSheetVisible, toggleBottomSheet }}>
            {children}
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (context === undefined) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }
    return context;
};