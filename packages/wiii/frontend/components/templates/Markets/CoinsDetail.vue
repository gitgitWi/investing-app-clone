<template>
  <main class="area">
    <Chart class="card" v-bind="{ typeName, ticker }" :smaConfigs="[{}]" />
    <ReplySection />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import Chart from '@/components/molecules/Chart.vue';
import ReplySection from '@/components/organisms/ReplySection.vue';

export default Vue.extend({
  components: {
    Chart,
    ReplySection,
  },

  props: {
    /** router로 전달받음 */
    ticker: {
      type: String,
    },
  },

  data() {
    return {
      typeName: 'coin',
    };
  },

  computed: {
    ...mapState(['ticker']),
  },
});
</script>

<style lang="scss" scoped>
main.area {
  display: grid;
  place-content: center;
}
</style>
