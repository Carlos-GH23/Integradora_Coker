export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
}

export interface ApiResponse {
    data: User[];
}
