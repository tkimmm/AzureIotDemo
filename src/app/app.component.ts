import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Azure IOT Demo';

  constructor(private _ds: DataService) { }
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Temperature', yAxisID: 'y-axis-1' },
    { data: [], label: 'Humidity' }
  ];
  public lineChartLabels: Label[] = []

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(0,0,0,0)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        formatter: function (value, context) {
          return null
        },
        anchor: 'end',
        align: 'end',
        font: {
          size: 16,
        }
      }
    }
  };
  public lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }
  public hideOne() {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }
  public changeColor() {
    switch (this.lineChartColors[0].borderColor) {
      case 'red':
        this.lineChartColors[0].borderColor = 'green';
        this.lineChartColors[0].backgroundColor = `rgba(0, 255, 0, 0.3)`;
        this.lineChartOptions.scales.yAxes[1].ticks.fontColor = `rgba(0, 255, 0, 0.3)`;
        break
      case 'green':
        this.lineChartColors[0].borderColor = '#5DA2D5';
        this.lineChartColors[0].backgroundColor = `#90CCF4`;
        break
      default:
        this.lineChartColors[0].borderColor = 'red';
        this.lineChartColors[0].backgroundColor = `rgba(255,0,0,0.3)`;
    }
  }
  public getStream(): void {
    this._ds.getSignalR();
    this._ds.iotHubData.subscribe(() => {
      this.lineChartData.forEach((x, i) => {
        if (i == 0) {
          x.data.push(this._ds.getTempStorage())
        } else {
          x.data.push(this._ds.getHumidStorage())
        }
      });
      this.lineChartLabels.push(this._ds.getCurrentDateTime());
    });
  }
  public stopStream(): void {
    this._ds.stopSignalR()
  }
  test(): void {
  }
  ngOnInit(): void {
  }


}
