import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { environment } from '../environments/environment';

export function Auth() {
  const { getAccessTokenSilently } = useAuth0()
  axios.interceptors.request.use(function (config) {
    config.baseURL = environment.apiBaseUrl;
    (async () => {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    })()
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  return (<> </>)

}
