<template>
  <section class="section" :class="{ loading: isLoading }">
    <ReplySort @change-sort="changeSort" :sortText="sortText" />
    <ReplyInput v-bind="{ curInputId }" @change-current-input="changeCurInput" @after-submit="afterSubmit" />
    <Card
      v-for="{ replId, ...repl } in repls"
      :key="replId"
      v-bind="{ ...repl, replId, curInputId }"
      @change-current-input="changeCurInput"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, createNamespacedHelpers } from 'vuex';
import ReplyInput from '@/components/molecules/ReplyNewInput.vue';
import ReplySort from '@/components/molecules/ReplySort.vue';
import Card from '@/components/molecules/Reply.List.Card.vue';
import { StoreNames } from '@/store';

const { mapActions } = createNamespacedHelpers(StoreNames.Reply);

export default Vue.extend({
  name: 'ReplySection',

  components: { ReplyInput, ReplySort, Card },

  data() {
    const sortTexts = ['최신순', '좋아요순'];
    return {
      repls: [],
      isLoading: true,
      sortIdx: 0,
      sortText: sortTexts[0],
      sortTexts,
      curInputId: 'none',
    };
  },

  computed: {
    ...mapState(['ticker']),
  },

  watch: {
    async ticker() {
      this.isLoading = true;
      this.repls = await this.getReplsByDocID(this.ticker);
      this.isLoading = false;
    },
  },

  async mounted() {
    this.repls = await this.getReplsByDocID(this.ticker);
    this.isLoading = false;
  },

  methods: {
    ...mapActions(['getRandomRepls', 'getReplsByDocID']),

    changeSort() {
      this.sortIdx = (this.sortIdx + 1) % 2;
      this.sortText = this.sortTexts[this.sortIdx];
      this.repls = this.repls.sort((a, b) => (this.sortIdx === 0 ? b.updatedAt - a.updatedAt : b.likes - a.likes));
    },

    changeCurInput(idx: string) {
      this.curInputId = idx;
    },

    async afterSubmit() {
      this.repls = await this.getReplsByDocID(this.ticker);
    },
  },
});
</script>

<style lang="scss" scoped>
section.section {
  padding: 5px;
}
</style>
