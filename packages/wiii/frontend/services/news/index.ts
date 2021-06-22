import { AxiosStatic } from 'axios';
import { marketEnum, NewsData } from '../../../domain/newsData';

declare const Axios: AxiosStatic;

const newsUrl = `/api/news`;

/**
 * 뉴스 리스트 API 요청
 * /api/news/market/{general} -> News.controller
 * @param category marketEnum, general || crypto
 * @returns data array;
 * @see wiii/backend/service/news/dummy_market_general
 */
export const getMarketNews = async (category: marketEnum = marketEnum.general) => {
  const { data, status, statusText } = await Axios.get(`${newsUrl}/market/${category}`);
  if (status >= 400) throw Error(statusText);
  return data;
};

export const getCompanyNews = async (symbol, dateFrom?: string, dateTo?: string) => {
  const { data, status, statusText } = await Axios.get(`${newsUrl}/company/${symbol}`, { params: { dateFrom, dateTo } });
  if (status >= 400) throw Error(statusText);
  return data;
};

export const setBookmarkNews = (props: NewsData) => Axios.post(`${newsUrl}/`, props);

export const toggleNewsLikes = (id: number, update: number) => Axios.post(`/api/user/likes/news`, { id, update });
