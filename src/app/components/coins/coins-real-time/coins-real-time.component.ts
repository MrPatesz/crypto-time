import { Component, Input, OnInit } from '@angular/core';
import { WebsocketMessage } from 'src/app/models/websocket-message';
import { ApiCoinsService } from 'src/app/services/coins/api-coins.service';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';
import { MockedCoinsService } from 'src/app/services/coins/mocked-coins.service';
import { Symbol } from 'src/app/models/symbol';

interface TableItem {
  coinId: string;
  high: number;
  low: number;
  lastUpdated: string;
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
    let oldTableData = this.tableData;
    this.tableData = [];
    this.coinIds.forEach((coinId) => {
      this.tableData.push({
        coinId: coinId,
        high: oldTableData.find((d) => d.coinId === coinId)?.high ?? 0,
        low: oldTableData.find((d) => d.coinId === coinId)?.low ?? 0,
        lastUpdated: new Date().toString(),
      });
    });
  }

  ngOnInit(): void {
    this.fillTableData();

    let subscriptionFunction = (message: WebsocketMessage) => {
      if (this.coinIds.length !== this.tableData.length) {
        this.getSymbolsAndSendHelloMessage();
        this.fillTableData();
      }
      let response = <WebsocketMessage>message;
      this.coinIds.forEach((id) => {
        let symbolId = 'BINANCE_SPOT_' + id + '_USDT';
        if (response.symbol_id === symbolId) {
          let tableRowData = this.tableData.find((d) => d.coinId === id);
          let time = new Date().getTime();
          let lastUpdated = new Date(tableRowData!.lastUpdated).getTime();
          if (time - lastUpdated >= 1000) {
            tableRowData!.high = response.price_high;
            tableRowData!.low = response.price_low;
            tableRowData!.lastUpdated = new Date().toString();
          }
        }
      });
    };
    this.coinsService.subcribeToWebsocket(subscriptionFunction);

    this.getSymbolsAndSendHelloMessage();
  }

  private getSymbolsAndSendHelloMessage() {
    this.coinsService.getSymbols(this.coinIds).subscribe((symbols) => {
      this.persistMockData(symbols);
      this.coinsService.sendHelloMessage(
        this.coinIds,
        symbols.map((s) => s.symbol_id)
      );
    });
  }

  private persistMockData(symbols: Symbol[]) {
    localStorage.setItem('mockedSymbols', JSON.stringify(symbols));
  }

  ngOnDestroy(): void {
    this.coinsService.closeWebsocket();
  }
}
