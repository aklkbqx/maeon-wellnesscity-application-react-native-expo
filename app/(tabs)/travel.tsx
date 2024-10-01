import QRCodeGenerator from '@/components/QRCodeGenerator';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Image } from 'react-native';
import { View } from 'react-native-ui-lib';
import tw from "twrnc"

export default function Travel() {
  useStatusBar("dark-content");
  const qrCodeData = "00020101021229370016A000000677010111011300669028561885802TH53037645406550.0063046640";
  const logoUrl = require("@/assets/images/icon-thaiqr.png");
  const PromptPayLogo = require("@/assets/images/PromptPay-logo.png");
  return (
    <>
      <View style={[tw`flex-1 bg-slate-100`]}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Image source={PromptPayLogo} style={[tw`h-20`, { objectFit: "contain" }]} />
          <QRCodeGenerator
            data={qrCodeData}
            size={250}
            logo={logoUrl}
          />
          <TextTheme>สแกน QR Code นี้ด้วยแอพธนาคารของคุณเพื่อชำระเงิน</TextTheme>
        </View>
        {/* <View style={tw`bg-slate-200 rounded-full p-2`}> */}
        {/* <Ionicons name='car' size={50} style={tw`text-blue-500`} /> */}
        {/* </View> */}
        {/* <TextTheme style={tw`text-center text-gray-500`}>ยังไม่มีสถานะการเดินทางของคุณ...</TextTheme> */}
      </View>
    </>
  );
}