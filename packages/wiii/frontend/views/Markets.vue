<template>
  <div class="area">
    <Header :titleText="titleText" />
    <main class="area">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { viewsTitle } from '@/type/views';
import Header from '@/components/organisms/Header.vue';
import Footer from '@/components/organisms/Footer.vue';

export default Vue.extend({
  name: 'MarketsView',

  components: { Header, Footer },

  data() {
    return {
      titleText: viewsTitle.Markets,
    };
  },
});
</script>
