import { Component, OnInit } from '@angular/core';

import { LanguageService } from '../../../services/language.service';

declare let $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  language:string;

  constructor(private languageService:LanguageService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
  }

}
