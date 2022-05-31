import axios, { AxiosError, AxiosResponse } from 'axios';
import { Utils } from '../application/utils';
import DashboardEvent from '../components/dashboard/dashboardEvent';


const api = axios.create({ baseURL: process.env.BASE_URL });
const UNAUTHORIZED = 401;

api.interceptors.request.use(config => {
  const token = Utils.obterToken()

  if (!token && config.withCredentials !== false) {
    DashboardEvent.logout.notify();
  }
  if (config.withCredentials !== false) {
    config.headers['Authorization'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error)
});

api.interceptors.response.use((response: AxiosResponse) => {
  return response
}, (error: AxiosError) => {

  if (error.response === undefined || UNAUTHORIZED === error.response.status) {
    DashboardEvent.logout.notify();
    return;
  }

  return Promise.reject(error)
})

export { api };