import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';
import { TranslatorService } from '../../services/translator.service';

import * as _ from 'lodash';

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
  isConnecting:boolean = false;
  profileInfo = { isAgent: false }



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private http:HttpClient,
    private userService:UserService,
    private searchService:SearchService,
    private translator:TranslatorService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.profileInfo.isAgent = this.userService['isAgent'];
    this.userService.userUpdate$.subscribe(res => this.profileInfo.isAgent = this.userService['isAgent']);

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

    // console.log( this.searchService.profileProperties.saleListing[0] )

    this.properties = [];
    // sales
    for(let i=0; i<this.searchService.profileProperties.saleListing.length; i++) {
      let p = this.searchService.profileProperties.saleListing[i]
      this.properties.push({
        id: p.id,
        image: (p.images[0]) ? p.images[0].image.s3Path : this.searchService.dummyImg,
        title: p.title,
        adress: p.location.city +' '+ p.location.street,

        service: 'SALE',
        priceP: p.price,
        priceC: p.currency,
        price: p.price+' '+p.currency,

        finishDate: -1 * Math.ceil((Math.abs(new Date().getTime()) - Math.abs(new Date(p.ad.finishDate).getTime())) / (1000 * 3600 * 24)),
        statusAr: (p.ad.status == 'SOLD') ? 'مباع' : 'فعال',

        status: p.ad.status,
        adId: p.ad.id,
        adUserId: p.ad.user.id
      })
    }
    // rent
    for(let i=0; i<this.searchService.profileProperties.rentalListing.length; i++) {
      let p = this.searchService.profileProperties.rentalListing[i]
      this.properties.push({
        id: p.id,
        image: (p.images[0]) ? p.images[0].image.s3Path : this.searchService.dummyImg,
        title: p.title,
        adress: p.location.city +' '+ p.location.street,

        service: 'RENTAL',
        priceP: p.price,
        priceC: p.currency,
        price: p.price+' '+p.currency,

        finishDate: -1 * Math.ceil((Math.abs(new Date().getTime()) - Math.abs(new Date(p.ad.finishDate).getTime())) / (1000 * 3600 * 24)),
        statusAr: (p.ad.status == 'SOLD') ? 'مباع' : 'فعال',

        status: p.ad.status,
        adId: p.ad.id,
        adUserId: p.ad.user.id
      })
    }

    this.translate();
    this.isConnecting = false;
  }
  translate() {
    this.properties.forEach(item => {
      if( find(this, item.priceC, item.service) ) item.price = item.priceP +' '+find(this, item.priceC, item.service)['value']
    });

    function find($this, value, service) {
      return _.find($this.translator.translatorObj[service], ['key', value])
    }
  }


  sold(property) {
    if(this.isConnecting) return;
    this.isConnecting = true;
    this.http.put(this.api.link+'/api/ads', {
      id: property.adId,
      status: 'SOLD',
      userId: property.adUserId
    }, this.api.userHeader()).subscribe({
      next: res => this.searchService.getProfileProperties(this.userService['id']),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }

  reactivate(property) {
    if(this.isConnecting) return;
    this.isConnecting = true;
    this.http.put(this.api.link+'/api/ads', {
      id: property.adId,
      status: 'ACTIVE',
      userId: property.adUserId
    }, this.api.userHeader()).subscribe({
      next: res => this.searchService.getProfileProperties(this.userService['id']),
      error: err => this.api.API_ERROR(err, this.language)
    })
  }

  delete(property) {
    if(window.confirm('هل انت متاكد من رغبتك بحذف الاعلان؟')) {

      if(this.isConnecting) return;
      this.isConnecting = true;
      this.http.put(this.api.link+'/api/ads', {
        id: property.adId,
        status: 'DELETED',
        userId: property.adUserId
      }, this.api.userHeader()).subscribe({
        next: res => this.searchService.getProfileProperties(this.userService['id']),
        error: err => this.api.API_ERROR(err, this.language)
      })

    }
  }

}
