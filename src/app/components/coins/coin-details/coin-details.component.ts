import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartData, SeriesItem } from 'src/app/models/chart-data';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate, MockedExchangeRate } from 'src/app/models/exchange-rate';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';
import { MockedCoinsService } from 'src/app/services/coins/mocked-coins.service';

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.scss'],
  providers: [{ provide: ICoinsService, useClass: MockedCoinsService }],//ApiCoinsService }, //
})
export class CoinDetailsComponent implements OnInit {
  selectedCoin!: Coin;
  @Input()
  selectedCoinId!: string;

  @Output()
  removeCoin = new EventEmitter();

  chartData!: ChartData[] | undefined;
  view: any = [700, 400];
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
    this.selectedCoin = this.coinsService.getCoinById(this.selectedCoinId);
    this.coinsService
      .getLastWeeksExchangeRate(this.selectedCoinId)
      .subscribe((r) => {
        this.fillChartData(this.selectedCoinId, r);
      });
  }

  private fillChartData(coinId: string, exchangeRates: ExchangeRate[]) {
    this.persistMockData(coinId, exchangeRates);

    let newChartData = [{ name: coinId, series: <SeriesItem[]>[] }];
    exchangeRates.forEach((exchangeRate) => {
      newChartData[0].series.push({
        name: exchangeRate.time_period_start,
        value: exchangeRate.rate_open,
      });
    });
    this.chartData = newChartData;
  }

  private persistMockData(coinId: string, r: ExchangeRate[]) {
    let mockedExchangeRates = <MockedExchangeRate[]>(
      JSON.parse(localStorage.getItem('mockedExchangeRates') ?? '[]')
    );

    let updateRate = mockedExchangeRates.find((ex) => ex.coinId === coinId);

    if (updateRate) {
      mockedExchangeRates = mockedExchangeRates.filter(
        (rate) => rate.coinId !== coinId
      );
      mockedExchangeRates.push({ coinId: coinId, rates: r });
    } else {
      mockedExchangeRates.push({ coinId: coinId, rates: r });
      localStorage.setItem(
        'mockedExchangeRates',
        JSON.stringify(mockedExchangeRates)
      );
    }
  }

  usdValueChanged() {
    this.coinValue = this.usdValue / this.selectedCoin.price_usd;
  }

  coinValueChanged() {
    this.usdValue = this.coinValue * this.selectedCoin.price_usd;
  }

  remove() {
    this.removeCoin.emit(this.selectedCoin.asset_id);
  }
}
