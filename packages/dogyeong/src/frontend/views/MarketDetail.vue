<template>
  <Layout>
    <Header>
      <HeaderTitle>
        <template #left>
          <HeaderButton @clickHeaderButton="back">🠔</HeaderButton>
        </template>
        <template #right>
          <SearchButton />
        </template>
        {{ displayName }}
      </HeaderTitle>
    </Header>
    <main>
      <section v-if="summaryDetail" :class="$style.price">
        <span :class="$style['current-price']">{{ previosClose }}</span>
        <span :class="[{ [$style.red]: priceDiff > 0 }, { [$style.blue]: priceDiff < 0 }]">
          {{ priceDiff | formatNumber }} {{ pricePercent | formatNumber | formatPercent }}
        </span>
      </section>
      <section :class="$style['chart-section']">
        <LoadingSpinner v-if="isChartLoading" />
        <Chart ref="chart" :data="chartData" :colorOption="chartColorOptions" :class="$style['chart-container']" />
        <div :class="$style['button-container']">
          <button @click="changeChartPeriod('1d')">1일</button>
          <button @click="changeChartPeriod('1w')">1주</button>
          <button @click="changeChartPeriod('1m')">1달</button>
          <button @click="changeChartPeriod('1y')">1년</button>
          <button @click="changeChartPeriod('5y')">5년</button>
          <button @click="changeChartPeriod('max')">최대</button>
          <button class="chart-btn" @click="toggleGraphType">&#128480;</button>
          <button v-if="fullscreenEnabled" @click="requestFullscreen">Full</button>
        </div>
      </section>
      <section v-if="summaryDetail" :class="$style.summary">
        <h2>개요</h2>
        <table>
          <tbody>
            <tr>
              <td>일일 변동폭</td>
              <td>{{ summaryDetail.dayLow }} - {{ summaryDetail.dayHigh }}</td>
            </tr>
            <tr>
              <td>52주 가격변동폭</td>
              <td>{{ summaryDetail.fiftyTwoWeekLow }} - {{ summaryDetail.fiftyTwoWeekHigh }}</td>
            </tr>
            <tr>
              <td>총 시가</td>
              <td>{{ summaryDetail.marketCap | addComma }}</td>
            </tr>
            <tr>
              <td>매수가/매도가</td>
              <td>{{ summaryDetail.bid }}/{{ summaryDetail.ask }}</td>
            </tr>
            <tr>
              <td>거래량</td>
              <td>{{ summaryDetail.volume | addComma }}</td>
            </tr>
            <tr>
              <td>평균 거래량</td>
              <td>{{ summaryDetail.averageVolume | addComma }}</td>
            </tr>
            <tr>
              <td>이전 종가</td>
              <td>{{ summaryDetail.previousClose }}</td>
            </tr>
            <tr>
              <td>시가</td>
              <td>{{ summaryDetail.open }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <ArticleTemplate
        section-title="뉴스"
        :articles="news.data"
        url-prefix="/news/new"
        :isLoading="news.isLoading"
        :isError="news.isError"
      />
      <ArticleTemplate
        section-title="의견"
        :articles="opinions.data"
        url-prefix="/news/new"
        :isLoading="opinions.isLoading"
        :isError="opinions.isError"
      />
      <ReplySection id="reply-section" :hasAuth="$store.getters.isLoggedIn" :docId="symbol" />
    </main>
    <BottomNav />
  </Layout>
</template>

<script lang="ts">
/**
 * MarketDetail
 *
 * 시장의 각 종목 상세페이지
 */
import Vue from 'vue';
import { getSummary, getChart } from '@/services/financeService';
import { getNewNews, getNewOpinions } from '@/services/articleService';
import Layout from '@/components/Layout/Layout.vue';
import { Header, HeaderTitle, HeaderButton } from '@/components/Header';
import BottomNav from '@/components/BottomNav/BottomNav.vue';
import ArticleTemplate from '@/components/ArticleTemplate/ArticleTemplate.vue';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue';
import SearchButton from '@/components/SearchButton/SearchButton.vue';
import { chartLightThemeOption } from '@/config';
import { addComma, formatNumber, formatPercent } from '@/filters';
import Chart from '@/components/Chart/Chart.vue';
import ReplySection from 'common/frontend/components/ReplySection/index.vue';

export default Vue.extend({
  name: 'MarketDetail',

  components: {
    Layout,
    Header,
    HeaderTitle,
    BottomNav,
    HeaderButton,
    ArticleTemplate,
    LoadingSpinner,
    SearchButton,
    Chart,
    ReplySection,
  },

  filters: {
    formatNumber,
    addComma,
    formatPercent,
  },

  data() {
    return {
      summaryDetail: null,
      chartData: [],
      chart: null,
      news: {
        data: [],
        isLoading: false,
        isError: false,
      },
      opinions: {
        data: [],
        isLoading: false,
        isError: false,
      },
      symbol: '',
      isChartLoading: true,
      chartPeriod: '5y',
      interval: null,
      displayName: '',
    };
  },

  computed: {
    fullscreenEnabled() {
      return document.fullscreenEnabled;
    },
    chartColorOptions() {
      return this.$store.state.isDarkTheme ? undefined : chartLightThemeOption;
    },
    previos2DayClose() {
      return this.chartData[1]?.close ?? 0;
    },
    previosClose() {
      return this.chartData[0]?.close ?? 0;
    },
    priceDiff() {
      return this.previosClose - this.previos2DayClose;
    },
    pricePercent() {
      const result = (this.priceDiff / this.previos2DayClose) * 100;
      return Number.isNaN(result) ? 0 : result;
    },
  },

  created() {
    this.symbol = this.$route.params.id;

    getSummary(this.symbol)
      .then((summaryDetail) => (this.summaryDetail = summaryDetail))
      .catch(console.error);

    getNewNews({ tickers: this.symbol })
      .then((news) => (this.news.data = news))
      .catch(console.error);

    getNewOpinions({ tickers: this.symbol })
      .then((opinions) => (this.opinions.data = opinions))
      .catch(console.error);

    this.fetchChart();
    this.interval = setInterval(this.fetchChart.bind(this), 2000);
  },

  beforeDestroy() {
    this.clearInterval();
  },

  methods: {
    back() {
      this.$router.back();
    },
    changeChartPeriod(period) {
      this.chartPeriod = period;
      this.clearInterval();
      this.interval = setInterval(this.fetchChart.bind(this), 2000);
      this.fetchChart();
    },
    fetchChart() {
      if (!this.chartData.length) this.isChartLoading = true;

      getChart({ symbol: this.symbol, period: this.chartPeriod })
        .then((chart) => {
          this.chartData = chart.data;
          this.displayName = chart.display_name;
          this.isChartLoading = false;
        })
        .catch(console.error);
    },
    toggleGraphType() {
      this.$refs.chart.toggleGraphType();
    },
    requestFullscreen() {
      this.$refs.chart.requestFullscreen();
    },
    clearInterval() {
      if (!this.interval) return;
      clearInterval(this.interval);
      this.interval = null;
    },
  },
});
</script>

<style lang="scss" module>
.chart-section {
  margin-bottom: 60px;
  position: relative;
}

.chart-container {
  margin-bottom: 12px;
}

.button-container {
  padding: 0 12px;

  button {
    padding: 4px 6px;
    font-size: 15px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    margin-right: 4px;
    color: var(--text-color);

    &:hover {
      background-color: var(--border-color);
    }
  }
}

.price {
  background-color: var(--header-nav-bg-color);
  padding: 20px 12px;
  border-bottom: 1px solid var(--border-color);
  font-size: 18px;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  margin-right: 4px;
}

.red {
  color: var(--red-color);
}

.blue {
  color: var(--blue-color);
}

.summary {
  padding: 0 12px;
  margin-bottom: 60px;

  h2 {
    margin-bottom: 8px;
  }

  table {
    width: 100%;

    tbody {
      tr {
        td {
          padding: 8px 0;
          font-weight: bold;
          font-size: 16px;

          &:first-child {
            padding-right: 8px;
            width: 30%;
            min-width: 160px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
