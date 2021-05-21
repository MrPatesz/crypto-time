import { Injectable } from '@angular/core';
import { ICoinsService } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate } from 'src/app/models/exchange-rate';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiCoinsService implements ICoinsService {
  private readonly BASE_URL = 'https://rest.coinapi.io/v1/';
  private readonly API_KEY = '7602D7C3-AAD3-4E2B-B44E-82A24F734EA8'; //'80F87126-EAF7-4CBC-9D3B-17CC8D136633'; //'8CC5740F-5A45-4824-AB0B-C0CBFA30F828';
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'X-CoinAPI-Key': this.API_KEY }),
  };

  constructor(private http: HttpClient) {}

  getCoins() {
    return this.http.get<Coin[]>(this.BASE_URL + 'assets', this.HTTP_OPTIONS);
  }

  getCoinById(coinId: string): Observable<Coin[]> {
    return this.http.get<Coin[]>(
      this.BASE_URL + 'assets/' + coinId,
      this.HTTP_OPTIONS
    );
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeRate[]> {
    let yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate());

    let yesterdayString = formatDate(
      yesterdaysDate,
      'yyyy-MM-ddT00:00:00',
      'en-UK',
      '+0000'
    );

    let oneWeekAgosDate = new Date().setDate(yesterdaysDate.getDate() - 7);

    let oneWeekAgoString = formatDate(
      oneWeekAgosDate,
      'yyyy-MM-ddT00:00:00',
      'en-UK',
      '+0000'
    );

    return this.http.get<ExchangeRate[]>(
      this.BASE_URL +
        'exchangerate/' +
        coinId +
        '/USD/history?period_id=12HRS&time_start=' +
        oneWeekAgoString +
        '&time_end=' +
        yesterdayString,
      this.HTTP_OPTIONS
    );
  }
}
