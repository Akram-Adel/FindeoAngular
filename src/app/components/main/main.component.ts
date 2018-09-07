import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';

import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { SearchService } from '../../services/search.service';

declare var $:any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit,AfterViewInit,OnDestroy {

  language:string;

  private searchTerm = new Subject<string>();
  areas$:Observable<any[]>;
  isAutofill:boolean = false;

  searchForm:FormGroup;
  servicetypeList:any = [];
  propertytypeList:any = [];
  cityList:any = [];
  selectedCity:any = {};

  subscription:any = [];
  featuredProperties:any = [];
  clientstestimonials = [];
  popularPlaces = [];
  blog = [];


  constructor(
    private route:ActivatedRoute,
    private languageService:LanguageService,
    private api:ApiService,
    private http:HttpClient,
    private router:Router,
    private fb:FormBuilder,
    private searchService:SearchService) {

      this.searchForm = this.fb.group({
        serviceType: ["SALE"],
        propertyType: ["null"],
        city: [null],
        regionCityId: [null]
      })
    }

  ngOnInit() {
    this.languageService.language$.subscribe( language => this.language = language );
    this.languageService.changeLanguage( this.route.snapshot.paramMap.get('lng') );

    this.areas$ = this.searchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term:string) => this.searchArea(term))
      );

    //Get Featured Properties
    this.searchService.getFeaturedProperties();
    this.subscription = this.searchService.searchImages$.subscribe(res => this.gotFeatured());
  }

  ngAfterViewInit() {
    // this.owlCarousel();
    this.parallaxResize();
    this.parallaxBG();
    this.parallaxPosition();
    this.imageBox();
    this.chosenPlugin();
    this.fotterPadding();

    this.getServiceType(); this.getPropertyType(); this.chosenCities()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      '.chosen-select-width'     : {width:"49%"}
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
  fotterPadding() {
    $('router-outlet ~ *').children().first().css('background-color', '#fff');
    $('router-outlet ~ *').children().first().css('margin-bottom', $('.sticky-footer').outerHeight( true )+'px');
  }

  getServiceType() {
    let self = this;

    // get service type array
    this.http.get(this.api.link+'/api/public/properties/service-types/ar').subscribe({
      next: res => putservicetypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putservicetypeArray(servicetype) {
      self.servicetypeList = servicetype;
      setTimeout(() => $('.api-updated-servicetype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-servicetype').on('change', (ev, params) => {
      self.searchForm.controls.serviceType.setValue(params.selected);
      self.getPropertyType();
    })
  }
  getPropertyType() {
    let self = this;

    // get property type array
    this.http.get(this.api.link+'/api/public/properties/property-types/ar/'+this.searchForm.controls.serviceType.value).subscribe({
      next: res => putPropertytypeArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add property type array to the DOM and update the chosenPlugin()
    function putPropertytypeArray(propertytype) {
      self.propertytypeList = propertytype;
      setTimeout(() => $('.api-updated-propertytype').trigger("chosen:updated"), 100);
    }

    // attach a change event
    $('.api-updated-propertytype').on('change', (ev, params) => {
      self.searchForm.controls.propertyType.setValue(params.selected);
    })
  }
  chosenCities() {
    let self = this;

    // attach a change event
    $('.api-updated-cities').on('change', (ev, params) => {
      if(params.selected == 'null') {
        self.selectedCity = {}; self.searchForm.controls.city.setValue(null);
        $('#areaInput').val(null); self.searchForm.controls.regionCityId.setValue(null);

      } else {
        self.selectedCity = _.find(self.cityList, {name: params.selected});
        self.searchForm.controls.city.setValue(self.selectedCity.id);
        $('#areaInput').val(null); self.searchForm.controls.regionCityId.setValue(null);
      }
    })

    // get city array
    const httpOptions = {
      params: new HttpParams()
        .set( 'parentId.specified', 'false' )
    }
    this.http.get(this.api.link+'/api/public/regions', httpOptions).subscribe({
      next: res => putCityArray(res),
      error: err => this.api.API_ERROR(err, this.language)
    })

    // add city array to the DOM and update the chosenPlugin()
    function putCityArray(cities) {
      self.cityList = cities;
      setTimeout(() => $('.api-updated-cities').trigger("chosen:updated"), 100);
    }
  }


  searchInput(term:string):void {
    this.searchTerm.next(term);
  }
  searchArea(term): Observable<any[]> {
    if(!term.trim() || term.trim().length < 4) {
      return of([]);
    }
    this.isAutofill = true;
    return this.http.get<any[]>(this.api.link+'/api/public/regions/search/'+this.selectedCity.id+'/'+term)
  }
  autofill(area) {
    $('#areaInput').val(area.arabicName); this.searchForm.controls.regionCityId.setValue(area.countryId)
  }
  areaBlur() {
    setTimeout(() => this.isAutofill = false, 200);
  }

  search(form) {
    let paramsStr = `serviceType.in=${form.serviceType}&size=100`;
      if(form.propertyType !== 'null') paramsStr += `&propertyType.in=${form.propertyType}`;
      if(form.city !== null)           paramsStr += `&cityId.equals=${form.city}`;
      if(form.regionCityId !== null)   paramsStr += `&regionId.equals=${form.regionCityId}`;

    localStorage.setItem( 'serviceType', form.serviceType )
    localStorage.setItem( 'propertyType', form.propertyType )
    localStorage.setItem( 'cityId', form.city )

    const httpOptions = {
      params: new HttpParams({ fromString: paramsStr })
    }
    this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe({
      next: res => { this.searchService.newSearch(res); this.router.navigate([this.language+'/listings/default']); this.searchService.searchQuery = httpOptions},
      error: err => this.api.API_ERROR(err, this.language)
    });
  }

  journy(type, service) {
    if(!type || !service) { return };
    const httpOptions = {
      params: new HttpParams()
        .set( 'serviceType.in',  service )
        .set( 'propertyType.in', type )
        .set( 'size', '1000')
    }
    this.http.get(this.api.link+'/api/public/properties', httpOptions).subscribe({
      next: res => { this.searchService.newSearch(res); this.router.navigate([this.language+'/listings/default']); this.searchService.searchQuery = httpOptions},
      error: err => this.api.API_ERROR(err, this.language)
    });
  }

  gotFeatured() {
      this.featuredProperties = [];
      //sales
      for(let i=0; i<this.searchService.featuredProperties.saleListing.length; i++) {
        let p = this.searchService.featuredProperties.saleListing[i];
        this.featuredProperties.push({
          id: p.id,
          state: "For Sale",
          name: p.title,
          price: p.price+' '+p.currency,
          area: p.landSize+' '+p.landSizeMeasureType,
          beds: p.bedrooms,
          baths: p.bathrooms,
          image: (p.images && p.images[0]) ? p.images[0].image.s3Path : this.searchService.dummyImg,
        })
      }
      //rent
      for(let i=0; i<this.searchService.featuredProperties.rentalListing.length; i++) {
        let p = this.searchService.featuredProperties.rentalListing[i];
        this.featuredProperties.push({
          id: p.id,
          state: "For Rent",
          name: p.title,
          price: p.price+' '+p.currency,
          area: p.landSize+' '+p.landSizeMeasureType,
          beds: p.bedrooms,
          baths: p.bathrooms,
          image: (p.images && p.images[0]) ? p.images[0].image.s3Path : this.searchService.dummyImg,
        })
      }

      setTimeout(() => {
        this.owlCarousel();
      }, 100);
  }

}
