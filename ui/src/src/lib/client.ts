import {MutationCache, QueryCache, QueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {getToken} from './auth';
import {toast} from 'react-toastify';
import {errorToString} from './utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      toast.error(errorToString(error));
    },
  }),
  mutationCache: new MutationCache({
    onError(error) {
      toast.error(errorToString(error));
    },
  }),
});

const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const BACKEND_HOST = new URL(
  import.meta.env.VITE_BACKEND_HOST || 'http://localhost:8080',
);

export const stayeaseAxios = axios.create({
  baseURL: `${BACKEND_HOST.origin}/api/${API_VERSION}`,
});

stayeaseAxios.interceptors.request.use((config) => {
  const bearer = getToken();

  if (bearer) {
    config.headers.Authorization = `Bearer ${bearer}`;
  }

  return config;
});
