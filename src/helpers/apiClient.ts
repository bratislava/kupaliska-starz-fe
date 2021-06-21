import axios from "axios";
import qs from "qs";

import { environment } from "environments/environment";

export const apiClient = axios.create({
  responseType: "json",
  baseURL: environment.baseUrl,
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
