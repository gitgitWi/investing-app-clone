import { AxiosStatic } from 'axios';
import { apiEndpoints } from '@/config';
import { ArticleDoc } from 'common/backend/model/ArticleModel';

declare const Axios: AxiosStatic;

interface Query {
  offset?: number;
  limit?: number;
  tickers?: string | string[];
}

export const getArticle = async (id: string) => {
  const { data } = await Axios.get<ArticleDoc>(`${apiEndpoints.getArticle}/${id}`);
  return data;
};

export const getNewNews = async ({ offset = 0, limit = 5, tickers }: Query = {}) => {
  const { data } = await Axios.get<ArticleDoc[]>(apiEndpoints.getNewNews, {
    params: { offset, limit, tickers },
  });
  return data;
};

export const getNewOpinions = async ({ offset = 0, limit = 5, tickers }: Query = {}) => {
  const { data } = await Axios.get<ArticleDoc[]>(apiEndpoints.getNewOpinions, {
    params: { offset, limit, tickers },
  });
  return data;
};

export const getPopularNews = async ({ offset = 0, limit = 5, tickers }: Query = {}) => {
  const { data } = await Axios.get<ArticleDoc[]>(apiEndpoints.getPopularNews, {
    params: { offset, limit, tickers },
  });
  return data;
};

export const getPopularOpinions = async ({ offset = 0, limit = 5, tickers }: Query = {}) => {
  const { data } = await Axios.get<ArticleDoc[]>(apiEndpoints.getPopularOpinions, {
    params: { offset, limit, tickers },
  });
  return data;
};
