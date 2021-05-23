import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { Symbol } from 'src/app/models/symbol';
import { WebsocketMessage } from 'src/app/models/websocket-message';

export type SubscriptionFunction = (message: WebsocketMessage) => void;

@Injectable({
  providedIn: 'root',
})
export abstract class ICoinsService {
  abstract subcribeToWebsocket(
    subscriptionFunction: SubscriptionFunction
  ): void;

  abstract closeWebsocket(): void;

  abstract sendHelloMessage(coinIds: string[], symbols: string[]): void;

  abstract getCoins(): Observable<Coin[]>;

  abstract getCoinById(coinId: string): Observable<Coin[]>;

  abstract getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]>;

  abstract getSymbols(coinIds: string[]): Observable<Symbol[]>;
}
