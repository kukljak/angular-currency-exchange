import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from "rxjs/operators"
import * as CanvasJS from '../canvasjs.min';
import { ContentService } from './contentService';
import { ApiDataModel } from './contentModel';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  public currencyList: Array<ApiDataModel>;
  public listExchange: Array<any>;
  private daylist: Array<string>;
  private currency: string;
  dates = new FormGroup({
    start: new FormControl(''),
    end: new FormControl('')
  });
  
  constructor(private http: HttpClient, public contentService: ContentService) {}

  ngOnInit(): void { 
    this.contentService.getCurrencyList().pipe(tap(currency => this.currencyList = currency)).subscribe();
  }

  handleCurrency(data: ApiDataModel):void {
    this.currency = data.cc;
  }

  exchange() {
    this.listExchange = [] 
    this.daylist = this.contentService.getDateArray(this.dates.value.start, this.dates.value.end);

    this.contentService.getExchangeListDates(this.daylist, this.currency)
    .subscribe( (x) => {
      let [changeFormat]:any = x;
      this.listExchange.push(changeFormat);
      this.drawGraph();
    });
  }

  drawGraph():void {
  let dataPoints: Array<any> = [];
	for ( var i = 0; i < this.listExchange.length; i++ ) { 
		dataPoints.push({
      x: new Date(this.daylist[i]),
      y: this.listExchange[i].rate
    });
	}
	let chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		animationEnabled: true,
		exportEnabled: false,
		title: {
			text: "Exchange Graph"
		},
		data: [
		{
			type: "line",                
			dataPoints: dataPoints
		}]
	});
	
	chart.render();
  }

}
