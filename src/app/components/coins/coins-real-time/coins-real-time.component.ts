import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    this.coinIds.forEach((c, idx) => {
      this.tableData.push({ coinId: c, high: 2 * (idx + 1), low: idx + 1 });
    });
  }
}
