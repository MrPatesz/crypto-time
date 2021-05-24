import { Injectable } from '@angular/core';
import { ICoinsService, SubscriptionFunction } from './interface-coins.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate, MockedExchangeRate } from 'src/app/models/exchange-rate';
import { Symbol } from 'src/app/models/symbol';
import { MockedCoinsData } from './mocked-data';

@Injectable({
  providedIn: 'root',
})
export class MockedCoinsService implements ICoinsService {
  constructor() {}

  subcribeToWebsocket(subscriptionFunction: SubscriptionFunction): void {}

  closeWebsocket(): void {}

  sendHelloMessage(coinIds: string[], symbols: string[]): void {}

  getCoins(): Observable<Coin[]> {
    return of(<Coin[]>MockedCoinsData.mockedCoins);
  }

  getCoinById(coinId: string): Observable<Coin[]> {
    let coins = <Coin[]>MockedCoinsData.mockedCoins;
    return of(Array.of(coins.find((coin) => coin.asset_id === coinId)!));
  }

  getLastWeeksExchangeRates(coinId: string): Observable<ExchangeRate[]> {
    let exchangeRates = <MockedExchangeRate[]>(
      MockedCoinsData.mockedExchangeRates
    );

    let returnValue = exchangeRates.find(
      (exchangeRate) => exchangeRate.coinId === coinId
    );

    if (returnValue) {
      return of(returnValue.rates);
    } else {
      return of(exchangeRates[0].rates ?? []);
    }
  }

  getSymbols(coinIds: string[]): Observable<Symbol[]> {
    return of(<Symbol[]>MockedCoinsData.mockedSymbols);
  }
}
