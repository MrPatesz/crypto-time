import { Injectable } from '@angular/core';
import { ICoinsService } from './interface-coins.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';

@Injectable({
  providedIn: 'root',
})
export class MockedCoinsService implements ICoinsService {
  constructor() {}

  getCoins() {
    return of(<Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]'));
  }

  getCoinById(coinId: string): Coin {
    let coins = <Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]');

    return coins.find((c) => c.asset_id === coinId)!;
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]> {
    return of(
      <ExchangeRate[]>JSON.parse(localStorage.getItem('mockedExchange') ?? '[]')
    );
  }
}
