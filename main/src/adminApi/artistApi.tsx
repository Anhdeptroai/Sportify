import axios from 'axios';

export const getAllArtists = async () => {
  const res = await axios.get('http://18.142.50.220:8000/api/artists/'); // sửa URL tùy backend
  return res.data;
};

export const postArtist = async (artist: any) => {
  const response = await axios.post('http://18.142.50.220:8000/api/artists/', artist);
  return response.data;
};

export const putArtist = async (id: number | string, artist: any) => {
  const response = await axios.put(`http://18.142.50.220:8000/api/artists/${id}/`, artist);
  return response.data;
};
