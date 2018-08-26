import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { CompareValidator } from '../../shared/compare.validator';

declare let $:any;

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css']
})
export class LoginsComponent implements OnInit,AfterViewInit {

  language:string;

  regForm:FormGroup;
  logForm:FormGroup;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isConnecting = false;
  emailERR = false;
  generalERR = false;
  invalidERR = false;


  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private languageService:LanguageService,
    private userService:UserService,
    private http:HttpClient,
    private fb:FormBuilder,
    private api:ApiService) {

      this.regForm = this.fb.group({
        email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(this.emailPattern)])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        repassword: [null, Validators.required],
        firstName: [null, Validators.required]
      }, {
        validator: [CompareValidator.matchingConfirmPasswords]
      })

      this.logForm = this.fb.group({
        email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(this.emailPattern)])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        rememberMe: [false]
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );
  }

  ngAfterViewInit() {
    this.tabs();
    this.fotterPadding();
  }



  tabs() {
    var $tabsNav = $('.tabs-nav'),
    $tabsNavLis = $tabsNav.children('li');

    $tabsNav.each(function() {
      var $this = $(this);

      $this.next().children('.tab-content').stop(true,true).hide()
      .first().show();

      $this.children('li').first().addClass('active').stop(true,true).show();
    });

    $tabsNavLis.on('click', function(e) {
      var $this = $(this);

      $this.siblings().removeClass('active').end()
      .addClass('active');

      $this.parent().next().children('.tab-content').stop(true,true).hide()
      .siblings( $this.find('a').attr('href') ).fadeIn();

      e.preventDefault();
    });
    var hash = window.location.hash;
    var anchor = $('.tabs-nav a[href="' + hash + '"]');
    if (anchor.length === 0) {
      $(".tabs-nav li:first").addClass("active").show(); //Activate first tab
      $(".tab-content:first").show(); //Show first tab content
    } else {
      console.log(anchor);
      anchor.parent('li').click();
    }
  }
  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }


  register(form) {
    let self = this;
    this.isConnecting = true;

    this.http.post(this.api.link+'/api/register',{
      "email": form.email,
      "login": form.email,
      "firstName": form.firstName,
      "password": form.password,
      "langKey": self.language
    })
    .subscribe({
      next: res => this.API_regSuccess(res),
      error: err => this.API_regError(err)
    })
  }
  API_regSuccess(res) {
    let self = this;

    // Get an admin token
    this.api.getAdminToken().subscribe({
      next: res => { this.api.makeAdminToken(res); getNewUser(); },
      error: err => this.api.API_ERROR(err, null)
    })

    // Get the newly created user using the admin token
    let newUser;
    function getNewUser() {
      self.http.get(self.api.link+'/api/users?size=10000', self.api.adminHeader()).subscribe({
        next: users => {
          newUser = _.find(users, {email: self.regForm.value.email});
          newUser.activated = true;
          activateUser();
        },
        error: err => this.API_regError(err)
      });
    }

    // Activate the new user
    function activateUser() {
      self.http.put(self.api.link+'/api/users', newUser, self.api.adminHeader()).subscribe({
        next: res => {
          self.isConnecting = false;
          userToken();
        },
        error: err => self.API_regError(err)
      })
    }

    // Get new user token
    function userToken() {
      self.http.post(self.api.link+'/api/authenticate', {
        "password": self.regForm.value.password,
        "rememberMe": true,
        "username": self.regForm.value.email
      }).subscribe({
        next: token => {
          self.userService.makeUserIdToken(token);
          self.userService.createUser(newUser);
          makeProfile();
        },
        error: err => self.API_regError(err)
      });
    }

    // make a user profile
    function makeProfile() {
      self.http.post(self.api.link+'/api/profiles', {
        phone: '',
        avatarId: null,
        userId: self.userService['id']
      }, self.api.userHeader()).subscribe({
        next: res => {
          self.api.getUserProfile();
          self.api.getAgentProfile();
          self.router.navigate(['/'+self.language+'/profile']);
      },
        error: err => self.API_regError(err)
      })
    }
  }
  API_regError(err) {
    switch (err.error.errorKey) {
      case "userexists":
        this.emailERR = true;
        this.isConnecting = false;
        break;

      default:
        this.emailERR = false;
        this.generalERR = true;
        this.isConnecting = false;
        break;
    }
  }


  login(form) {
    this.isConnecting = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }
    this.http.post(this.api.link+'/api/authenticate', {
      "username": form.email,
      "rememberMe": form.rememberMe,
      "password": form.password
    }, httpOptions).subscribe({
      next: token => this.API_logSuccess(token),
      error: err => this.API_logError(err)
    })
  }
  API_logSuccess(token) {
    // regester the user token id
    this.userService.makeUserIdToken(token);

    // create the user & remember him if checked
    this.http.get(this.api.link+'/api/account', this.api.userHeader()). subscribe({
      next: res => {
        this.userService.createUser(res);
        this.api.getUserProfile();
        this.api.getAgentProfile();
        this.logForm.value.rememberMe ? this.userService.rememberUser() : false;
        this.router.navigate(['/'+this.language+'/main']);
      },
      error: err => this.API_logError(err)
    })

    this.isConnecting = false;
  }
  API_logError(err) {
    switch (err.error.title) {
      case "Unauthorized":
        this.invalidERR = true;
        this.isConnecting = false;
        break;

      default:
        this.invalidERR = false;
        this.generalERR = true;
        this.isConnecting = false;
        break;
    }
  }

}
