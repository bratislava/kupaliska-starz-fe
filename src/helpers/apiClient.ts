import axios from "axios";
import qs from "qs";

import { environment } from "../environment";

export const apiClient = axios.create({
  responseType: "json",
  baseURL: environment.host,
  withCredentials: true,
  paramsSerializer: (params: any) => {
    return qs.stringify(params);
  },
  timeout: 100000,
});

apiClient.interceptors.request.use((config) => {
  config.headers.common["Cache-Control"] = "no-cache";

  return config;
});
