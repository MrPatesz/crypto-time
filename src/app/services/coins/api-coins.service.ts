import { Injectable } from '@angular/core';
import { ICoinsService, SubscriptionFunction } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { formatDate } from '@angular/common';
import { Symbol } from 'src/app/models/symbol';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebsocketMessage } from 'src/app/models/websocket-message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiCoinsService implements ICoinsService {
  private readonly API_KEY = '7602D7C3-AAD3-4E2B-B44E-82A24F734EA8';
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'X-CoinAPI-Key': this.API_KEY }),
  };
  private readonly websocket: WebSocketSubject<unknown> = webSocket(
    'ws://ws.coinapi.io/v1/'
  );
  private readonly PERIOD = '12HRS';

  constructor(private http: HttpClient) {}

  subcribeToWebsocket(subscriptionFunction: SubscriptionFunction): void {
    this.websocket.subscribe((message) => {
      subscriptionFunction(<WebsocketMessage>message);
    });
  }

  closeWebsocket(): void {
    this.websocket.complete();
  }

  sendHelloMessage(coinIds: string[], symbols: string[]): void {
    let helloMessage = {
      type: 'hello',
      apikey: this.API_KEY,
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_period_id: ['1MIN'],
      subscribe_filter_asset_id: coinIds,
      subscribe_update_limit_ms_quote: 999,
      subscribe_filter_symbol_id: symbols,
    };
    this.websocket.next(helloMessage);
  }

  getCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>(environment.apiUrl + 'assets', this.HTTP_OPTIONS);
  }

  getCoinById(coinId: string): Observable<Coin[]> {
    return this.http.get<Coin[]>(
      environment.apiUrl + 'assets/' + coinId,
      this.HTTP_OPTIONS
    );
  }

  getLastWeeksExchangeRates(coinId: string): Observable<ExchangeRate[]> {
    let today = new Date();
    let oneWeekAgo = new Date().setDate(today.getDate() - 7);

    return this.http.get<ExchangeRate[]>(
      environment.apiUrl +
        'exchangerate/' +
        coinId +
        '/USD/history' +
        '?period_id=' +
        this.PERIOD +
        '&time_start=' +
        this.dateToUtcString(oneWeekAgo) +
        '&time_end=' +
        this.dateToUtcString(today),
      this.HTTP_OPTIONS
    );
  }

  getSymbols(coinIds: string[]): Observable<Symbol[]> {
    return this.http.get<Symbol[]>(
      environment.apiUrl +
        'symbols?filter_symbol_id=BINANCE_SPOT_&filter_asset_id=' +
        coinIds.toString(),
      this.HTTP_OPTIONS
    );
  }

  private dateToUtcString(date: Date | number): string {
    return formatDate(date, 'yyyy-MM-ddT00:00:00', 'en-UK');
  }
}
