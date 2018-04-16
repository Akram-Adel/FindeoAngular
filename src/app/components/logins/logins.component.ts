import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LanguageService } from '../../services/language.service';

declare let $:any;

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css']
})
export class LoginsComponent implements OnInit,AfterViewInit {

  language:string;

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );
  }

  ngAfterViewInit() {
    this.tabs();
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

}
