import { Injectable } from '@angular/core';
import { ICoinsService } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';

@Injectable({
  providedIn: 'root',
})
export class ApiCoinsService implements ICoinsService {
  private readonly BASE_URL = 'https://rest.coinapi.io/v1/';
  private readonly API_KEY = '8CC5740F-5A45-4824-AB0B-C0CBFA30F828'; //'80F87126-EAF7-4CBC-9D3B-17CC8D136633';
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'X-CoinAPI-Key': this.API_KEY }),
  };

  constructor(private http: HttpClient) {}

  getCoins() {
    return this.http.get<Coin[]>(this.BASE_URL + 'assets', this.HTTP_OPTIONS);
  }

  getCoinById(coinId: string): Coin {
    // MOCKED !!!
    let coins = <Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]');

    return coins.find((c) => c.asset_id === coinId)!;
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(
      this.BASE_URL +
        'exchangerate/' +
        coinId +
        '/USD/history?period_id=6HRS&time_start=2021-01-01T00:00:00&time_end=2021-01-08T00:00:00',
      this.HTTP_OPTIONS
    );
  }
}
