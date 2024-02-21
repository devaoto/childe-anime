import axios from 'axios';

export const sendRequest = async (
  url: string,
  options?: any,
  timeout = 10000
) => {
  try {
    const response = await axios({
      url,
      ...options,
      timeout,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error('Request timed out:', error);
    } else {
      console.error('Error with Axios request:', error);
    }
    throw error;
  }
};
