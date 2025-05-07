import axios from 'axios';

export const getAllParticipant = async () => {
  const participants = await axios.get('http://18.142.50.220:8000/api/participants/'); // sửa URL tùy backend
  return participants.data;
};

export const postParticipant = async (participant: any) => {
  const response = await axios.post('http://18.142.50.220:8000/api/participants/', participant);
  return response.data;
};

export const putParticipant = async (id: number | string, participant: any) => {
  const response = await axios.put(`http://18.142.50.220:8000/api/participants/${id}/`, participant);
  return response.data;
};
