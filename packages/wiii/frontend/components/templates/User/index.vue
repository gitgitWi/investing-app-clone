<template>
  <main>
    <h1>{{ getEmail }}님 화성 갈끄니까~~🚀🚀🚀</h1>

    <LikesList v-bind="{ loading, title: '#관심종목' }"> </LikesList>
    <LikesList v-bind="{ loading, title: '#좋아한_댓글' }">
      <ReplyCard
        v-for="({ updatedAt, ...rest }, idx) in replyLikes"
        :key="idx"
        v-bind="{ updatedAt: new Date(updatedAt), ...rest }"
      />
    </LikesList>
    <LikesList v-bind="{ loading, title: '#북마크한_뉴스' }" @click.native="setModalOpen">
      <NewsCard
        v-for="({ updatedAt, ...rest }, idx) in newsBookmarks"
        :key="idx"
        v-bind="{ updatedAt: new Date(updatedAt), idx, ...rest }"
      />
    </LikesList>
    <Modal v-show="isModalOpen" @set-modal-handler="setModalOpen" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, createNamespacedHelpers } from 'vuex';
import { StoreNames } from '@/store';
import Words from '@/components/atoms/Words.vue';
import NewsCard from '@/components/molecules/News.Company.Card.vue';
import ReplyCard from '@/components/molecules/Reply.List.Card.vue';
import LikesList from '@/components/molecules/User.Likes.List.vue';
import Modal from '@/components/molecules/News.Modal.vue';

const { mapActions: UserActions } = createNamespacedHelpers(StoreNames.User);
const { mapActions: NewsActions } = createNamespacedHelpers(StoreNames.News);

export default Vue.extend({
  name: 'UserIndex',

  components: { Words, NewsCard, ReplyCard, LikesList, Modal },

  data() {
    return {
      replyLikes: [],
      newsBookmarks: [],
      tickerBookmarks: [],
      loading: true,
      isModalOpen: false,
    };
  },

  computed: {
    ...mapGetters(['getEmail']),
  },

  methods: {
    ...UserActions(['getBookmarksAction']),
    ...NewsActions(['setModalNewsAction']),

    /** @todo util 함수로 분리 */
    resetModal() {
      this.isModalOpen = false;
      this.setModalNewsAction({});
      history.pushState({ data: '' }, '', './');
    },

    setModalOpen(e) {
      const id = e?.target?.closest('article[data-id]');
      if (!e || !id) return this.resetModal();

      this.isModalOpen = true;
      const newsData = this.newsBookmarks[id.getAttribute('data-id')];
      this.setModalNewsAction(newsData);
      history.pushState({ data: newsData.id }, newsData.headline, `./${newsData.id}`);
    },
  },

  async mounted() {
    const { reply, news, ticker } = await this.getBookmarksAction();
    this.replyLikes = reply;
    this.newsBookmarks = news;
    this.tickerBookmarks = ticker;
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped></style>
