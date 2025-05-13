import axios from 'axios';

export const getAllParticipant = async () => {
  const participants = await axios.get('http://13.215.205.59:8000/api/participants/');
  return participants.data;
};

export const postParticipant = async (participant: any) => {
  const response = await axios.post('http://13.215.205.59:8000/api/participants/', participant);
  return response.data;
};

export const putParticipant = async (id: number | string, participant: any) => {
  const response = await axios.put(`http://13.215.205.59:8000/api/participants/${id}/`, participant);
  return response.data;
};
export const deleteParticipant = async (id: number ) => {
  return await axios.delete(`http://13.215.205.59:8000/api/participants/${id}/`);
};

