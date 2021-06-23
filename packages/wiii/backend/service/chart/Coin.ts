import axios, { AxiosRequestConfig } from 'axios';
import { CandleOne } from '../../../domain/marketData';
import { range } from '../../../domain/utilFunc';
import { FinnhubConfigs } from '../../config/market';

/**
 * finnhub.io API 활용
 * 코인 차트
 * @example https://finnhub.io/api/v1/crypto/candle?symbol={BINANCE:BTCUSDT}&resolution=D&from={1572651390}&to={1575243390}&token=
 */

const { BASE } = FinnhubConfigs;

const candlesUrl = `${BASE}crypto/candle`;

/**
 * 기존 국내주식 차트에 사용하던 marketStack API와 데이터 구조가 다름
 * - 시고저종별 배열 -> 캔들 배열
 * - 오래된 일자 순 -> 최신순 정렬
 * @todo 추후 KRX, 차트 데이터 구조를 finnhub 구조로 통일
 */
const adjustPrices = (_result) => {
  const result = JSON.parse(_result);
  if (result.s !== 'ok') return { results: [], count: 0 };

  const { o, h, l, c, v, t } = result;
  const count = c.length;

  const adjusted = Array(count).fill({});

  for (const idx of range(0, count)) {
    adjusted[idx] = {
      open: o[idx],
      adj_close: c[idx],
      close: c[idx],
      high: h[idx],
      low: l[idx],
      volume: v[idx],
      date: new Date(t[idx] * 1_000).toTimeString(),
    } as CandleOne;
  }

  const [last, prev] = adjusted.reverse();
  const { close: price, volume } = last;
  const { close: prevPrice } = prev;
  const change = Number((((price - prevPrice) / prevPrice) * 100).toFixed(2));

  return { results: adjusted, count, price, volume, change, typeName: 'coin' };
};

const setAxiosConfig = (params: object): AxiosRequestConfig => ({
  maxRedirects: 1,
  responseType: 'json',
  params: { ...params, token: FinnhubConfigs.ACCESS_KEY },
  transformResponse: [adjustPrices],
});

/**
 *
 * @param symbol 가상화폐 종목 티커
 * @param from 숫자문자열, UNIX timestamp
 * @param to 숫자문자열, UNIX timestamp
 * @returns
 */
export const getCoinCandles = (symbol: string, resolution?: string, from?: number, to?: number) => {
  const config = setAxiosConfig({ symbol, from, to, resolution });
  return axios.get(candlesUrl, config);
};
