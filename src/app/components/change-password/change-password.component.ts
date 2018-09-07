import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { CompareValidator } from '../../shared/compare.validator';

declare let $:any;
declare let toastr:any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit,AfterViewInit {

  language:string;
  profileInfo = { isAgent: false }

  isConnecting:boolean = false;
  passwordForm:FormGroup;



  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private fb:FormBuilder,
    private http:HttpClient,
    private userService:UserService,
    private router:Router,
    private api:ApiService) {

      this.passwordForm = this.fb.group({
        password: [null, [Validators.required, Validators.minLength(6)]],
        repassword: [null, [Validators.required, Validators.minLength(6)]]
      }, {
        validator: [CompareValidator.matchingConfirmPasswords]
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.profileInfo.isAgent = this.userService['isAgent'];
    this.userService.userUpdate$.subscribe(res => this.profileInfo.isAgent = this.userService['isAgent']);
  }

  ngAfterViewInit() {
    this.fotterPadding();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }


  changePassword() {
    if(this.passwordForm.valid) {
      this.isConnecting = true;
      this.http.post(this.api.link+"/api/account/change-password", this.passwordForm.controls.password.value, this.api.userHeader()).subscribe({
        next: res => {
          this.isConnecting = false;
          toastr.success('Changes successfull saved', 'Success');
          $('html, body').animate({ scrollTop: 0 }, 500);
        },
        error: err => { this.isConnecting = false; this.api.API_ERROR(err, this.language) }
      })
    }
  }

}
