import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';

import * as _ from 'lodash';

declare let $:any;

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, AfterViewInit, OnDestroy {

  language:string;
  bookmarks:any;
  profileInfo = { isAgent: false }
  subscription:any;



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private userService: UserService,
    private http:HttpClient,
    private searchService:SearchService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.profileInfo.isAgent = this.userService['isAgent'];
    this.userService.userUpdate$.subscribe(res => this.profileInfo.isAgent = this.userService['isAgent']);

    //Get Profile Bookmarks
    this.http.get(this.api.link+'/api/bookmarks', this.api.userHeader()).subscribe({
      next: res => this.searchService.getBookmarkedProperties(res, this.api.userHeader()),
      error: err => this.api.API_ERROR(err, this.language)
    })
    this.subscription = this.searchService.searchImages$.subscribe(res => this.gotBookmarks());
  }

  ngAfterViewInit() {
    this.fotterPadding();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }

  gotBookmarks() {
    $('.overlay').fadeOut();

    console.log( this.searchService.bookmarkedProperties[0] )

    this.bookmarks = []
    this.searchService.bookmarkedProperties.forEach(p => {
      this.bookmarks.push({
        id: p.id,
        image: (p.images[0]) ? p.images[0].image.s3Path : this.searchService.dummyImg,
        title: p.title,
        price: p.price+' '+p.currency,
      })
    });
  }


  delete(bookmark) {
    this.http.get(this.api.link+'/api/bookmarks', this.api.userHeader()).subscribe({
      next: res => {
        let bookmarkId = _.find(res, ['propertyId', bookmark.id]).id,
          bookmarkIndex = _.findIndex(this.bookmarks, bookmark)

        this.http.delete(this.api.link+'/api/bookmarks/'+bookmarkId, this.api.userHeader()).subscribe({
          next: res => this.bookmarks.splice(bookmarkIndex, 1),
          error: err => this.api.API_ERROR(err, this.language)
        })

      },
      error: err => this.api.API_ERROR(err, this.language)
    })
  }

}
