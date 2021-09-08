<template>
  <section class="user-likes-list" :class="{ loading }">
    <Words class=" user-likes-list-title noselect subtitle">{{ title }}</Words>
    <slot />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Words from '@/components/atoms/Words.vue';

export default Vue.extend({
  name: 'UserLikesList',

  components: { Words },

  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.user-likes-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &-title {
    width: 80%;
    margin: 15px 0;
    text-align: left;
  }

  .card {
    width: 80%;
  }
}
</style>
