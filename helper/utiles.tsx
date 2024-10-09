import { FontAwesome5 } from "@expo/vector-icons";

export const getTurnDirection = (turn: number): string => {
    const directions = [
        "ตรงไป", "เลี้ยวขวา", "เลี้ยวซ้าย", "แยกขวา", "แยกซ้าย",
        "กลับรถ", "ขึ้นทางด่วน", "ลงทางด่วน", "เข้าวงเวียน", "ออกจากวงเวียน"
    ];
    return directions[turn] || "ไม่ทราบทิศทาง";
};


export const getTurnIcon = (turn: number, isCompleted: boolean) => {
    const icons = [
        { name: "arrow-up", color: isCompleted ? "green" : "blue" },
        { name: "arrow-right", color: isCompleted ? "green" : "blue" },
        { name: "arrow-left", color: isCompleted ? "green" : "blue" },
        { name: "share", color: isCompleted ? "green" : "blue" },
        { name: "share", color: isCompleted ? "green" : "blue", transform: [{ scaleX: -1 }] },
        { name: "undo", color: isCompleted ? "green" : "blue" },
        { name: "angle-double-up", color: isCompleted ? "green" : "blue" },
        { name: "angle-double-down", color: isCompleted ? "green" : "blue" },
        { name: "circle-notch", color: isCompleted ? "green" : "blue" },
        { name: "sign-out-alt", color: isCompleted ? "green" : "blue" }
    ];

    const icon = icons[turn] || { name: "question", color: isCompleted ? "green" : "blue" };
    return <FontAwesome5 name={icon.name} size={20} color={icon.color} style={icon.transform ? { transform: icon.transform } : undefined} />;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const deg2rad = (deg: number): number => deg * (Math.PI / 180);

export const formatDistance = (distance: number | null): string => {
    if (distance === null) return '';
    return distance < 1 ? `${(distance * 1000).toFixed(0)} ม.` : `${distance.toFixed(2)} กม.`;
};


export const addCommas = (num: string | number): string => {
    const numStr = typeof num === 'number' ? num.toString() : num;
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}

export function base64ToUint8ClampedArray(base64: string): ImageData {
    const cleanedBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    let binaryString: string;
    try {
        binaryString = atob(cleanedBase64);
    } catch (error) {
        throw new Error('Invalid base64 string');
    }
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    const { format, width, height } = getImageInfo(uint8Array);
    let imageData: Uint8ClampedArray;
    if (format === 'png') {
        imageData = removeAlphaChannel(uint8Array, width, height);
    } else {
        imageData = new Uint8ClampedArray(uint8Array);
    }

    return { data: imageData, width, height };
}

function getImageInfo(data: Uint8Array): { format: string; width: number; height: number } {
    if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
        const width = (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
        const height = (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
        return { format: 'png', width, height };
    }

    if (data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) {
        let offset = 2;
        while (offset < data.length) {
            if (data[offset] === 0xFF && data[offset + 1] === 0xC0) {
                const height = (data[offset + 5] << 8) | data[offset + 6];
                const width = (data[offset + 7] << 8) | data[offset + 8];
                return { format: 'jpeg', width, height };
            }
            offset += (data[offset + 2] << 8) | data[offset + 3];
        }
    }

    throw new Error('Unsupported image format');
}

function removeAlphaChannel(data: Uint8Array, width: number, height: number): Uint8ClampedArray {
    const rgbData = new Uint8ClampedArray(width * height * 3);
    let j = 0;
    for (let i = 0; i < data.length; i += 4) {
        rgbData[j] = data[i];     // R
        rgbData[j + 1] = data[i + 1]; // G
        rgbData[j + 2] = data[i + 2]; // B
        j += 3;
    }
    return rgbData;
}