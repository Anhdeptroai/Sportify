import axios from "axios";

export const getAllSong = async () => {
    const songs = await axios.get('http://13.215.205.59:8000/api/songs/');
    return songs.data;
}
export const postSong = async (song: any) => {
    const response = await axios.post('http://13.215.205.59:8000/api/songs/', song);
    return response.data;
  };
export const putSong = async (id: number | string, song: any) => {
  const response = await axios.put(`http://13.215.205.59:8000/api/songs/${id}/`, song);
  return response.data;
};