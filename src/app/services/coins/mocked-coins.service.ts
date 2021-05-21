import { Injectable } from '@angular/core';
import { ICoinsService } from './interface-coins.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate, MockedExchangeRate } from 'src/app/models/exchange-rate';

@Injectable({
  providedIn: 'root',
})
export class MockedCoinsService implements ICoinsService {
  constructor() {}

  getCoins() {
    return of(<Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]'));
  }

  getCoinById(coinId: string): Observable<Coin[]> {
    let coins = <Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]');

    return of(Array.of(coins.find((c) => c.asset_id === coinId)!));
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]> {
    let exchangeRates = <MockedExchangeRate[]>(
      JSON.parse(localStorage.getItem('mockedExchangeRates') ?? '[]')
    );
    let returnValue = exchangeRates.find((rate) => rate.coinId === coinId);

    if (returnValue) {
      return of(returnValue.rates);
    } else {
      return of(exchangeRates[0].rates);
    }
  }
}
