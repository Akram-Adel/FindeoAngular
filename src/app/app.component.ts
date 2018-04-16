import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private router: Router) {}

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
  }

}
