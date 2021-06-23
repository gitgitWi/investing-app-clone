import { AxiosStatic } from 'axios';

declare const Axios: AxiosStatic;

export const getAllCoins = async () => {
  const { data, status, statusText } = await Axios.get(`/api/markets/coins`);
  if (status >= 400) throw Error(statusText);
  return data;
};
