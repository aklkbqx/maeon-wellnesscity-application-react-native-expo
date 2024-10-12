import { TextInput, View, LayoutChangeEvent } from "react-native";
import TextTheme from "../TextTheme";
import tw from "twrnc"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FormDataInput } from "@/types/types";
import { Users } from "@/types/PrismaType";

interface UserInfoSectionProps {
    formDataInput: FormDataInput;
    setFormDataInput: React.Dispatch<React.SetStateAction<FormDataInput>>;
    userData: Users | null;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ formDataInput, setFormDataInput, userData }) => {
    const [viewDimensions, setViewDimensions] = useState<{ [key: string]: { width: number, height: number } }>({});

    const handleLayout = (event: LayoutChangeEvent, field: string) => {
        const { width, height } = event.nativeEvent.layout;
        setViewDimensions(prev => ({ ...prev, [field]: { width, height } }));
    };

    return (
        <>
            <View style={tw.style("flex-row gap-2")}>
                <Ionicons name='person' size={20} style={tw`mt-0.2`} />
                <TextTheme font='Prompt-SemiBold' size='xl'>ข้อมูลผู้ใช้</TextTheme>
            </View>
            <View style={tw.style("overflow-hidden rounded-2xl gap-1  mt-2")}>
                {(['firstname', 'lastname', 'tel'] as const)
                    .filter((item) => (userData?.role !== "ADMIN" ? true : item !== "tel"))
                    .map((field) => (
                        <View key={field} style={tw.style("relative")}>
                            <View style={tw.style("absolute top-2 left-2 z-10 flex-row gap-2")} onLayout={(event) => handleLayout(event, field)}>
                                <TextTheme
                                    style={tw.style("android:pt-1.5 ios:pt-0.5")}
                                    color='slate-500'
                                >
                                    {field === "firstname" ? "ชื่อ:" : field === "lastname" ? "นามสกุล:" : "เบอร์โทรศัพท์:"}
                                </TextTheme>
                            </View>
                            <TextInput
                                style={[tw.style(`p-3 bg-slate-100 pl-[${viewDimensions[field]?.width + 15 || 0}px]`), { fontFamily: "Prompt-Regular" }]}
                                placeholder={field === 'firstname' ? 'ชื่อ' : field === 'tel' ? '0xxxxxxxxx' : "นามสกุล"}
                                placeholderTextColor="#a1a1aa"
                                value={formDataInput[field]}
                                onChangeText={(text) => setFormDataInput(prev => ({ ...prev, [field]: text }))}
                                autoCapitalize="none"
                                keyboardType={field === 'tel' ? 'numeric' : 'default'}
                                maxLength={field === 'tel' ? 10 : undefined}
                            />
                        </View>
                    ))
                }
            </View>
        </>
    )
}

export default UserInfoSection;
