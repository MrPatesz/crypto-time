import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Coin {
  asset_id: string;
  data_end: string;
  data_orderbook_end: string;
  data_orderbook_start: string;
  data_quote_end: string;
  data_quote_start: string;
  data_start: string;
  data_symbols_count: number;
  data_trade_end: string;
  data_trade_start: string;
  id_icon: string;
  name: string;
  price_usd: number;
  type_is_crypto: number;
  volume_1day_usd: number;
  volume_1hrs_usd: number;
  volume_1mth_usd: number;
}

export interface ExchangeItem {
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  rate_open: number;
  rate_high: number;
  rate_low: number;
  rate_close: number;
}

@Injectable({
  providedIn: 'root',
})
export abstract class ICoinsService {
  abstract getCoins(): Observable<Coin[]>;

  abstract getCoinById(coinId: string): Coin;

  abstract getLastWeeksExchangeRate(coinId: string): Observable<ExchangeItem[]>;
}
