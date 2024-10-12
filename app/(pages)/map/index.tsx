import React from 'react'
import MapTracking from '@/components/MapTracking'
import { useLocalSearchParams } from 'expo-router';
import { handleAxiosError } from '@/helper/my-lib';

const Map = () => {
    const { bookingDetail } = useLocalSearchParams();
    const booking_detail = JSON.parse(bookingDetail as string);

    // handleAxiosError(error || "ไม่สามารถโหลดข้อมูลการจองของคุณได้ กรุณาลองใหม่อีกครั้ง", (message) => {
    //     handleErrorMessage(message);
    // });
    const destination = {
        latitude: 15.711767694895597,
        longitude: 100.13006711822914,
        keyword: "บ้านแม่กำปอง"
    };
    return (
        <MapTracking
            destination={destination}
        />
    )
}

export default Map