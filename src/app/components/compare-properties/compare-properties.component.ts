import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LanguageService } from '../../services/language.service';
import { CompareService } from '../../services/compare.service';

import { CompareProperties } from '../../interfaces/compare-properties';

@Component({
  selector: 'app-compare-properties',
  templateUrl: './compare-properties.component.html',
  styleUrls: ['./compare-properties.component.css']
})
export class ComparePropertiesComponent implements OnInit {

  language:string;
  properties$:Observable<CompareProperties[]>;
  property1:any;
  property2:any;
  property3:any;
  empty:CompareProperties = {
    link: '---',
    state: '---',
    name: '---',
    price: '---',
    image: '---',
    area: 0,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    airConditioning: false,
    swimmingPool: false,
    laundryRoom: false,
    windoCovering: false,
    gym: false,
    internet: false,
    alarm: false,
    age: '---',
    heating: '---',
    parking: false,
    sewer: '---'
  }

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private compareService:CompareService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.compareService.propertiesSubject.subscribe( properties => {
      this.properties$ = properties.slice().reverse();
      this.properties$[0] ? this.property1 = this.properties$[0] : this.property1 = this.empty;
      this.properties$[1] ? this.property2 = this.properties$[1] : this.property2 = this.empty;
      this.properties$[2] ? this.property3 = this.properties$[2] : this.property3 = this.empty;
    });
    this.compareService.construct();
  }

}
