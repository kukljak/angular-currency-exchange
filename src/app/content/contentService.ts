import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { from, Observable } from "rxjs";
import { concatMap, map, tap } from "rxjs/operators";
import { ApiDataModel } from "./contentModel";

@Injectable({
    providedIn: 'root',
  })
export class ContentService  {

  private url: string = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/';

  constructor(public http: HttpClient, public datePipe: DatePipe,) {}

  ngOnInit(): void {
    
  }

  getCurrencyList(): Observable<any> {
    return this.http.get(this.url+'exchangenew?json');
  }

  getExchangeListDates(date:Array<string>, currency:string): Observable<ApiDataModel> {
    let newDataFormatArr: Array<string> = date.map(el => {
      let newDate = (parseInt(el.slice(0,10).split("-").join("")) + 1).toString();
      return newDate;
    });
    
    return from(newDataFormatArr).pipe(
      concatMap( date => <Observable<ApiDataModel>> this.http.get(`${this.url}exchange?valcode=${currency}&date=${date}&json`))
    )
  }

  getDateArray( start: Date, end: Date ): Array<string> {
    let startDate = start;
    let endDate = end;
    let list = this.createDaysArray(new Date(startDate),new Date(endDate));
    return list;
  }

  createDaysArray(start:Date, end:Date) {
    let newArr: string[] = [];
    for(var arr: Date[]=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    arr.forEach( value => {newArr.push(value.toISOString())});
    return newArr;
  };
  
}