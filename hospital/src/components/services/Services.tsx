import axios from "axios";
import { Bed, Floor, User } from "../models/UserModels";

const API_B = "http://localhost:8080/api/beds"
const API = "http://localhost:8080/api/floors"
const API_URL = "http://localhost:8080/api/users/" 

export class AdminServices<T> {

    private token: string | null;

    constructor() {
        this.token = localStorage.getItem("token");
    }

    private getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        };
    }

    async getAllNurses(): Promise<{data: User[]}> {
        try {
            return axios.get<{ data: User[] }>(`${API_URL}Enfermeras`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async createNurse(data: T): Promise<T> {
        try {
            return axios.post(`${API_URL}create/NURSE`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async deleteNurse(id: number): Promise<void> {
        try {
            return axios.delete(`${API_URL}${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }
    async updateNurse(id: number, data: Partial<T>): Promise<T> {
        try {
            return axios.put<T>(`${API_URL}${id}`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }
    

    async getAllSecretary(): Promise<{data: User[]}> {
        try {
            return axios.get<{ data: User[] }>(`${API_URL}Secretarias`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async createSecretary(data: T): Promise<T> {
        try {
            return axios.post(`${API_URL}create/SECRETARY`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async deleteSecretary(id: number): Promise<void> {
        try {
            return axios.post(`${API_URL}${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async updateSecretary(id: number, data: Partial<T>): Promise<T> {
        try {
            return axios.put(`${API_URL}${id}`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async getAllFloor(): Promise<{data: Floor[]}> {
        try {
            return axios.get<{ data: Floor[] }>(`${API}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async createFloor(data: T): Promise<T> {
        try {
            return axios.post(`${API}/create`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async deleteFloor(id: number): Promise<void> {
        try {
            return axios.post(`${API}/delete${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async updateFloor(id: number, data: Partial<T>): Promise<T> {
        try {
            return axios.put(`${API}/edit/${id}`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async getAllBeds(): Promise<{data: Bed[]}> {
        try {
            return axios.get<{ data: Bed[] }>(`${API_B}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async updateBeds(id: number, data: Partial<T>): Promise<T> {
        try {
            return axios.put(`${API_B}/edit/${id}`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

}

