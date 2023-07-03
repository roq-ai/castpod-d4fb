import axios from 'axios';
import queryString from 'query-string';
import { EpisodeInterface, EpisodeGetQueryInterface } from 'interfaces/episode';
import { GetQueryInterface } from '../../interfaces';

export const getEpisodes = async (query?: EpisodeGetQueryInterface) => {
  const response = await axios.get(`/api/episodes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEpisode = async (episode: EpisodeInterface) => {
  const response = await axios.post('/api/episodes', episode);
  return response.data;
};

export const updateEpisodeById = async (id: string, episode: EpisodeInterface) => {
  const response = await axios.put(`/api/episodes/${id}`, episode);
  return response.data;
};

export const getEpisodeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/episodes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEpisodeById = async (id: string) => {
  const response = await axios.delete(`/api/episodes/${id}`);
  return response.data;
};
