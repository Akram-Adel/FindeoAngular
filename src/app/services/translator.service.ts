import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslatorService {

  constructor(
    private api:ApiService,
    private http:HttpClient) { }

  public translatorObj = {
    SALE: [],
    RENTAL: [],
    All: []
  }



  private translatorValue = new Subject<string>();
  translator$:Observable<string> = this.translatorValue.asObservable();
  public getTranslatorObj() {
    let $this = this,
      total = 10,
      done = 0;

    this.http.get<any[]>(this.api.link+'/api/public/properties/currency-types/ar/SALE').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.SALE.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/currency-types/ar/RENTAL').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.RENTAL.push(item)
      });
      checkDone();
    })

    this.http.get<any[]>(this.api.link+'/api/public/properties/property-types/ar/SALE').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.SALE.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/property-types/ar/RENTAL').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.RENTAL.push(item)
      });
      checkDone();
    })

    this.http.get<any[]>(this.api.link+'/api/public/properties/land-measure-types/ar/HOUSE').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/land-measure-types/ar/UNIT').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/land-measure-types/ar/LAND').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/land-measure-types/ar/FARM').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })

    this.http.get<any[]>(this.api.link+'/api/public/properties/building-qualities/ar').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })
    this.http.get<any[]>(this.api.link+'/api/public/properties/age-types/ar').subscribe(res => {
      res.forEach(item => {
        this.translatorObj.All.push(item)
      });
      checkDone();
    })

    function checkDone() {
      done += 1;
      if(done = total) $this.translatorValue.next('done translation')
    }
  }

}
