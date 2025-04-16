import axios from "axios";
import { User } from "../models/UserModels";


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

}

