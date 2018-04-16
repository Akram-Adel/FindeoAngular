import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CompareProperties } from '../interfaces/compare-properties';

@Injectable()
export class CompareService {

  propertiesSubject = new Subject<any>();

  properties:CompareProperties[] = [];



  constructor() { }



  construct() {
    this.propertiesSubject.next( this.properties );
  }

  deleteProperty(property) {
    let propertiesIndex = this.properties.findIndex( (Property) => Property == property );
    if (propertiesIndex >= 0) {
      this.properties.splice(propertiesIndex, 1);
    }

    this.propertiesSubject.next( this.properties )
  }

  resetProperties() {
    this.properties = [];

    this.propertiesSubject.next( this.properties )
  }

  addProperty(property) {
    this.properties.push( property );

    this.propertiesSubject.next( this.properties );
  }

}
