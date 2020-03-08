import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';


@Component({
  selector: 'app-piechart',
  template: `<div class="uk-grid-divider uk-child-width-expand@s" uk-grid>
  <div class="uk-panel">
    <app-barchart></app-barchart>
  </div>
    <div style="display: block">
        <canvas baseChart
          [data]="polarAreaChartData"
          [labels]="polarAreaChartLabels"
          [legend]="polarAreaLegend"
          [options]="polarChartOptions" 
          [chartType]="polarAreaChartType">
        </canvas>
      </div>
    
    </div>`
})
export class PiechartComponent implements OnInit {

  constructor(private _ds: DataService) {}
  humidity: number;
  temperature: number;

  // PolarArea
  public polarAreaChartLabels: Label[] = ['Temperature', 'Humidity', 'Category 3', 'Category 4', 'Category 5'];
  public polarAreaChartData: SingleDataSet = [0,0,0,0,0]
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';
  public polarChartOptions: ChartOptions = {
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

  ngOnInit(): void {
    this._ds.iotHubData.subscribe(() => {
      this.polarAreaChartData = [this._ds.getTempStorage(), this._ds.getHumidStorage(),this._ds.getRandomInt(40),this._ds.getRandomInt(40), this._ds.getRandomInt(40)]
      this.temperature = this._ds.getTempStorage()
      this.humidity = this._ds.getHumidStorage()
    });
  }

}
