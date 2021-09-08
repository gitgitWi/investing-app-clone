import { Module } from 'vuex';
import { RootState } from '../types';
import { IBookmarks } from '../../../domain/bookmarks';
import { getBookmarks } from '@/services/user';

interface UserState {}

const UserStore = {
  namespaced: true,

  state: {},
  getters: {},
  mutations: {},

  actions: {
    /**
     * getBookmarksAction
     * Vuex 에 따로 저장 안하고 사용자 페이지 접근시 마다 요청
     * - 사용자 활동에 따라 좋아요, 북마크 계속 변동할 수 있음
     * @returns 전체 북마크 데이터 {}
     */
    getBookmarksAction: async (): Promise<IBookmarks | void> => {
      try {
        const data = await getBookmarks();
        return data;
      } catch (e) {
        return console.error(e);
      }
    },
  },
} as Module<UserState, RootState>;

export default UserStore;
