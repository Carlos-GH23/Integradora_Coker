export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    floor:string;
}

export interface Floor {
    id: number;
    identifier: string;
  }
  

export interface ApiResponse {
    data: User[];
}
