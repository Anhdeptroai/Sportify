import axios from "axios";

export const getAllAlbum = async () => {
    const albums = await axios.get('http://18.142.50.220:8000/api/albums/');
    return albums.data;
}
export const postAlbum = async (album: any) => {
    const response = await axios.post('http://18.142.50.220:8000/api/albums/', album);
    return response.data;
  };