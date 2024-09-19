import Toast from "react-native-toast-message";
import tw from "twrnc"

const useShowToast = (
    type: 'success' | 'error' | 'info' | (string & {}),
    text1: string,
    text2: string
) => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        text1Style: [tw`text-base`, { fontFamily: "Prompt-Regular" }],
        text2Style: [tw`text-sm`, { fontFamily: "Prompt-Regular" }]
    });
}

export default useShowToast;