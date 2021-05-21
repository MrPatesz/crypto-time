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
