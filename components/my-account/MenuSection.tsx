import { Ionicons } from "@expo/vector-icons";
import TextTheme from "../TextTheme";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Href, router } from "expo-router";
import { Switch } from "react-native-ui-lib";

type IoniconsName = keyof typeof Ionicons.glyphMap;

type MenuItem = {
    text: string;
    iconname: IoniconsName;
    link: string;
    color?: string;
};

type MenuList = {
    [key: string]: MenuItem[];
};

const menuList: MenuList = {
    account: [
        {
            text: "ข้อมูลส่วนตัว",
            iconname: "person",
            link: "/pages/manage-account"
        },
        {
            text: "สิ่งที่ถูกใจ",
            iconname: "heart",
            link: "/"
        },
    ],
    policy: [
        {
            text: "ติดต่อกับฝ่ายสนับสนุน",
            iconname: "chatbubbles-sharp",
            link: "/"
        },
        {
            text: "รายงานปัญหา",
            iconname: "flag",
            link: "/"
        },
        {
            text: "ข้อกำหนดและนโยบาย",
            iconname: "alert-circle",
            link: "/"
        },
    ],
    setting: [
        {
            text: "การแจ้งเตือน",
            iconname: "notifications",
            link: "/"
        },
        {
            text: "ออกจากระบบ",
            iconname: "log-out",
            link: "/logout"
        },
    ]
};

const MenuSection: React.FC<{ title: string; type: keyof typeof menuList }> = ({ title, type }) => {
    const items = menuList[type] || [];

    return (
        <>
            {title && <TextTheme children={title} size="lg" color="zinc-400" font="Prompt-SemiBold" style={tw`px-5 my-2`} />}
            <View style={tw`border-b-2 border-slate-200`} />
            {items.map(({ text, iconname, link }, index) => (
                <TouchableOpacity
                    key={`menulist-${type}-${index}`}
                    onPress={() => router.navigate(link as Href)}
                    style={tw`flex-row justify-between items-center px-5 w-full py-3`}
                >
                    <View style={tw`flex-row items-center gap-2`}>
                        <Ionicons style={text == "ออกจากระบบ" ? tw`text-red-600` : tw`text-zinc-700`} size={25} name={iconname} />
                        <TextTheme color={text == "ออกจากระบบ" ? "red-600" : 'zinc-700'} style={tw`text-[16px]`}>{text}</TextTheme>
                    </View>
                    {text == "การแจ้งเตือน" ? (
                        <View>
                            <Switch value={false} onValueChange={() => console.log('value changed')} />
                        </View>
                    ) : null}
                </TouchableOpacity>
            ))}
        </>
    );
};

export default MenuSection;