import React from 'react'
import MapTracking from '@/components/MapTracking'

const Map = () => {
    const destination = {
        latitude: 15.711767694895597,
        longitude: 100.13006711822914,
        keyword: "วิทยาลัยอาชีวะนครสวรรค์"
    };
    return (
        <MapTracking
            destination={destination}
        />
    )
}

export default Map