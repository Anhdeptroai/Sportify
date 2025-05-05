import axios from 'axios';

export const getAllUsers = async () => {
    const response = await fetch('http://18.142.50.220:8000/api/users/');
    return response.json();
}

export const postUser = async (user: any) => {
    const response = await axios.post('http://18.142.50.220:8000/api/users/', user);
  return response.data;
}