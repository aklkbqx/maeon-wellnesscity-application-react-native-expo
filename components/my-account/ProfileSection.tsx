import { Avatar, Image, View } from "react-native-ui-lib";
import TextTheme from "../TextTheme";
import tw from "twrnc"

const ProfileSection = () => {
    const defaultProfile = require("@/assets/images/default-profile.jpg");
    return (
        <View style={tw`p-5 flex-row items-center gap-4`}>
            <View style={[tw`w-[70px] h-[70px] rounded-full bg-zinc-300 items-center justify-center`]}>
                <Avatar
                    size={65}
                    source={defaultProfile}
                    onImageLoadStart={() => console.log('Image load started')}
                    onImageLoadEnd={() => console.log('Image load ended')}
                    onImageLoadError={() => console.log('Image load failed')}
                />
            </View>
            <TextTheme font="Prompt-SemiBold" size="xl" children="ลงทะเบียน/เข้าสู่ระบบ" />
        </View>
    )
}

export default ProfileSection;