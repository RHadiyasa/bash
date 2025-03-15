import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
const BASE_URL = 'https://bash-phi.vercel.app/api';

export const getAllTransactions = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(BASE_URL + '/users/transaction/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.transactions;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};
