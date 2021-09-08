import { Module } from 'vuex';
import { AxiosStatic } from 'axios';
import { RootState } from '@/store';

import { getMarketNews, getCompanyNews, toggleNewsLikes, setBookmarkNews } from '@/services/news';
import { marketEnum, NewsData } from '../../../domain/newsData';

declare const Axios: AxiosStatic;

interface CachingMarketNews {
  [category: string]: any[];
}

interface NewsState {
  cachedMarketNews: CachingMarketNews;
  currentModalNews: NewsData;
}

const News = {
  namespaced: true,
  state: {
    cachedMarketNews: {
      [marketEnum.general]: [],
      [marketEnum.crypto]: [],
    },
    currentModalNews: undefined,
  },

  getters: {},

  mutations: {
    cacheMarketNews: (state, { category, data }) => {
      state.cachedMarketNews[category] = data;
    },
    setModalNews: (state, payload: NewsData) => {
      state.currentModalNews = payload;
    },
  },

  actions: {
    getMarketNewsAction: async ({ commit }, category: marketEnum) => {
      if (!category) return;
      try {
        const results = await getMarketNews(category);
        commit('cacheMarketNews', { category, data: results });
        if (!results) return [];
        return results;
      } catch (e) {
        return console.error(e);
      }
    },

    getCompanyNewsAction: async (_, { symbol, from, to }) => {
      if (!symbol) return;
      try {
        const results = await getCompanyNews(symbol, from, to);
        if (!results) return [];
        return results;
      } catch (e) {
        return console.error(e);
      }
    },

    setModalNewsAction({ commit }, payload: NewsData) {
      commit('setModalNews', payload);
    },

    /** 북마크 */
    toggleBookmarkAction: async ({ state }, { id, likes, update }) => {
      if (!id) return false;
      try {
        if (likes === 0 && update === 1) await setBookmarkNews(state.currentModalNews);
        toggleNewsLikes(id, update);
      } catch (e) {
        return console.error(e);
      }
    },
  } /** actions */,
} as Module<NewsState, RootState>;

export default News;
