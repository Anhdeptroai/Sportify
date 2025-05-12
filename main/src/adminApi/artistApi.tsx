import axios from 'axios';

export const getAllArtists = async () => {
  const res = await axios.get('http://13.215.205.59:8000/api/artists/');
  return res.data;
};

export const postArtist = async (artist: any) => {
  const response = await axios.post('http://13.215.205.59:8000/api/artists/', artist);
  return response.data;
};

export const putArtist = async (id: number | string, artist: any) => {
  const response = await axios.put(`http://13.215.205.59:8000/api/artists/${id}/`, artist);
  return response.data;
};

export const deleteArtist = async (id: number) => {
  return await axios.delete(`http://13.215.205.59:8000/api/artists/${id}/`);
};