import { Component, Input, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebsocketMessage } from 'src/app/models/websocket-message';

interface TableItem {
  coinId: string;
  high: number;
  low: number;
}

@Component({
  selector: 'app-coins-real-time',
  templateUrl: './coins-real-time.component.html',
  styleUrls: ['./coins-real-time.component.scss'],
})
export class CoinsRealTimeComponent implements OnInit {
  @Input()
  coinIds!: string[];

  tableData: TableItem[] = [];
  displayedColumns: string[] = ['coinId', 'high', 'low'];

  subject: WebSocketSubject<unknown> = webSocket('ws://ws.coinapi.io/v1/');

  constructor() {}

  ngOnInit(): void {
    this.coinIds.forEach((c, idx) => {
      this.tableData.push({ coinId: c, high: 2 * (idx + 1), low: idx + 1 });
    });

    this.subject.subscribe((message) => {
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
    let helloMessage = {
      type: 'hello',
      apikey: '7602D7C3-AAD3-4E2B-B44E-82A24F734EA8',
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_period_id: ['1MIN'],
      subscribe_filter_asset_id: this.coinIds,
      subscribe_update_limit_ms_quote: 10000,
      //subscribe_filter_symbol_id: ['BITSTAMP_SPOT_BTC_USD$'],
    };
    this.subject.next(helloMessage);
  }

  ngOnDestroy(): void {
    this.subject.complete();
  }
}
