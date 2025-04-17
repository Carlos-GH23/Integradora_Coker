export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    floor: string;
}

export interface Floor {
    id: number;
    identifier: string;
}

export interface Patient {
    id: number;
    fullName: string;
}

export interface Bed {
    id: number;
    identifier: string;
    floor: Floor;
    user: User;
    patient: Patient;
}


export interface ApiResponse {
    data: User[];
}
