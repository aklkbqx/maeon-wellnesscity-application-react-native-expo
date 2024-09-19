import { TextProps } from 'react-native';
import React, { ReactNode } from 'react';
import tw from "twrnc"
import { Text } from 'react-native-ui-lib';

export type sizeText = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";

export interface TextThemeProps extends TextProps {
  children: ReactNode;
  font?: 'Prompt-Regular' | 'Prompt-SemiBold' | 'Prompt-Bold' | "Prompt-Medium" | "Prompt-Light";
  style?: object;
  color?: string;
  size?: sizeText;
}

const TextTheme: React.FC<TextThemeProps> = ({ children, font = 'Prompt-Regular', color = "black", size = "base", style, ...props }) => {
  return (
    <Text style={[tw`text-${size} text-${color}`, { fontFamily: font }, style]} {...props}>{children}</Text>
  );
};

export default TextTheme;
