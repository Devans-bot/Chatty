import React from 'react'
import axios from 'axios'
import { getDeviceId } from '../utils/getdeviceid';

export const axiosinstance=axios.create({
    baseURL:"/api",
    withCredentials:true,
})
axiosinstance.interceptors.request.use((config) => {
  config.headers["x-device-id"] = getDeviceId();
  return config;
});

