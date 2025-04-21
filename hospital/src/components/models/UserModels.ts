export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    floor: Floor;
    floorId?: number;
}

export interface Floor {
    id: number;
    identifier: string;
    bednumber: number;
    occupied?: number;
}

export interface Patient {
    id: number;
    fullName: string;
    bed: Bed;
}

export interface Bed {
    id: number;
    identifier: string;
    floor: Floor;
    user?: User;
    patient?: Patient;
    occupied: boolean;
}


export interface ApiResponse {
    data: User[];
}
