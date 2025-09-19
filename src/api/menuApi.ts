import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/menu'; // Replace with your backend URL

export const getAllMenuItems = async () => {
    const response = await axios.get(`${API_BASE_URL}/getAll`);
    console.log('API Response:', response.data); // Log the response
    return response.data;
};

export const getMenuItemsByCategory = async (category: string) => {
    const response = await axios.get(`${API_BASE_URL}/category/${category}`);
    return response.data;
};

export const addMenuItem = async (menuItem: any) => {
    const response = await axios.post(`${API_BASE_URL}/add`, menuItem);
    return response.data;
};

export const updateMenuItem = async (id: number, menuItem: any) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, menuItem);
    return response.data;
};

export const deleteMenuItem = async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
    return response.data;
};