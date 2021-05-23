import { Component, Input, OnInit } from '@angular/core';
import { WebsocketMessage } from 'src/app/models/websocket-message';
import { ApiCoinsService } from 'src/app/services/coins/api-coins.service';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';
import { MockedCoinsService } from 'src/app/services/coins/mocked-coins.service';

interface TableItem {
  coinId: string;
  high: number;
  low: number;
}

@Component({
  selector: 'app-coins-real-time',
  templateUrl: './coins-real-time.component.html',
  styleUrls: ['./coins-real-time.component.scss'],
  providers: [{ provide: ICoinsService, useClass: MockedCoinsService }], //ApiCoinsService }], //
})
export class CoinsRealTimeComponent implements OnInit {
  @Input()
  coinIds!: string[];

  tableData: TableItem[] = [];
  displayedColumns: string[] = ['coinId', 'high', 'low'];

  constructor(private coinsService: ICoinsService) {}

  private fillTableData() {
    this.tableData = [];
    this.coinIds.forEach((c) => {
      this.tableData.push({ coinId: c, high: 0, low: 0 });
    });
  }

  ngOnInit(): void {
    this.fillTableData();

    let subscriptionFunction = (message: WebsocketMessage) => {
      if (this.coinIds.length !== this.tableData.length) {
        this.fillTableData();
      }
      let response = <WebsocketMessage>message;
      this.coinIds.forEach((id) => {
        if (
          response.symbol_id.includes(id) &&
          response.symbol_id.includes('USD') &&
          response.symbol_id.indexOf(id) < response.symbol_id.indexOf('USD')
        ) {
          let tableRowData = this.tableData.find((d) => d.coinId === id);
          tableRowData!.high = response.price_high;
          tableRowData!.low = response.price_low;
        }
      });
    };
    this.coinsService.subcribeToWebsocket(subscriptionFunction);

    this.coinsService.getSymbols(this.coinIds).subscribe((symbols) => {
      localStorage.setItem('mockedSymbols', JSON.stringify(symbols));
      this.coinsService.sendHelloMessage(
        this.coinIds,
        symbols.map((s) => s.symbol_id)
      );
    });
  }

  ngOnDestroy(): void {
    this.coinsService.closeWebsocket();
  }
}
