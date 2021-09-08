<template>
  <div class="area">
    <Header :titleText="titleText" />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Header from '@/components/organisms/Header.vue';
import Footer from '@/components/organisms/Footer.vue';
import { viewsTitle } from '@/type/views';

export default Vue.extend({
  name: 'UserView',

  data() {
    return {
      titleText: viewsTitle.User,
    };
  },

  components: { Header, Footer },

  mounted() {},

  computed: {},

  methods: {},
});
</script>
