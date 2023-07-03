import axios from 'axios';
import queryString from 'query-string';
import { PodcastInterface, PodcastGetQueryInterface } from 'interfaces/podcast';
import { GetQueryInterface } from '../../interfaces';

export const getPodcasts = async (query?: PodcastGetQueryInterface) => {
  const response = await axios.get(`/api/podcasts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPodcast = async (podcast: PodcastInterface) => {
  const response = await axios.post('/api/podcasts', podcast);
  return response.data;
};

export const updatePodcastById = async (id: string, podcast: PodcastInterface) => {
  const response = await axios.put(`/api/podcasts/${id}`, podcast);
  return response.data;
};

export const getPodcastById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/podcasts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePodcastById = async (id: string) => {
  const response = await axios.delete(`/api/podcasts/${id}`);
  return response.data;
};
