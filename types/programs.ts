export interface parsedItinerary {
    start: {
        time: string;
        activity: string;
    }
    activities: [
        {
            time: string;
            activityId: number;
        }
    ]
    end: {
        time: string;
        activity: string;
    }
}

export interface Locations {
    id: number;
    name: string;
    type: number;
    description: string;
    address: string;
    subdistrict_id: number;
    website: string;
    latitude: string;
    longitude: string;
    owner_id: number;
}
export interface activities {
    id: number;
    name: string;
    description: string;
    duration: number;
    cost: string;
    locationId: number;
    Locations: Locations
}

export interface Program {
    id: number;
    name: string;
    description: string;
    total_price: number;
    schedules: string
    program_images: {
        id: number;
        program_id: number
        image_name_data: string;
        created_at: string;
        updated_at: string;
    }[]
}

export interface ProgramType {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string | null;
    programs: Program[];
}


export interface program_images {
    id: number;
    created_at: Date;
    updated_at: Date | null;
    program_id: number;
    image_name_data: string;
}


export interface ProgramDetail {
    id: number;
    name: string;
    description: string;
    type: string;
    start: { time: string; note: string };
    activities: { time: string; title: string; description: string; location: string; cost: number }[];
    end: { time: string; note: string };
    total_price: number;
    wellness_dimensions: string;
    program_images: { id: number; program_id: number; image_name_data: string; created_at: string };
}