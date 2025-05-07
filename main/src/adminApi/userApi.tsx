import axios from 'axios';

export const getAllUsers = async () => {
    const response = await fetch('http://13.215.205.59:8000/api/users/');
    return response.json();
}

export const postUser = async (user: any) => {
    const response = await axios.post('http://13.215.205.59:8000/api/users/', user);
  return response.data;
}

export const putUser = async (id: number, user: any) => {
  const response = await axios.put(`http://13.215.205.59:8000/api/users/${id}/`, user);
  return response.data;
};