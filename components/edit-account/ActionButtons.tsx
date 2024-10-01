import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import TextTheme from "../TextTheme";
import tw from "twrnc"
import { Ionicons } from "@expo/vector-icons";

const ActionButtons: React.FC<{
    handleCancel: () => void, handleSaveProfile: () => void,
    loadingCancel: boolean,
    modalVisible: boolean,
}> = ({ handleCancel, handleSaveProfile, loadingCancel, modalVisible }) => (
    <View style={tw.style("flex-row gap-2 items-center justify-end mt-5 ios:mb-15 android:mb-5")}>
        <TouchableOpacity
            style={tw.style("bg-zinc-400 p-2 rounded-xl flex-row items-center gap-2")}
            onPress={handleCancel}
            disabled={loadingCancel}
        >
            <View style={tw.style("flex-row gap-1")}>
                {loadingCancel && loadingCancel ? <ActivityIndicator size="small" color={String(tw.color("white"))} /> : <Ionicons name="reload" size={20} style={tw.style("text-white mt-0.5")} />}
                <TextTheme font='Prompt-SemiBold' color='white' children="ยกเลิก" />
            </View>

        </TouchableOpacity>
        <TouchableOpacity
            style={tw.style(`bg-blue-500 p-2 rounded-xl flex-row items-center gap-2`)}
            onPress={handleSaveProfile}
        // disabled={toast.visible ? true : false}
        >
            <View style={tw.style("flex-row gap-1")}>
                {modalVisible && modalVisible ? <ActivityIndicator size="small" color={String(tw.color("white"))} /> : <Ionicons name="save" size={20} style={tw.style("text-white mt-0.5")} />}
                <TextTheme font='Prompt-SemiBold' color='white' children="บันทึก" />
            </View>
        </TouchableOpacity>
    </View>
);

export default ActionButtons;