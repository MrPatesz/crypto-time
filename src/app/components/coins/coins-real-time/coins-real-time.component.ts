import { Component, Input, OnInit } from '@angular/core';
import { WebsocketMessage } from 'src/app/models/websocket-message';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';

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
})
export class CoinsRealTimeComponent implements OnInit {
  @Input()
  coinIds!: string[];

  tableItems: TableItem[] = [];
  displayedColumns: string[] = ['coinId', 'high', 'low'];

  constructor(private coinsService: ICoinsService) {}

  ngOnInit(): void {
    this.fillTableData();

    let subscriptionFunction = (message: WebsocketMessage) => {
      if (this.coinIds.length !== this.tableItems.length) {
        this.getSymbolsAndSendHelloMessage();
        this.fillTableData();
      }
      let response = <WebsocketMessage>message;
      this.coinIds.forEach((id) => {
        let symbolId = 'BINANCE_SPOT_' + id + '_USDT';
        if (response.symbol_id === symbolId) {
          let tableRowData = this.tableItems.find((d) => d.coinId === id);
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

  ngOnDestroy(): void {
    this.coinsService.closeWebsocket();
  }

  private fillTableData(): void {
    let oldTableItems = this.tableItems;
    this.tableItems = [];
    this.coinIds.forEach((coinId) => {
      this.tableItems.push({
        coinId: coinId,
        high: oldTableItems.find((item) => item.coinId === coinId)?.high ?? 0,
        low: oldTableItems.find((item) => item.coinId === coinId)?.low ?? 0,
        lastUpdated: new Date().toString(),
      });
    });
  }

  private getSymbolsAndSendHelloMessage(): void {
    this.coinsService.getSymbols(this.coinIds).subscribe((symbols) => {
      this.coinsService.sendHelloMessage(
        this.coinIds,
        symbols.map((symbol) => symbol.symbol_id)
      );
    });
  }
}
