import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICoinsService } from '../../services/coins/interface-coins.service';
import { MockedCoinsService } from '../../services/coins/mocked-coins.service';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ChartData, SeriesItem } from '../../models/chart-data';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IUserService } from 'src/app/services/user/interface-user.service';
import { MockedUserService } from 'src/app/services/user/mocked-user.service';
import { Coin } from 'src/app/models/coin';
import { ExchangeRate, MockedExchangeRate } from 'src/app/models/exchange-rate';
import { ApiCoinsService } from 'src/app/services/coins/api-coins.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
  providers: [
    { provide: ICoinsService, useClass: MockedCoinsService }, //ApiCoinsService }, //
    { provide: IUserService, useClass: MockedUserService },
  ],
})
export class CoinsComponent implements OnInit {
  constructor(
    private coinsService: ICoinsService,
    private userService: IUserService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  loggedInAs!: string | null;
  coinIds: string[] = [];
  selectedCoin!: Coin;
  usdValue: number = 0;
  coinValue: number = 0;

  // chart
  chartData: ChartData[] | undefined;
  view: any = [700, 400];
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Time and Date';
  yAxisLabel: string = 'Price in USD';
  // chart

  ngOnInit(): void {
    this.loggedInAs = this.userService.getLoggedInAs();
    this.coinIds = this.userService.getSavedCoinIds();
    this.selectedCoin = this.coinsService.getCoinById(this.coinIds[0]);
    this.coinsService
      .getLastWeeksExchangeRate(this.selectedCoin.asset_id)
      .subscribe((r) => {
        this.fillChartData(this.selectedCoin.asset_id, r);
      });
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  addCoin(): void {
    const dialogRef = this.dialog.open(AddCoinComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((coin) => {
      if (coin) {
        this.userService.saveCoin(coin);
      }
    });
  }

  onTabChange(selectedIndex: number | null) {
    if (selectedIndex !== null) {
      let coinId = this.coinIds[selectedIndex];

      this.selectedCoin = this.coinsService.getCoinById(coinId);

      this.usdValue = 0;
      this.coinValue = 0;

      this.coinsService.getLastWeeksExchangeRate(coinId).subscribe((r) => {
        this.fillChartData(coinId, r);
      });
    }
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

  private fillChartData(coinId: string, r: ExchangeRate[]) {
    this.persistMockData(coinId, r);

    let newChartData = [{ name: coinId, series: <SeriesItem[]>[] }];
    r.forEach((i) => {
      newChartData[0].series.push({
        name: i.time_period_start,
        value: i.rate_open,
      });
    });
    this.chartData = newChartData;
  }

  removeCoin(coinId: string) {
    this.userService.removeCoin(coinId);

    this.coinIds = this.coinIds.filter((c) => c !== coinId);
  }

  usdValueChanged() {
    this.coinValue = this.usdValue / this.selectedCoin.price_usd;
  }

  coinValueChanged() {
    this.usdValue = this.coinValue * this.selectedCoin.price_usd;
  }
}
