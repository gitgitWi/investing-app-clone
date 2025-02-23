<template>
  <div id="news-modal" @click.self="$emit('set-modal-handler')">
    <article id="news-modal-detail">
      <Button id="news-modal-detail-close" @click.native="$emit('set-modal-handler')">❌</Button>
      <img :src="image" :alt="image" id="news-modal-detail-image" />
      <Words id="news-modal-detail-headline">{{ headline }}</Words>
      <Words id="news-modal-detail-summary">{{ summary === 'Content' ? '기사내용이 없습니다.' : summary }}</Words>
      <div id="news-modal-detail-options">
        <Words @click.native="toggleLikes" id="news-modal-detail-likes" :class="{ userLike }"> 🏷️ {{ likes }} </Words>
        <Words @click.native="openOrigin" id="news-modal-detail-origin"> 원문보기 ➡️ {{ source }} </Words>
      </div>
      <Reply />
    </article>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState as RootState, mapActions, createNamespacedHelpers } from 'vuex';
import { RootActions, StoreNames } from '@/store';

import Button from '@/components/atoms/Button.vue';
import Words from '@/components/atoms/Words.vue';
import Reply from '@/components/organisms/ReplySection.vue';

const { mapState, mapActions: mapNewsActions } = createNamespacedHelpers(StoreNames.News);

export default Vue.extend({
  name: 'NewsModal',

  components: { Words, Button, Reply },

  data() {
    return {
      id: undefined,
      category: undefined,
      headline: undefined,
      image: undefined,
      summary: undefined,
      source: undefined,
      url: undefined,
      datetime: undefined,
      likes: 0,
      userLike: false,
    };
  },

  computed: {
    ...RootState(['auth']),
    ...mapState(['currentModalNews']),
  },

  watch: {
    currentModalNews() {
      const { id, category, headline, image, summary, source, url, datetime, likes, userLike } = this.currentModalNews;
      if (!id) return;

      this.id = id;
      this.category = category;
      this.headline = headline;
      this.image = image;
      this.summary = summary;
      this.source = source;
      this.url = url;
      this.datetime = datetime;
      this.likes = likes;
      this.userLike = userLike;

      this[RootActions.SET_CURRENT_TICKER](id?.toString());
    },
  },

  methods: {
    ...mapActions([RootActions.SET_CURRENT_TICKER]),

    ...mapNewsActions(['toggleBookmarkAction', 'getMarketNewsAction']),

    openOrigin() {
      window.open(this.url);
    },

    toggleLikes() {
      if (!this.auth) return;
      const { likes, userLike, id } = this;
      const update = userLike ? -1 : +1;
      this.likes = likes + update;
      this.userLike = !userLike;
      this.toggleBookmarkAction({ id, likes, update });
    },
  },
});
</script>

<style lang="scss" scoped>
#news-modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba($grey-900, 0.8);

  &-detail {
    position: relative;
    padding: 30px;
    width: 60%;
    max-width: $max-width-mobile;
    height: max-content;
    max-height: 75%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: $grey-300;
    border-radius: $border-radius-10;
    box-shadow: 0 0 5px 0 rgba($grey-700, 0.7);
    animation: showUp 0.3s ease-in-out;

    .dark & {
      background-color: $deep-dark;
    }

    &-close {
      position: absolute;
      top: 30px;
      right: 25px;
      width: max-content;
      padding: 5px 10px;
      margin-bottom: 15px;
      cursor: pointer;
      background-color: transparent;

      &:hover {
        color: $grey-100;
        text-decoration: none;
        scale: 1.25;
      }
    }

    &-image {
      width: 80%;
      border-radius: $border-radius-10;
      box-shadow: 0 0 10px 0 rgba($grey-700, 0.7);
    }

    &-headline {
      margin: $margin-padding-15;
      font-weight: bold;
      font-size: 1.2rem;

      .dark & {
        color: $sup-beige;
      }
    }

    &-summary {
      margin-bottom: $margin-padding-15;
      margin: 15px 0;
      text-align: left;

      .dark & {
        color: $grey-300;
      }
    }

    &-options {
      width: 100%;
      margin: 15px 10px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      font-size: 0.8rem;
    }

    &-likes {
      width: max-content;
      padding: 5px 10px;
      border-radius: $border-radius-10;
      box-shadow: 0 0 2px 0 $red-a400;
      background-color: transparent;

      display: flex;
      align-items: center;
      line-height: 1rem;
      cursor: pointer;

      .dark & {
        color: $grey-300;
      }

      &:hover {
        background-color: rgba($red-a400, 0.4);
        color: $grey-100;
      }

      &.userLike {
        background-color: rgba($red-a400, 0.4);
        color: $red-a400;
      }
    }

    &-origin {
      width: max-content;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: $border-radius-10;
      box-shadow: 0 0 3px 0 $grey-500;

      display: flex;
      align-items: center;
      font-size: 0.8rem;
      line-height: 1rem;
      font-weight: bold;
      transition: all 0.1s ease-in-out;

      &:hover {
        background-color: $green-700;
        color: $grey-100;
        scale: 1.1;

        .dark & {
          background-color: $deep-blue;
        }
      }

      .dark & {
        color: $grey-500;
      }
    }
  }
}

@keyframes showUp {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>
