import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

declare let $:any;

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, AfterViewInit {

  language:string;
  post:any;
  popularPosts:any;

  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private apiService:ApiService) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    //Get Blog Post
    this.post = this.apiService.api.blogPost;

    //Get Popular Posts
    this.popularPosts = this.apiService.api.popularPosts;
  }

  ngAfterViewInit() {
    this.fotterPadding();
  }



  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }

}
