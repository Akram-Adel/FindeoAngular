import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { SearchService } from '../../services/search.service';

import * as _ from 'lodash';

declare let $:any;

@Component({
  selector: 'app-my-searches',
  templateUrl: './my-searches.component.html',
  styleUrls: ['./my-searches.component.css']
})
export class MySearchesComponent implements OnInit, AfterViewInit {

  language:string;
  isConnecting:boolean = false;
  profileInfo = { isAgent: false }

  mySearches = [];



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private http:HttpClient,
    private userService:UserService,
    private api:ApiService,
    private router:Router,
    private searchService:SearchService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.profileInfo.isAgent = this.userService['isAgent'];
    this.userService.userUpdate$.subscribe(res => this.profileInfo.isAgent = this.userService['isAgent']);

    this.getSearches();
  }

  ngAfterViewInit() {
    this.fotterPadding();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }


  getSearches() {
    this.http.get<any>(this.api.link+'/api/searches', this.api.userHeader()).subscribe(res => {

      this.mySearches = [];
      res.forEach(result => {
        if(result.userId == this.userService['id']) {
          this.http.get<any>(this.api.link+'/api/notifications?searchId.equals='+result.id, this.api.userHeader()).subscribe(res => {
              (res.length > 0) ? result.notifications = true : result.notifications = false;
            if(res.length > 0)   result.notificationsId = res[0].id;
          })
          this.mySearches.push(result);
        }
      });
      console.log(this.mySearches)

    })
  }

  goSearch(query) {
    localStorage.setItem('cityId', null); localStorage.setItem('propertyType', null); localStorage.setItem('serviceType', null);
    const httpOptions = {
      params: new HttpParams({ fromString: query })
    }
    this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe({
      next: res => { this.searchService.newSearch(res); this.router.navigate([this.language+'/listings/default']); this.searchService.searchQuery = httpOptions},
      error: err => this.api.API_ERROR(err, this.language)
    });
  }
  deleteSearch(id){
    this.isConnecting = true;
    this.http.delete(this.api.link+'/api/searches/'+id, this.api.userHeader()).subscribe(res => {
      console.log(res);
      this.ngOnInit();
      this.isConnecting = false;
    })
  }
  notifySearch(id, state) {
    this.isConnecting = true;

    if(state) {
      this.http.delete(this.api.link+'/api/notifications/'+id, this.api.userHeader()).subscribe(res => {
        console.log(res);
        this.ngOnInit();
        this.isConnecting = false;
      })

    } else {
      this.http.post(this.api.link+'/api/notifications', {
        frequency: "WEEKLY",
        searchId: id,
      }, this.api.userHeader()).subscribe(res => {
        console.log(res);
        this.isConnecting = false;
        this.ngOnInit();
      })
    }
  }

}
