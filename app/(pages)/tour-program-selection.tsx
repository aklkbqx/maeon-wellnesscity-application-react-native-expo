// import { useRouter } from 'expo-router';

// // ... (โค้ดอื่นๆ ยังคงเหมือนเดิม)

// const TourProgramSelection = () => {
//     const router = useRouter();

//     // ... (โค้ดอื่นๆ ยังคงเหมือนเดิม)

//     const handleProgramSelect = (program: Program) => {
//         router.push({
//             pathname: '/program-detail',
//             params: { programId: program.id.toString() }
//         });
//     };

//     const renderProgram = ({ item }: { item: Program }) => (
//         <TouchableOpacity
//             style={tw`bg-white rounded-2xl shadow-md mb-4 p-4 border border-slate-200`}
//             onPress={() => handleProgramSelect(item)}
//         >
//             {/* ... (เนื้อหาภายใน TouchableOpacity ยังคงเหมือนเดิม) */}
//         </TouchableOpacity>
//     );

//     // ... (โค้ดที่เหลือยังคงเหมือนเดิม)
// };

// export default TourProgramSelection;

import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';

interface Activity {
    time: string;
    name: string;
    description: string;
}

interface Program {
    id: number;
    name: string;
    activities: Activity[];
}

// TODO ทำหน้ารายละเอียดใชว์โปรแกรมแต่ละโปรแกรม

const TourProgramSelection: React.FC = () => {
    const { programId } = useLocalSearchParams();
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgramDetail();
    }, [programId]);

    const fetchProgramDetail = async () => {
        try {
            const response = await fetch(`/api/v1/${programId}`);
            const result = await response.json();
            if (result.status === 'success') {
                setProgram(result.data);
            } else {
                console.error('Failed to fetch program details:', result.message);
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!program) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <TextTheme>ไม่พบข้อมูลโปรแกรม</TextTheme>
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 bg-white p-4`}>
            <TextTheme font="Prompt-Medium" style={tw`text-xl mb-4`}>{program.name}</TextTheme>

            {program.activities.map((activity, index) => (
                <View key={index} style={tw`flex-row mb-4`}>
                    <View style={tw`mr-4 items-center`}>
                        <View style={tw`w-3 h-3 rounded-full bg-blue-500`} />
                        {index < program.activities.length - 1 && (
                            <View style={tw`w-0.5 h-full bg-blue-500 mt-1`} />
                        )}
                    </View>
                    <View style={tw`flex-1`}>
                        <TextTheme font="Prompt-Medium" style={tw`text-lg`}>{activity.time}</TextTheme>
                        <TextTheme style={tw`text-base font-semibold`}>{activity.name}</TextTheme>
                        <TextTheme style={tw`text-sm text-gray-600`}>{activity.description}</TextTheme>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default TourProgramSelection;