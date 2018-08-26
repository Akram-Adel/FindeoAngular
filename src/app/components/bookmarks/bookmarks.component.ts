import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

declare let $:any;

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, AfterViewInit {

  language:string;
  bookmarks:any;

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private apiService:ApiService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    //Get Profile Bookmarks
    this.bookmarks = this.apiService.api.bookmarks;
  }

  ngAfterViewInit() {
    this.fotterPadding();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }

}
