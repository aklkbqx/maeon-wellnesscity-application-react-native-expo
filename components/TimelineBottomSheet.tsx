import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import tw from 'twrnc';
import { useBottomSheet } from '@/context/BottomSheetContext';
import TextTheme from './TextTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-ui-lib';

const TimelineBottomSheet = () => {
    const { isBottomSheetVisible, setIsBottomSheetVisible } = useBottomSheet();
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '75%', "89%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsBottomSheetVisible(false);
        }
    }, [isBottomSheetVisible]);

    useEffect(() => {
        if (isBottomSheetVisible) {
            bottomSheetRef.current?.expand()
        } else {
            bottomSheetRef.current?.close()
        }

    }, [isBottomSheetVisible])

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            style={tw`border border-slate-300 rounded-t-2xl overflow-hidden`}
            android_keyboardInputMode="adjustResize"
            keyboardBlurBehavior="restore"
            enableOverDrag={false}
            enableContentPanningGesture={false}
        >
            <View style={tw`flex-1 p-4`}>
                <TextTheme font='Prompt-SemiBold' size='xl' style={tw`text-center mb-4`}>จัดตารางเวลาการท่องเที่ยว</TextTheme>
            </View>
        </BottomSheet>
    );
};

export default TimelineBottomSheet;