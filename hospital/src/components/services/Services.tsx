import axios from "axios";
import { Bed, Floor, Patient, User } from "../models/UserModels";

const API_B = "http://localhost:8080/api/beds"
const API = "http://localhost:8080/api/floors"
const API_URL = "http://localhost:8080/api/users/" 
const API_P = "http://localhost:8080/api/patients"
const API_A = "http://localhost:8080/api/bitacora"

export class AdminServices<T> {

    private token: string | null;

    constructor() {
        this.token = localStorage.getItem("token");
    }

    //ENFERMERAS
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
            return axios.post(`${API_URL}create/NURSE`,data, this.getHeaders()).then(res => res.data.data);
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

    async floorNurse(data: any): Promise<T> {
        try {
            return axios.post(`${API_URL}assign-floor`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    //SECRETARIAS
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
            return axios.post(`${API_URL}create/SECRETARY`,data, this.getHeaders()).then(res => res.data.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async deleteSecretary(id: number): Promise<void> {
        try {
            return axios.delete(`${API_URL}${id}`, this.getHeaders()).then(res => res.data);
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

    async floorSecretary(data: any): Promise<T> {
        try {
            return axios.post(`${API_URL}assign-floor`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async unassignFloorSecretary(id: number): Promise<T> {
        try {
            return axios.delete(`${API_URL}unassign-floor/${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    //PISOS
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
            return axios.delete(`${API}/delete/${id}`, this.getHeaders()).then(res => res.data);
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

    //CAMAS
    async getAllBeds(): Promise<{data: Bed[]}> {
        try {
            return axios.get<{ data: Bed[] }>(`${API_B}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async createBed(data: T): Promise<T> {
        try {
            return axios.post(`${API_B}/create`,data, this.getHeaders()).then(res => res.data);
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

    async deleteBed(id: number): Promise<void> {
        try {
            return axios.delete(`${API_B}/delete/${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    //PACIENTES
    async getAllPatients(): Promise<{data: Patient[]}> {
        try {
            return axios.get<{ data: Patient[] }>(`${API_P}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async createPatient(data: T): Promise<T> {
        try {
            return axios.post(`${API_P}/create`,data, this.getHeaders()).then(res => res.data.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async updatePatient(id: number, data: Partial<T>): Promise<T> {
        try {
            return axios.put(`${API_P}/edit/${id}`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async deletePatient(id: number): Promise<void> {
        try {
            return axios.delete(`${API_P}/delete/${id}`, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async assignBedPatient(data: any): Promise<T> {
        try {
            return axios.put(`${API_P}/assign-bed`,data, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    async unassignBedPatient(id: number): Promise<T> {
        try {
            return axios.put(`${API_P}/unassign-bed/${id}`, null, this.getHeaders()).then(res => res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }

    //Bitacora
    async getBitacora() {
        try {
            const response = await axios.get(`${API_A}`, this.getHeaders());
            return response;
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            throw error;
        }
    }
}

