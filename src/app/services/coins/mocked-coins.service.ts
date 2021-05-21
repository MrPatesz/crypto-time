import { Injectable } from '@angular/core';
import { Coin, ExchangeItem, ICoinsService } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root',
})
export class MockedCoinsService implements ICoinsService {
  private readonly BASE_URL = 'https://rest.coinapi.io/v1/';
  private readonly API_KEY = '7602D7C3-AAD3-4E2B-B44E-82A24F734EA8'; //'80F87126-EAF7-4CBC-9D3B-17CC8D136633'; //'8CC5740F-5A45-4824-AB0B-C0CBFA30F828'; //
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'X-CoinAPI-Key': this.API_KEY }),
  };

  constructor(private http: HttpClient) {}

  getCoins() {
    return this.http.get<Coin[]>(this.BASE_URL + 'assets', this.HTTP_OPTIONS);
  }

  getCoinById(coinId: string): Coin {
    let coins = <Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]');

    return coins.find((c) => c.asset_id === coinId)!;
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeItem[]> {
    return of(
      <ExchangeItem[]>JSON.parse(localStorage.getItem('mockedExchange') ?? '[]')
    );
  }
}
