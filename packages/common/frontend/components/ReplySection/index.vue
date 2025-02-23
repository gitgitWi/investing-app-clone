<template>
  <section class="section">
    <ReplySort :sortText="sortText" @change-sort="changeSort" />
    <ReplyInput v-bind="{ docId, email }" @after-submit="afterSubmit" />
    <Card v-for="(repl, idx) in repls" :key="idx" v-bind="{ ...repl, email }" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import ReplyInput from './molecules/ReplyNewInput.vue';
import ReplySort from './molecules/ReplySort.vue';
import Card from './molecules/ReplyCard.vue';

export default Vue.extend({
  name: 'ReplySection',

  components: { ReplyInput, ReplySort, Card },

  props: {
    /** 종목 ticker 또는 뉴스 문서 ID 입력 */
    docId: {
      type: String,
      required: true,
    },
    /** 사용자 email; 로그인 된 사용자만 댓글 달기 가능 */
    email: {
      type: String,
      default: undefined,
    },
  },

  data() {
    const sortTexts = ['최신순', '좋아요순'];
    return {
      repls: [],
      sortIdx: 0,
      sortText: sortTexts[0],
      sortTexts,
      curInputId: 'none',
    };
  },

  async mounted() {
    this.repls = await this.getReplsByDocID(this.docId);
  },

  methods: {
    ...mapActions('reply', ['getReplsByDocID']),

    changeSort() {
      this.sortIdx = (this.sortIdx + 1) % 2;
      this.sortText = this.sortTexts[this.sortIdx];
      this.repls = this.repls.sort((a, b) => (this.sortIdx === 0 ? b.date - a.date : b.likes - a.likes));
    },

    async afterSubmit() {
      this.repls = await this.getReplsByDocID(this.docId);
    },
  },
});
</script>

<style lang="scss">
.reset {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 100%;
  transition: all 0.15s ease-out;
}

.center {
  display: grid;
  place-items: center;
}

.boundary {
  @extend .reset;
  @extend .center;

  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;

  background-color: rgba(245, 245, 245, 1);
  color: rgba(97, 97, 97, 1);
}

.section {
  @extend .boundary;

  background-color: transparent;
  padding: 10px 0 10px 0;
}

.card {
  @extend .boundary;

  cursor: pointer;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
