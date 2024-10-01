import tw from "twrnc"
import { BlurView } from "expo-blur";
import { ActivityIndicator, Modal, View } from "react-native";

const OverlayComponents: React.FC<{
    refreshing: boolean,
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void
}> = ({ refreshing, modalVisible, setModalVisible }) => (
    <>
        {/* {refreshing && (
            <View style={twclass("absolute top-0 left-0 w-full h-full z-999")}>
                <BlurView intensity={10} style={twclass("flex-1 items-center justify-center")} />
            </View>
        )} */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <BlurView intensity={20} style={tw.style("flex-1 items-center justify-center")}>
                <View style={tw.style("flex-row items-center gap-2")}>
                    <ActivityIndicator size="large" color={String(tw.color("blue-500"))} />
                </View>
            </BlurView>
        </Modal>
        {/* {toast.visible ? <ToastMessage type={toast.type as "success" | "warning" | "error" | null} message={toast.message} /> : null} */}
    </>
);

export default OverlayComponents;