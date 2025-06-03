import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export async function httpRequest<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await axios({
    url,
    method: config?.method || 'POST',
    data,
    ...config,
  });
  return response.data;
}