import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { trigger, transition, query, style, animate } from '@angular/animations';

import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { TranslatorService } from './services/translator.service';

declare let $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        query('app-footer', style({ opacity:0 }), { optional:true }),
        query(':enter', style({ opacity:0 }), { optional: true }),
        query(':leave', [
          style({ opacity:1 }),
          animate('0.2s', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity:0 }),
          animate('0.2s', style({ opacity: 1 }))
        ], { optional: true }),
        query('app-footer', style({ opacity:1 }), { optional:true }),
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private userService:UserService,
    private http:HttpClient,
    private api:ApiService,
    private translator:TranslatorService) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      // ------------------- ROUTER NAVIGATION ----------------------- //
      //Scroll to Top Page
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      $('html, body').animate({
        scrollTop: 0
      }, 500)
      // ------------------- ROUTER NAVIGATION ----------------------- //
    });

    this.translator.getTranslatorObj()
    this.getRememberedUser();
  }



  getRememberedUser() {
    let self = this;

    localStorage.getItem('findeoUserToken') && localStorage.getItem('findeoUserToken') != 'null' ? getUser() : false;
    function getUser() {
      let tokenId = localStorage.getItem('findeoUserToken');

      self.userService.userToken = tokenId;
      self.http.get(self.api.link+'/api/account', self.api.userHeader()).subscribe( user => {
        self.userService.createUser(user);
        self.api.getUserProfile();
        self.api.getAgentProfile();
      });
    }
  }

  getDepth(outlet) {
    return outlet.activatedRouteData['depth'];
  }

}
