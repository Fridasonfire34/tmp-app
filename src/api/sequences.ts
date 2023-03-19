import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getSequences = async (packing: number) => {
  try {
    const store = await AsyncStorage.getItem('@user');
    const user = JSON.parse(store as any).stack;
    const response = await axios.get(`${API_BASE_URL}/mobile/sequences/list`, {
      headers: {
        'Content-Type': 'application/json',
        id: user.id,
      },
      params: {
        packing,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const postRemoveSequence = async (id: string) => {
  try {
    const store = await AsyncStorage.getItem('@user');
    const user = JSON.parse(store as any).stack;
    const response = await axios.post(
      `${API_BASE_URL}/mobile/sequences/remove`,
      {
        packingId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          id: user.id,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const postCreateReport = async (id: string) => {
  try {
    const store = await AsyncStorage.getItem('@user');
    const user = JSON.parse(store as any).stack;
    const response = await axios.post(
      `${API_BASE_URL}/mobile/sequences/report`,
      {
        packingId: Number(id),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          id: user.id,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {getSequences, postRemoveSequence, postCreateReport};
