import axios from 'axios';
import queryString from 'query-string';
import { IndividualInterface, IndividualGetQueryInterface } from 'interfaces/individual';
import { GetQueryInterface } from '../../interfaces';

export const getIndividuals = async (query?: IndividualGetQueryInterface) => {
  const response = await axios.get(`/api/individuals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIndividual = async (individual: IndividualInterface) => {
  const response = await axios.post('/api/individuals', individual);
  return response.data;
};

export const updateIndividualById = async (id: string, individual: IndividualInterface) => {
  const response = await axios.put(`/api/individuals/${id}`, individual);
  return response.data;
};

export const getIndividualById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/individuals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteIndividualById = async (id: string) => {
  const response = await axios.delete(`/api/individuals/${id}`);
  return response.data;
};
