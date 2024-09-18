import axios from 'axios';

const API_KEY = '33c1112cf2d049ec9486661e35a52f1d';
const BASE_URL = 'https://newsapi.org/v2/';

export const fetchArticles = async (query: string = '', page: number = 1, pageSize: number = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}everything`, {
      params: {
        q: query || 'news', 
        apiKey: API_KEY,
        pageSize: pageSize, 
        page: page,
        language: 'en',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return null;
  }
};