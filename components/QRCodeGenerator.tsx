import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGenerator_Type {
    data: string;
    size: number;
    logo: number;
}

const QRCodeGenerator: React.FC<QRCodeGenerator_Type> = ({ data, size = 200, logo }) => {
    return (
        <View style={styles.container}>
            <QRCode
                value={data}
                size={size}
                color="black"
                logo={logo}
                logoSize={size * 0.2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default QRCodeGenerator;