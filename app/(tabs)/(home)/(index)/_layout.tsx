import React, { useEffect, useRef } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { Animated } from 'react-native';
import { tabbarStyle } from '@/helper/my-lib';

const RootHome = () => {
    const navigation = useNavigation();
    const tabBarAnimation = useRef(new Animated.Value(1)).current;
    const tabBarHeight = useRef(new Animated.Value(60)).current;

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            const shouldHideTabBar = ["selectdatatime"].includes(currentRoute.state?.routes[1]?.name as any);

            Animated.parallel([
                Animated.timing(tabBarAnimation, {
                    toValue: shouldHideTabBar ? 0 : 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(tabBarHeight, {
                    toValue: shouldHideTabBar ? 0 : 50,
                    duration: 300,
                    useNativeDriver: false,
                })
            ]).start();

            if (!shouldHideTabBar) {
                navigation.setOptions({
                    tabBarStyle: [{
                        transform: [{
                            translateY: tabBarAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0],
                            })
                        }],
                    }, tabbarStyle]
                });
            }
        });
        return unsubscribe;
    }, [navigation, tabBarAnimation, tabBarHeight]);
    return (
        <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='selectdatatime' />
        </Stack>
    )
}

export default RootHome