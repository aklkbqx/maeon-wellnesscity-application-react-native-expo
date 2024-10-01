import { View } from 'react-native';
import React from 'react';
import TextTheme, { sizeText } from './TextTheme';
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc"
import { LinearGradient } from 'expo-linear-gradient';

interface userRoleType {
    role: string | null | undefined;
    size?: sizeText;
    style?: object;
}

const UserRoleBadge: React.FC<userRoleType> = ({ role, size = "sm", style }) => {
    const getBadgeProps = (role: any) => {
        switch (role) {
            case 'USER':
                return {
                    color: 'blue',
                    role: 'ผู้ใช้งานทั่วไป',
                    icon: "person",
                };
            case 'ADMIN':
                return {
                    color: 'rose',
                    role: 'แอดมิน ผู้ดูแลระบบ',
                    icon: "person",
                };
            case 'METCHANT':
                return {
                    color: 'yellow',
                    role: 'เจ้าของร้านอาหาร',
                    icon: "person",
                };
            case 'HOTEL':
                return {
                    color: 'sky',
                    role: 'เจ้าของที่พักและโรงแรม',
                    icon: "person",
                };
            case 'TOUR':
                return {
                    color: 'fuchsia',
                    role: 'เจ้าของสถานที่ท่องเที่ยว',
                    icon: "person",
                };
            case 'LEARNING_RESOURCE':
                return {
                    color: 'teal',
                    role: 'เจ้าของแหล่งเรียนรู้',
                    icon: "person",
                };
            case 'SEASONAL_TRAVEL':
                return {
                    color: 'pink',
                    role: 'เจ้าของที่เที่ยวตามฤดูกาล',
                    icon: "person",
                };
            case 'HOSPITAL':
                return {
                    color: 'red',
                    role: 'โรงพยาบาล',
                    icon: "person",
                };
            default:
                return {
                    color: '',
                    role: 'ไม่ระบุสถานะ',
                    icon: "person",
                };
        }
    };

    const badgeProps = getBadgeProps(role);
    const combinedStyles = style ? [tw.style(`p-4 py-1 rounded-3xl mt-2 flex-row items-center justify-center`), style] : tw.style(`p-4 py-1 rounded-3xl mt-2 flex-row items-center justify-center`);
    const color = [String(tw.color(`${badgeProps.color}-400`)), String(tw.color(`${badgeProps.color}-500`))]

    return (
        <LinearGradient colors={color} style={[combinedStyles, tw.style("flex-row gap-1 items-center")]}>
            <Ionicons color={"white"} size={18} name={badgeProps.icon as any} style={tw.style("mb-0.5")} />
            <TextTheme color='white' font='Prompt-SemiBold' size={size} children={badgeProps.role} />
        </LinearGradient>
    );

}

export default UserRoleBadge;
