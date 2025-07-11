import axios from "axios";

export const getAllAlbum = async () => {
    const albums = await axios.get('http://13.215.205.59:8000/api/albums/');
    return albums.data;
}
export const postAlbum = async (album: any) => {
    const response = await axios.post('http://13.215.205.59:8000/api/albums/', album);
    return response.data;
  };

export const putAlbum = async (id: number | string, album: any) => {
  const response = await axios.put(`http://13.215.205.59:8000/api/albums/${id}/`, album);
  return response.data;
};
export const deleteAlbum = async (id: number | string) => {
  return await axios.delete(`http://13.215.205.59:8000/api/albums/${id}/`);
};

