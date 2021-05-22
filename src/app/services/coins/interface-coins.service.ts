import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { Symbol } from 'src/app/models/symbol';

@Injectable({
  providedIn: 'root',
})
export abstract class ICoinsService {
  abstract getCoins(): Observable<Coin[]>;

  abstract getCoinById(coinId: string): Observable<Coin[]>;

  abstract getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]>;

  abstract getSymbols(coinIds: string[]): Observable<Symbol[]>;
}
