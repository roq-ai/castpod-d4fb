import axios from 'axios';
import queryString from 'query-string';
import { PlaylistInterface, PlaylistGetQueryInterface } from 'interfaces/playlist';
import { GetQueryInterface } from '../../interfaces';

export const getPlaylists = async (query?: PlaylistGetQueryInterface) => {
  const response = await axios.get(`/api/playlists${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlaylist = async (playlist: PlaylistInterface) => {
  const response = await axios.post('/api/playlists', playlist);
  return response.data;
};

export const updatePlaylistById = async (id: string, playlist: PlaylistInterface) => {
  const response = await axios.put(`/api/playlists/${id}`, playlist);
  return response.data;
};

export const getPlaylistById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/playlists/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlaylistById = async (id: string) => {
  const response = await axios.delete(`/api/playlists/${id}`);
  return response.data;
};
