import axios from 'axios';

export const logoutUserApi = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  return axios.post('/logout', {}, {
    headers: {
      Authorization: token,
    },
  });
};
