import axios from 'axios';
import queryString from 'query-string';
import { SnippetInterface, SnippetGetQueryInterface } from 'interfaces/snippet';
import { GetQueryInterface } from '../../interfaces';

export const getSnippets = async (query?: SnippetGetQueryInterface) => {
  const response = await axios.get(`/api/snippets${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSnippet = async (snippet: SnippetInterface) => {
  const response = await axios.post('/api/snippets', snippet);
  return response.data;
};

export const updateSnippetById = async (id: string, snippet: SnippetInterface) => {
  const response = await axios.put(`/api/snippets/${id}`, snippet);
  return response.data;
};

export const getSnippetById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/snippets/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSnippetById = async (id: string) => {
  const response = await axios.delete(`/api/snippets/${id}`);
  return response.data;
};
