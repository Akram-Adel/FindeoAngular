import { Component, OnInit } from '@angular/core';

import { LanguageService } from '../../../services/language.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

declare let $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  language:string;
  firstName:string = null;
  email:string = null;
  imageUrl:string = null;

  constructor(
    private languageService:LanguageService,
    private userService:UserService,
    private router:Router) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.userService.userUpdate$.subscribe( res => this.updateUser() )
  }



  userMenu() {
    $('#responsive .user-menu').toggleClass('active');
    // console.log( $('#responsive .user-menu') )
  }

  updateUser() {
    this.firstName = this.userService['firstName'];
    this.email = this.userService['email'];
    this.imageUrl = this.userService['imageUrl'];
  }

  logOut() {
    this.userService.destroyUser();
    this.router.navigate(['/'+this.language+'/main']);
  }

}
