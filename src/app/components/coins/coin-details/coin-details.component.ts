import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartData, SeriesItem } from 'src/app/models/chart-data';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate, MockedExchangeRate } from 'src/app/models/exchange-rate';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';
import { ApiCoinsService } from 'src/app/services/coins/api-coins.service';
import { MockedCoinsService } from 'src/app/services/coins/mocked-coins.service';

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.scss'],
  providers: [{ provide: ICoinsService, useClass: MockedCoinsService }], //ApiCoinsService }], // 
})
export class CoinDetailsComponent implements OnInit {
  @Input()
  selectedCoinId!: string;

  @Output()
  removeCoin = new EventEmitter();

  selectedCoin!: Coin;
  chartData!: ChartData[] | undefined;
  view: [number, number] = [700, 400];
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Time and Date';
  yAxisLabel: string = 'Price in USD';
  usdValue: number = 0;
  coinValue: number = 0;

  constructor(private coinsService: ICoinsService) {}

  ngOnInit(): void {
    this.coinsService
      .getCoinById(this.selectedCoinId)
      .subscribe((coins: Coin[]) => {
        this.selectedCoin = coins.find(
          (coin) => coin.asset_id === this.selectedCoinId
        )!;
      });

    this.coinsService
      .getLastWeeksExchangeRates(this.selectedCoinId)
      .subscribe((exchangeRates) => {
        this.fillChartData(this.selectedCoinId, exchangeRates);
      });
  }
  
  usdValueChanged(): void {
    this.coinValue = this.usdValue / this.selectedCoin.price_usd;
  }

  coinValueChanged(): void {
    this.usdValue = this.coinValue * this.selectedCoin.price_usd;
  }

  remove(): void {
    this.removeCoin.emit(this.selectedCoin.asset_id);
  }

  private fillChartData(coinId: string, exchangeRates: ExchangeRate[]): void {
    let newChartData = [{ name: coinId, series: <SeriesItem[]>[] }];
    exchangeRates.forEach((exchangeRate) => {
      newChartData[0].series.push({
        name:
          exchangeRate.time_period_start.slice(5, 10) +
          ' ' +
          exchangeRate.time_period_start.slice(11, 16),
        value: exchangeRate.rate_open,
      });
    });
    this.chartData = newChartData;
  }
}
