import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { View, Text, Drawer, Colors, Assets, Button, Dialog, TextField } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface Activity {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    category: string;
}

const ProgramManagementScreen: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([
        { id: '1', name: 'ออกกำลังกายเบาๆ', startTime: '09:00', endTime: '09:30', category: 'การตรวจสุขภาพ' },
        { id: '2', name: 'เยี่ยมชมวัดพระแก้ว', startTime: '10:00', endTime: '12:00', category: 'แหล่งท่องเที่ยว' },
    ]);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({});

    const handleDeleteActivity = (id: string) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };

    const handleAddActivity = () => {
        if (newActivity.name && newActivity.startTime && newActivity.endTime && newActivity.category) {
            setActivities([...activities, { ...newActivity, id: Date.now().toString() } as Activity]);
            setNewActivity({});
            setIsAddDialogVisible(false);
        }
    };

    const renderActivityItem = (activity: Activity) => {
        return (
            <View style={tw`flex-row`}>
                <View style={tw`w-20 mr-4 bg-blue-200 items-center justify-center rounded-xl`}>
                    <Text style={tw`text-gray-600`}>{activity.startTime}</Text>
                    <Text style={tw`text-gray-600`}>{activity.endTime}</Text>
                </View>
                <View style={tw`flex-1`}>
                    <View style={tw`bg-white rounded-lg p-3 shadow-sm`}>
                        <Text style={tw`font-bold text-gray-800`}>{activity.name}</Text>
                        <Text style={tw`text-gray-600`}>{activity.category}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            <ScrollView style={tw`flex-1 p-4`}>
                <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>กำหนดการประจำวัน</Text>
                {activities.map((activity, index) => (
                    <View key={activity.id} style={tw`mb-4`}>
                        <Drawer
                            rightItems={[{
                                text: 'ลบ',
                                background: Colors.red30,
                                onPress: () => handleDeleteActivity(activity.id),
                                icon: Assets.icons.delete,
                            }]}
                        >
                            {renderActivityItem(activity)}
                        </Drawer>
                        {index < activities.length - 1 && (
                            <View style={tw`h-8 w-0.5 bg-gray-300 absolute left-10 top-[100%]`} />
                        )}
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={tw`absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg`}
                onPress={() => setIsAddDialogVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <Dialog
                visible={isAddDialogVisible}
                onDismiss={() => setIsAddDialogVisible(false)}
                // panDirection={null}
            >
                <View style={tw`bg-white p-4 rounded-lg`}>
                    <Text style={tw`text-xl font-bold mb-4`}>เพิ่มกิจกรรมใหม่</Text>
                    <TextField
                        placeholder="ชื่อกิจกรรม"
                        onChangeText={(text) => setNewActivity({ ...newActivity, name: text })}
                        style={tw`mb-2`}
                    />
                    <TextField
                        placeholder="เวลาเริ่ม (HH:MM)"
                        onChangeText={(text) => setNewActivity({ ...newActivity, startTime: text })}
                        style={tw`mb-2`}
                    />
                    <TextField
                        placeholder="เวลาสิ้นสุด (HH:MM)"
                        onChangeText={(text) => setNewActivity({ ...newActivity, endTime: text })}
                        style={tw`mb-2`}
                    />
                    <TextField
                        placeholder="หมวดหมู่"
                        onChangeText={(text) => setNewActivity({ ...newActivity, category: text })}
                        style={tw`mb-4`}
                    />
                    <Button label="เพิ่มกิจกรรม" onPress={handleAddActivity} />
                </View>
            </Dialog>
        </View>
    );
};

export default ProgramManagementScreen;