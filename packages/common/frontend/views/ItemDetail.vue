<template>
  <div class="item-detail-page">
    <multipurpose-header
      :itemDetail="itemDetail"
      isItemDetail
      :userInfo="userInfo"
      :isLoading="itemDetailIsLoading"
      :isError="itemDetailIsError"
    />
    <item-detail-price-box :itemDetail="itemDetail" :isLoading="itemDetailIsLoading" :isError="itemDetailIsError" />
    <custom-swiper :navigatorButtonNames="swiperNavigatorButtonNames">
      <swiper-slide>
        <list-wrapper :excludedHeight="210">
          <chart v-if="symbolForChart" :canvasWidth="300" :canvasHeight="300" :symbol="symbolForChart" />
          <item-detail-overview-box :itemDetail="itemDetail" :isLoading="itemDetailIsLoading" :isError="itemDetailIsError" />
          <!-- 댓글 컴포넌트 자리 -->
          <sub-content-box :text="newsText">
            <loading v-if="newsIsLoading" :loadingHeight="220" />
            <error v-else-if="newsIsError" :errorHeight="220" />
            <empty v-else-if="!overviewNews.length" :emptyHeight="220" />
            <news-list v-else>
              <news-list-item
                v-for="element in overviewNews"
                :key="element.id"
                @handle-click="routeToNewsDetail"
                :id="element._id"
              >
                <news-image class="news-image-align" :src="element.image_url" />
                <news-text-box>
                  <news-text-box-title>{{ element.title }}</news-text-box-title>
                  <news-text-box-desc :author="element.source" :publishDate="element.date" />
                </news-text-box>
              </news-list-item>
            </news-list>
          </sub-content-box>
          <sub-content-box :text="analysisText">
            <loading v-if="analysesIsLoading" :loadingHeight="220" />
            <error v-else-if="analysesIsError" :errorHeight="220" />
            <empty v-else-if="!overviewAnalyses.length" :emptyHeight="220" />
            <news-list v-else>
              <news-list-item
                v-for="element in overviewAnalyses"
                :key="element.id"
                @handle-click="routeToNewsDetail"
                :id="element._id"
              >
                <news-image class="news-image-align" :src="element.image_url" />
                <news-text-box>
                  <news-text-box-title>{{ element.title }}</news-text-box-title>
                  <news-text-box-desc :author="element.source" :publishDate="element.date" />
                </news-text-box>
              </news-list-item>
            </news-list>
          </sub-content-box>
        </list-wrapper>
      </swiper-slide>
      <swiper-slide>
        <list-wrapper :excludedHeight="210">
          <loading v-if="newsIsLoading" />
          <error v-else-if="newsIsError" />
          <empty v-else-if="!news.length" />
          <news-list v-else>
            <news-list-item v-for="element in news" :key="element.id" @handle-click="routeToNewsDetail" :id="element._id">
              <news-image class="news-image-align" :src="element.image_url" />
              <news-text-box>
                <news-text-box-title>{{ element.title }}</news-text-box-title>
                <news-text-box-desc :author="element.source" :publishDate="element.date" />
              </news-text-box>
            </news-list-item>
          </news-list>
        </list-wrapper>
      </swiper-slide>
      <swiper-slide>
        <list-wrapper :excludedHeight="210">
          <loading v-if="analysesIsLoading" />
          <error v-else-if="analysesIsError" />
          <empty v-else-if="!analyses.length" />
          <news-list v-else>
            <news-list-item v-for="element in analyses" :key="element.id" @handle-click="routeToNewsDetail" :id="element._id">
              <news-image class="news-image-align" :src="element.image_url" />
              <news-text-box>
                <news-text-box-title>{{ element.title }}</news-text-box-title>
                <news-text-box-desc :author="element.source" :publishDate="element.date" />
              </news-text-box>
            </news-list-item>
          </news-list>
        </list-wrapper>
      </swiper-slide>
    </custom-swiper>
    <bottom-naviagtor :navigatorButtonNames="bottomNavigatorButtonNames" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { SwiperSlide } from 'vue-awesome-swiper';
import { text } from '../constants';

import BottomNaviagtor from '../components/BottomNaviagtor.vue';
import MultipurposeHeader from '../components/MultipurposeHeader.vue';
import ItemDetailPriceBox from '../components/ItemDetail/ItemDetailPriceBox.vue';
import ListWrapper from '../components/ListWrapper.vue';
import CustomSwiper from '../components/CustomSwiper.vue';
import ItemDetailOverviewBox from '../components/ItemDetail/ItemDetailOverviewBox.vue';
import SubContentBox from '../components/ItemDetail/SubContentBox.vue';
import NewsList from '../components/News/NewsList.vue';
import NewsListItem from '../components/News/NewsListItem.vue';
import NewsImage from '../components/News/NewsImage.vue';
import NewsTextBox from '../components/News/NewsTextBox.vue';
import NewsTextBoxTitle from '../components/News/NewsTextBoxTitle.vue';
import NewsTextBoxDesc from '../components/News/NewsTextBoxDesc.vue';
import Chart from 'karl/frontend/components/Chart.vue';
import Loading from 'karl/frontend/components/Loading.vue';
import Error from 'karl/frontend/components/Error.vue';
import Empty from 'karl/frontend/components/Empty.vue';

export default {
  name: 'ItemDetail',
  components: {
    BottomNaviagtor,
    MultipurposeHeader,
    ItemDetailPriceBox,
    CustomSwiper,
    SwiperSlide,
    ItemDetailOverviewBox,
    SubContentBox,
    NewsList,
    NewsListItem,
    NewsImage,
    NewsTextBox,
    NewsTextBoxTitle,
    NewsTextBoxDesc,
    ListWrapper,
    Chart,
    Loading,
    Error,
    Empty,
  },

  data() {
    const { OVERLALL, NEWS, ANALYSIS, OPINION, CHART, MARKET, BOOKMARK, MORE } = text;

    return {
      swiperNavigatorButtonNames: [OVERLALL, NEWS, ANALYSIS, OPINION, CHART],
      bottomNavigatorButtonNames: [MARKET, NEWS, BOOKMARK, MORE],
      newsText: NEWS,
      analysisText: ANALYSIS,
      opnionText: OPINION,
      symbolForChart: '',
    };
  },

  computed: {
    ...mapState({
      itemDetail: (state) => state.itemDetail.itemDetail,
      news: (state) => state.itemDetail.news,
      analyses: (state) => state.itemDetail.analyses,
      userInfo: (state) => state.user,
      itemDetailIsLoading: (state) => state.itemDetail.itemDetailIsLoading,
      itemDetailIsError: (state) => state.itemDetail.itemDetailIsError,
      newsIsLoading: (state) => state.itemDetail.newsIsLoading,
      newsIsError: (state) => state.itemDetail.newsIsError,
      analysesIsLoading: (state) => state.itemDetail.analysesIsLoading,
      analysesIsError: (state) => state.itemDetail.analysesIsError,
    }),

    overviewNews() {
      return this.news.slice(0, 3);
    },

    overviewAnalyses() {
      return this.analyses.slice(0, 3);
    },
  },

  methods: {
    ...mapActions('itemDetail', [
      'getItemDetail',
      'getNews',
      'getAnalyses',
      'setItemDetailIsLoading',
      'setNewsIsLoading',
      'setAnalysesIsLoading',
    ]),
    ...mapActions('user', ['getUser']),

    routeToNewsDetail(id) {
      this.$router.push({ path: 'news-detail', query: { id } });
    },
  },

  async mounted() {
    const { userEmail, userGoogleId } = this.userInfo;

    this.setItemDetailIsLoading(true);
    this.setNewsIsLoading(true);
    this.setAnalysesIsLoading(true);

    if (!userEmail || !userGoogleId) {
      await this.getUser();
    }

    const { symbols, name } = this.$route.query;
    this.symbolForChart = symbols;
    const email = this.userInfo.userEmail;
    const tickers = [symbols];

    this.getItemDetail({ symbols, email, name }).then(() => {
      this.setItemDetailIsLoading(false);
    });

    this.getNews({ offset: 0, limit: 20, tickers }).then(() => {
      this.setNewsIsLoading(false);
    });

    this.getAnalyses({ offset: 0, limit: 20, tickers }).then(() => {
      this.setAnalysesIsLoading(false);
    });
  },
};
</script>

<style scoped lang="scss">
.item-detail-page {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.news-image-align {
  display: flex;
  align-self: center;
}
</style>
