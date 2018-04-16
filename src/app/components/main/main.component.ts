import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

declare var $:any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit,AfterViewInit {

  language:string;
  featuredProperties = [];
  clientstestimonials = [];
  popularPlaces = [];
  blog = [];


  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private apiService:ApiService,
    private http:HttpClient) { }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    //Get Featured Properties
    this.featuredProperties = this.apiService.api.featuredListings;

    //Get Testmonials
    this.clientstestimonials = this.apiService.api.testimonials;

    //Get Most Popular Places
    this.popularPlaces = this.apiService.api.topPopularPlaces;

    //Get Blog Posts
    this.blog = this.apiService.api.blog;
  }

  ngAfterViewInit() {
    this.owlCarousel()
    this.parallaxResize();
    this.parallaxBG();
    this.parallaxPosition();
    this.imageBox();
    this.chosenPlugin();
  }



  parallaxResize() {
    var windowH = $(window).height();
    $(".parallax").each(function(i){
      var path = $(this);
      // variables
      var contW = path.width();
      var contH = path.height();
      var imgW = path.attr("data-img-width");
      var imgH = path.attr("data-img-height");
      var ratio = imgW / imgH;
      // overflowing difference
      var diff = 100;
      diff = diff ? diff : 0;
      // remaining height to have fullscreen image only on parallax
      var remainingH = 0;
      if(path.hasClass("parallax") && !$("html").hasClass("touch")){
        //var maxH = contH > windowH ? contH : windowH;
        remainingH = windowH - contH;
      }
      // set img values depending on cont
      imgH = contH + remainingH + diff;
      imgW = imgH * ratio;
      // fix when too large
      if(contW > imgW){
        imgW = contW;
        imgH = imgW / ratio;
      }
      //
      path.data("resized-imgW", imgW);
      path.data("resized-imgH", imgH);
      path.css("background-size", imgW + "px " + imgH + "px");
    });
  }
  parallaxBG() {
    $('.parallax').prepend('<div class="parallax-overlay"></div>');

    $( ".parallax").each(function() {
			var attrImage = $(this).attr('data-background');
			var attrColor = $(this).attr('data-color');
			var attrOpacity = $(this).attr('data-color-opacity');

        if(attrImage !== undefined) {
          $(this).css('background-image', 'url('+attrImage+')');
        }

        if(attrColor !== undefined) {
          $(this).find(".parallax-overlay").css('background-color', ''+attrColor+'');
        }

        if(attrOpacity !== undefined) {
          $(this).find(".parallax-overlay").css('opacity', ''+attrOpacity+'');
        }
		});
  }
  parallaxPosition() {
    if( !$("html").hasClass("touch") ) {
      var heightWindow = $(window).height();
	    var topWindow = $(window).scrollTop();
	    var bottomWindow = topWindow + heightWindow;
	    var currentWindow = (topWindow + bottomWindow) / 2;
	    $(".parallax").each(function(i){
        var path = $(this);
        var height = path.height();
        var top = path.offset().top;
        var bottom = top + height;
        // only when in range
        if(bottomWindow > top && topWindow < bottom){
          //var imgW = path.data("resized-imgW");
          var imgH = path.data("resized-imgH");
          // min when image touch top of window
          var min = 0;
          // max when image touch bottom of window
          var max = - imgH + heightWindow;
          // overflow changes parallax
          var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
          top = top - overflowH;
          bottom = bottom + overflowH;


          // value with linear interpolation
          // var value = min + (max - min) * (currentWindow - top) / (bottom - top);
          var value = 0;
          if ( $('.parallax').is(".titlebar") ) {
            value = min + (max - min) * (currentWindow - top) / (bottom - top) *2;
          } else {
            value = min + (max - min) * (currentWindow - top) / (bottom - top);
          }

          // set background-position
          var orizontalPosition = path.attr("data-oriz-pos");
          orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
          $(this).css("background-position", orizontalPosition + " " + value + "px");
        }
	    });
    }
  }
  owlCarousel() {
    $('.carousel').owlCarousel({
      autoPlay: false,
      navigation: true,
      slideSpeed: 600,
      items : 3,
      itemsDesktop : [1239,3],
      itemsTablet : [991,2],
      itemsMobile : [767,1]
    });

    $('.owl-next, .owl-prev').on("click", function (e) {
      e.preventDefault();
    });
  }
  imageBox() {
    $('.img-box').each(function(){
      // add a photo container
      $(this).append('<div class="img-box-background"></div>');

      // set up a background image for each tile based on data-background-image attribute
      $(this).children('.img-box-background').css({'background-image': 'url('+ $(this).attr('data-background-image') +')'});
    });
  }
  chosenPlugin() {
    var config = {
      '.chosen-select'           : {disable_search_threshold: 10, width:"100%"},
      '.chosen-select-deselect'  : {allow_single_deselect:true, width:"100%"},
      '.chosen-select-no-single' : {disable_search_threshold:100, width:"100%"},
      '.chosen-select-no-single.no-search' : {disable_search_threshold:10, width:"100%"},
      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
      '.chosen-select-width'     : {width:"95%"}
    };

    for (var selector in config) {
      if (config.hasOwnProperty(selector)) {
        $(selector).chosen(config[selector]);
      }
    }

    /*  Custom Input With Select
    /*----------------------------------------------------*/
    $('.select-input').each(function(){
      var thisContainer = $(this);
      var $this = $(this).children('select'), numberOfOptions = $this.children('option').length;

      $this.addClass('select-hidden');
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"></div>');
      var $styledSelect = $this.next('div.select-styled');
      $styledSelect.text($this.children('option').eq(0).text());

      var $list = $('<ul />', {
        'class': 'select-options'
      }).insertAfter($styledSelect);

      for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
        }).appendTo($list);
      }

      var $listItems = $list.children('li');

      $list.wrapInner('<div class="select-list-container"></div>');


      $(this).children('input').on('click', function(e){
        $('.select-options').hide();
        e.stopPropagation();
        $styledSelect.toggleClass('active').next('ul.select-options').toggle();
      });

      $(this).children('input').keypress(function() {
        $styledSelect.removeClass('active');
        $list.hide();
      });


      $listItems.on('click', function(e){
        e.stopPropagation();
        // $styledSelect.text($(this).text()).removeClass('active');
        $(thisContainer).children('input').val( $(this).text() ).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
        //console.log($this.val());
      });

      $(document).on('click', function(e){
        $styledSelect.removeClass('active');
        $list.hide();
      });


      // Unit character
      var fieldUnit = $(this).children('input').attr('data-unit');
      $(this).children('input').before('<i class="data-unit">'+ fieldUnit + '</i>');
    });
  }

}
