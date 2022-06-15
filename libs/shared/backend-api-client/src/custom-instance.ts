/* eslint-disable @typescript-eslint/ban-ts-comment */
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '' });

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
    baseURL: process.env['NX_BE_URL'] ?? 'http://localhost:3333',
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export default customInstance;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorType<Error> extends AxiosError<Error> {}
