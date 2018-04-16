import { Component, OnInit } from '@angular/core';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  language:string;

  constructor(private languageService:LanguageService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
  }

}
