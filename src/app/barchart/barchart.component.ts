import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-barchart',
  template: `
  <div>
  <div style="display: block">
    <canvas baseChart
            [datasets]="barChartData"
            [labels]="barChartLabels"
            [options]="barChartOptions"
            [legend]="barChartLegend"
            [chartType]="barChartType">
    </canvas>
  </div>
</div>`,
})
export class BarchartComponent implements OnInit {

  constructor(private _ds: DataService) {}

  temperature: number
  humidity: number

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          return Math.round(value * 100) / 100
      },
        anchor: 'end',
        align: 'end',
        font: {
          size: 16,
        }
      }
    }
  };
  public barChartLabels = [this._ds.getCurrentDateTime()];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [0], label: 'Temperature'},
    {data: [0], label: 'Humidity'}
  ];
  public barChartPlugins = [pluginDataLabels];
  ngOnInit(): void {
    this._ds.iotHubData.subscribe(() => {
      this.barChartData[0]['data'] = [this._ds.getTempStorage()]
      this.barChartData[1]['data']  = [this._ds.getHumidStorage()]
    });
  }

}
