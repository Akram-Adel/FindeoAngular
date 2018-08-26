import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';

declare let $:any;

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit,AfterViewInit,OnDestroy {

  language:string;
  properties:any;
  subscription:any = [];

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private http:HttpClient,
    private userService:UserService,
    private searchService:SearchService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    (this.userService['id']) ? this.searchService.getProfileProperties(this.userService['id']) : this.userService.userUpdate$.subscribe(res => this.searchService.getProfileProperties(this.userService['id']))
    this.subscription = this.searchService.searchImages$.subscribe(res => this.gotProperties());
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


  gotProperties() {
    $('.overlay').fadeOut();

    this.properties = [];
    // sales
    for(let i=0; i<this.searchService.profileProperties.saleListing.length; i++) {
      let p = this.searchService.profileProperties.saleListing[i]
      this.properties.push({
        id: p.id,
        image: (p.images[0]) ? p.images[0].image.s3Path : 'assets/images/single-property-01.jpg',
        title: p.title,
        adress: p.location.city +' '+ p.location.street,
        price: p.price +' '+p.currency,
      })
    }
    // rent
    for(let i=0; i<this.searchService.profileProperties.rentalListing.length; i++) {
      let p = this.searchService.profileProperties.rentalListing[i]
      this.properties.push({
        id: p.id,
        image: (p.images[0]) ? p.images[0].image.s3Path : 'assets/images/single-property-01.jpg',
        title: p.title,
        adress: p.location.city +' '+ p.location.street,
        price: p.price +' '+p.currency,
      })
    }
  }

  delete(property) {
    this.http.delete(this.api.link+'/api/properties/'+property.id, this.api.userHeader()).subscribe(res => console.log(res))
  }

}
