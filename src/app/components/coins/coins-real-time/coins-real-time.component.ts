import { Component, Input, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
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

  subject: WebSocketSubject<unknown> = webSocket('ws://ws.coinapi.io/v1/');

  constructor(private coinsService: ICoinsService) {}

  private fillTableData() {
    this.tableData = [];
    this.coinIds.forEach((c) => {
      this.tableData.push({ coinId: c, high: 0, low: 0 });
    });
  }

  ngOnInit(): void {
    this.fillTableData();

    this.subject.subscribe((message) => {
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
    });

    this.coinsService.getSymbols(this.coinIds).subscribe((symbols) => {
      localStorage.setItem('mockedSymbols', JSON.stringify(symbols));
      this.sendHelloMessage(symbols.map((s) => s.symbol_id));
    });
  }

  ngOnDestroy(): void {
    this.subject.complete();
  }

  private sendHelloMessage(symbols: string[]) {
    let helloMessage = {
      type: 'hello',
      apikey: 'asd_80F87126-EAF7-4CBC-9D3B-17CC8D136633',
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_period_id: ['1MIN'],
      subscribe_filter_asset_id: this.coinIds,
      subscribe_update_limit_ms_quote: 5000,
      subscribe_filter_symbol_id: symbols,
    };
    this.subject.next(helloMessage);
  }
}
