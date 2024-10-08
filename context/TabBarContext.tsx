import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { ViewStyle, Animated } from 'react-native';
import tw from "twrnc"

export const tabbarStyle = tw`android:shadow-sm ios:shadow-md bg-white rounded-3xl absolute w-[95%] h-[60px] bottom-5 border-t-0 left-[2.5%]`;

interface TabBarContextType {
  isVisible: boolean;
  showTabBar: () => void;
  hideTabBar: () => void;
  tabBarStyle: Animated.WithAnimatedValue<ViewStyle>;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

interface TabBarProviderProps {
  children: ReactNode;
  defaultStyle: ViewStyle;
}

export const TabBarProvider: React.FC<TabBarProviderProps> = ({ children, defaultStyle }) => {
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const showTabBar = useCallback(() => {
    setIsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11
    }).start();
  }, [slideAnim]);

  const hideTabBar = useCallback(() => {
    setIsVisible(false);
    Animated.spring(slideAnim, {
      toValue: 100,
      useNativeDriver: true,
      tension: 65,
      friction: 11
    }).start();
  }, [slideAnim]);

  const tabBarStyle = useCallback(() => {
    return {
      ...defaultStyle,
      transform: [{ translateY: slideAnim }],
    };
  }, [defaultStyle, slideAnim]);

  const value = {
    isVisible,
    showTabBar,
    hideTabBar,
    tabBarStyle: tabBarStyle()
  };

  return <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>;
};