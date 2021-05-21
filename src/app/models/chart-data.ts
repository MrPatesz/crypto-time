export interface ChartData {
  name: string;
  series: SeriesItem[];
}

export interface SeriesItem {
  name: string;
  value: number;
}
