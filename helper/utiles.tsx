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
