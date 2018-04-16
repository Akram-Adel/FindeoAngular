import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { LanguageService } from '../../../services/language.service';
import { CompareService } from '../../../services/compare.service';

import { CompareProperties } from '../../../interfaces/compare-properties';

declare let $:any;

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  language:string;
  properties$:Observable<CompareProperties[]>;

  constructor(
    private languageService:LanguageService,
    private compareService:CompareService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );

    this.compareService.propertiesSubject.subscribe( properties => this.properties$ = properties );
    this.compareService.construct();
  }



  delete(property, index) {
    $('.listing-item.compact:eq('+index+')').fadeOut( 'slow', () => this.compareService.deleteProperty(property) );
  }

  reset() {
    $('.listing-item.compact').fadeOut( 'slow', () => this.compareService.resetProperties() );
  }

}
