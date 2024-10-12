import { Avatar, TouchableOpacity, View } from "react-native-ui-lib";
import TextTheme from "../TextTheme";
import tw from "twrnc"
import { router } from "expo-router";
import { formatEmail, formatPhoneNumber } from "@/helper/my-lib";
import { Users } from "@/types/PrismaType";

interface ProfileType {
    profileImageUrl: string | null;
    userData: Users | null;
    loading: boolean;
}

const ProfileSection: React.FC<ProfileType> = ({ profileImageUrl, userData, loading }) => {
    return (
        <View style={tw`p-5 flex-row items-center gap-4`}>
            <View style={[tw`w-[80px] h-[80px] rounded-full bg-zinc-300 items-center justify-center`]}>
                {(userData && profileImageUrl ? (
                    <Avatar
                        size={75}
                        badgePosition='BOTTOM_RIGHT'
                        badgeProps={{ backgroundColor: String(tw`text-green-500`.color), size: 15, borderWidth: 1, borderColor: "white" }}
                        source={{ uri: profileImageUrl }}
                    />
                ) : (
                    <Avatar
                        size={75}
                        source={require("@/assets/images/default-profile.jpg")}
                    />
                ))}
            </View>
            {userData ? (
                <TouchableOpacity onPress={() => router.navigate("/account/edit-account")} style={tw.style("flex-col gap-1 flex-1")}>
                    <View style={tw.style("flex-row gap-1")}>
                        <TextTheme size='lg' font="Prompt-SemiBold">{userData && `${userData.firstname} ${userData.lastname}`}</TextTheme>
                    </View>
                    <View style={tw.style("flex-row gap-1")}>
                        <TextTheme size='xs' color='slate-600' style={tw.style("w-[200px]")}>{userData && formatEmail(userData.email)}</TextTheme>
                    </View>
                    <View style={tw.style("flex-row gap-1")}>
                        <TextTheme size='xs' style={tw.style("w-[200px]")}>{userData && formatPhoneNumber(userData.tel)}</TextTheme>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => router.navigate({
                        pathname: "/register",
                        params: {
                            backToPage: "/my-account"
                        }
                    })}>
                        <TextTheme font="Prompt-SemiBold" size="xl" children="ลงทะเบียน" />
                    </TouchableOpacity>
                    <TextTheme font="Prompt-SemiBold" size="xl" children="/" />
                    <TouchableOpacity onPress={() => router.navigate({
                        pathname: "/login",
                        params: {
                            backToPage: "/my-account"
                        }
                    })}>
                        <TextTheme font="Prompt-SemiBold" size="xl" children="เข้าสู่ระบบ" />
                    </TouchableOpacity>
                </View>
            )}
        </View >
    )
}

export default ProfileSection;